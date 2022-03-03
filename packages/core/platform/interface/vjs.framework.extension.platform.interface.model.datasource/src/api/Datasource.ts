import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { remove } from '@v-act/vjs.framework.extension.util'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import * as nRecord from './api/Record'
import * as ResultSet from './api/ResultSet'

let primaryKey = 'id',
  each,
  find,
  contains,
  objectUtil,
  arrays

/**
 * @namespace Datasource
 * @catalog 前端实体/普通实体/普通实体
 * @class Datasource
 * @desc 数据源定义<br/>
 * 数据源无法直接创建，请通过普通实体构造工厂服务创建数据源实例<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.Datasource<br/>
 */
let Datasource = function (metadata, db) {
  this.metadata = metadata
  this.metadataJson = null
  this.db = db
  this.instanceId = uuid.generate()
  this.isMultipleSel = false
  this.isDefaultSel = true
  this.dataAmount = 0
  this._eventPool = {}
  this.insertIds = []
  this.updateIds = []
  this.deleteDatas = []
  this.selectIds = []
  this.currentId = null
  this.dataAccessObject = null
}

Datasource.prototype = {
  _getSnapshot: function () {
    if (this._snapshotManager) {
      let snapshot = this._snapshotManager.getCurrentSnapshot()
      if (snapshot) {
        return snapshot.getDatasourceSnapshot(this.instanceId)
      }
    }
    return null
  },

  _r2rs: function (records) {
    return new ResultSet(this.metadata, records)
  },

  _ids2rs: function (ids) {
    let datas = [],
      _this = this
    each(ids, function (id) {
      datas.push(_this.db._getById(id))
    })
    let rs = new ResultSet(this.metadata, datas)
    return rs
  },

  initModule: function (sb) {
    each = sb.util.collections.each
    find = sb.util.collections.find
    contains = sb.util.collections.contains
    objectUtil = sb.util.object
    arrays = sb.util.arrays
  },

  /**
   * 获取数据源实例Id
   * @return String 数据源实例Id
   */
  getInstanceId: function () {
    return this.instanceId
  },

  /**
   *获取数据源元数据信息
   * @return {@link Metadata}
   */
  getMetadata: function () {
    return this.metadata
  },

  /**
   * 设置数据源元数据信息
   *
   * @param {Metadata} meta 元数据信息，可通过MetadataFactory.unSerialize(meta)创建
   */
  setMetadata: function (meta) {
    this.metadata = meta
  },

  /**
   *加载数据
   * @param {Object} params 参数信息
   * {
   * 		datas : Array<Object> 加载数据
   * 		dataAmount : Number 记录总数
   * 		isAppend : Boolean 以添加的方式加载数据
   * }
   * @example datasource.load({"datas":[{"field1":"a","field2":"b"},{"field1":"a1","field2":"b2"}],"isAppend":true})
   * @return {@link ResultSet}
   */
  load: function (params) {
    let datas = this._processLoadDatas(params.datas)
    let dataAmount = params.hasOwnProperty('dataAmount')
      ? params.dataAmount
      : datas.length
    let _fireEvent = params.hasOwnProperty('_fireEvent')
      ? params._fireEvent
      : true
    this.dataAmount = dataAmount
    let isAppend = params.isAppend
    if (!isAppend) {
      //如果已覆盖的方式加载数据,则清空原有状态数据
      this.insertIds = []
      this.updateIds = []
      this.deleteDatas = []
      this.selectIds = []
      let snapshot = this._getSnapshot()
      if (snapshot) {
        snapshot.clearCurrentRecord()
      }
      this.currentId = null
    }
    let rs = new ResultSet(this.metadata, datas)
    let ds = this
    rs.iterate(function (record, i) {
      ds._fireEvent({
        eventName: ds.Events.RECORDPROCESS,
        eventType: ds.Events.LOAD,
        datasource: ds,
        resultSet: rs,
        record: record,
        isAppend: isAppend
      })
    })
    this.db._load(datas, isAppend)
    if (_fireEvent) {
      this._fireEvent({
        eventName: this.Events.LOAD,
        resultSet: rs,
        isAppend: isAppend,
        dataAmount: dataAmount,
        datasource: this
      })
    }
    //是否默认设置当前行
    let defaulSel = params.defaultSel
    defaulSel = typeof defaulSel == 'boolean' ? defaulSel : true
    if (defaulSel) {
      this._defaultSelectFirstRecord()
    }
    return rs
  },

  _fireEvent: function (params) {
    let handlers = []
    let eName = params.eventName
    if (eName == this.Events.RECORDPROCESS) {
      handlers = this._fireRecordProcessEvent(params)
    } else {
      handlers = this._eventPool[eName] || []
    }
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(this, params)
    }
  },
  _fireRecordProcessEvent: function (params) {
    let handlers = []
    let eName = params.eventName
    let ePool = this._eventPool[eName]
    if (ePool) {
      let eHandlers = []
      let fieldCode = params.fieldCode
      if (fieldCode) {
        // 指定触发某个或多个字段的事件
        if (arrayUtil.isArray(fieldCode)) {
          for (let i = 0; i < fieldCode.length; i++) {
            let fcode = fieldCode[i]
            eHandlers = eHandlers.concat(this._eventPool[eName][fcode] || [])
          }
        } else {
          eHandlers = eHandlers.concat(this._eventPool[eName][fieldCode] || [])
        }
      } else {
        // 没有指定具体字段，则触发全部事件
        for (let fieldCode in ePool) {
          if (ePool[fieldCode])
            eHandlers = eHandlers.concat(ePool[fieldCode] || [])
        }
      }
      for (let i = 0; i < eHandlers.length; i++) {
        if (arrayUtil.contains(handlers, eHandlers[i]) == false) {
          handlers.push(eHandlers[i])
        }
      }
    }
    return handlers
  },
  _processLoadDatas: function (datas) {
    //处理加载数据,如果加载数据不存在id值,则补全
    if (datas) {
      let rs = []
      each(datas, function (data) {
        if (!data.hasOwnProperty(primaryKey)) {
          data[primaryKey] = uuid.generate()
        }
        rs.push(data)
      })
      datas = rs
    }
    return datas
  },

  _defaultSelectFirstRecord: function () {
    // 如果DB没有标识为不默认选中记录，则不执行
    let currentRecord = this.getCurrentRecord()
    if (currentRecord) {
      return
    }
    let firstRecord = this.getRecordByIndex(0)
    if (firstRecord) {
      let isMult = this.isMultipleSelect()
      let isDefaultSel = this.isDefaultSelect()
      if (isMult && isDefaultSel) {
        //多选情况下
        this.selectRecords({ records: [firstRecord], isSelect: true })
      }
      this.setCurrentRecord({ record: firstRecord })
    }
  },

  /**
   *新增记录
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 新增记录,
   * 		"position": {@link Datasource#Position|Position} 新增记录位置信息
   * }
   * @example
   *  var datasourceFactory = sandbox.getService("vjs.framework.extension.platform.services.model.datasource.datasourceFactory");
   *  var datasource = datasourceFactory.create(metadata);
   *  datasource.insertRecords({
   * 		"records":[...]
   * 		"position" : datasource.Position.BOTTOM
   * });
   * @return {@link ResultSet}
   */
  insertRecords: function (params) {
    let records = params.records
    let position = params.position ? params.position : this.Position.BOTTOM
    let toInserted = []
    let ds = this
    each(records, function (record) {
      let id = record.getSysId()
      if (ds.getRecordById(id)) {
        throw Error(
          '[Datasource.insertRecords]当前数据源已存在id为:' +
            id +
            '记录，无法新增，请检查！'
        )
      }
      ds.insertIds.push(id)
      toInserted.push(record)
      ds._fireEvent({
        eventName: ds.Events.RECORDPROCESS,
        eventType: ds.Events.INSERT,
        datasource: ds,
        record: record
      })
    })
    let index
    if (position == this.Position.TOP) {
      index = 0
    } else if (position == this.Position.BOTTOM) {
      index = -1
    } else {
      let rs = this.getSelectedRecords()
      if (rs.isEmpty()) {
        index = -1
      } else {
        let min = null,
          max = null
        let db = this
        rs.iterate(function (rd) {
          let id = rd.getSysId()
          let i = db.getIndexById(id)
          if (min == null || i < min) {
            min = i
          }
          if (max == null || i > max) {
            max = i
          }
        })
        if (position == this.Position.BEFORE) {
          index = min
        } else {
          index = max + 1
        }
      }
    }
    this.db._insert(toInserted, index)
    let resultSet = this._r2rs(toInserted)
    this._fireEvent({
      eventName: this.Events.INSERT,
      resultSet: resultSet,
      datasource: this,
      position: position
    })
    let currentId = this.currentId
    let current = find(toInserted, function (record) {
      return record.getSysId() == currentId
    })
    if (!current) {
      //如果当前行处于新增记录中，则不设置当前行
      this.setCurrentRecord({ record: toInserted[0] })
    } else if (currentId == toInserted[0].getSysId()) {
      //2019-07-30 liangzc：如果当前行为新增记录，则删除其改变的数据，解决树型复制后（不复制IsLeaf）会触发值改变事件的问题
      toInserted[0].setChangedData(null)
    }
    return resultSet
  },

  /**
   *更新记录
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 新增记录
   * }
   * @return {@link ResultSet}
   */
  updateRecords: function (params) {
    let records = params.records
    let updated = []
    let ds = this
    each(records, function (record) {
      let diffData = record.getDiff()
      if (diffData && !objectUtil.isEmpty(diffData)) {
        updated.push(record)
        let id = record.getSysId()
        if (!(contains(ds.updateIds, id) || contains(ds.insertIds, id))) {
          ds.updateIds.push(id)
        }
        let changedFieldCodes = []
        for (let changeFieldCode in diffData) {
          changedFieldCodes.push(changeFieldCode)
        }
        ds._fireEvent({
          eventName: ds.Events.RECORDPROCESS,
          eventType: ds.Events.UPDATE,
          fieldCode: changedFieldCodes,
          datasource: ds,
          record: record
        })
      }
    })
    let resultSet = this._r2rs(updated)
    if (updated.length > 0) {
      let oDatas = this.db._update(updated)
      let rs = new ResultSet(this.metadata, oDatas)
      this._fireEvent({
        eventName: this.Events.UPDATE,
        resultSet: resultSet,
        oldResultSet: rs,
        datasource: this
      })
    }
    return resultSet
  },

  /**
   * 根据主键值移除记录
   * @param {Object} params 参数信息
   * {
   * 		ids : Array<String> 主键值集合
   * }
   * @return {@link ResultSet}
   */
  removeRecordByIds: function (params) {
    let ids = params.ids
    let datas = this.db._remove(ids)
    return this._removeRecords(datas)
  },

  _removeRecords: function (datas) {
    let ds = this
    let deleted = []
    each(datas, function (data) {
      let id = data['id']
      if (!remove(ds.insertIds, id)) {
        deleted.push(data)
      }
      remove(ds.updateIds, id)
      remove(ds.selectIds, id)
    })
    this.deleteDatas = this.deleteDatas.concat(deleted)
    let rs = new ResultSet(this.metadata, datas)
    if (datas.length > 0) {
      this._fireEvent({
        eventName: this.Events.DELETE,
        resultSet: rs,
        datasource: this
      })
    }
    let record = this.getRecordByIndex(0)
    if (record) {
      this.setCurrentRecord({ record: record })
    }
    return rs
  },

  /**
   * 清空数据源记录 ,只清空记录
   */
  clear: function () {
    let datas = this.db._getAll()
    if (datas.length > 0) {
      let ids = [],
        temp = []
      for (let i = 0, l = datas.length; i < l; i++) {
        let data = datas[i]
        ids.push(data[primaryKey])
        temp.push(data)
      }
      //sc数据源获取所有数据时,返回引用值,删除时会同步删除数组中的数据
      datas = temp
      this.db._remove(ids)
    }
    this._removeRecords(datas)
    this.reset()
    this.selectIds = []
    let snapshot = this._getSnapshot()
    if (snapshot) {
      snapshot.clearCurrentRecord()
    }
    this.currentId = null
  },
  /**
   *清楚已删除数据
   */
  clearRemoveDatas: function () {
    this.deleteDatas = []
  },

  reset: function () {
    this.insertIds = []
    this.updateIds = []
    this.deleteDatas = []
    //this.db._clearData();
  },

  /**
   * 根据数据源创建一条记录
   * @return {@link Record}
   */
  createRecord: function () {
    let metadata = this.getMetadata()
    let record = new nRecord(metadata, null)
    record.set(primaryKey, uuid.generate())
    return record
  },

  /**
   * 根据主键值获取记录
   * @param {String} id 主键值
   * @return {@link Record}
   */
  getRecordById: function (id) {
    let data = this.db._getById(id)
    return data != null ? new nRecord(this.metadata, data) : null
  },

  /**
   * 根据下标顺序获取记录
   * @param  {Number} index 记录下标(下标从0开始)
   * @return {@link Record}
   */
  getRecordByIndex: function (index) {
    let data = this.db._getByIndex(index)
    return data ? new nRecord(this.metadata, data) : null
  },

  /**
   * 获取所有记录
   * @return {@link ResultSet}
   */
  getAllRecords: function () {
    let datas = this.db._getAll()
    return new ResultSet(this.metadata, datas)
  },
  /**
   * 是否为空数据源
   * @return Boolean
   */
  isEmpty: function () {
    return this.db.isEmpty()
  },

  _getModifyRecords: function (state) {
    let records = this.db.getChangedData(state)
    let datas = []
    if (records && records.length > 0) {
      for (let i = 0, len = records.length; i < len; i++) {
        datas.push(records[i].__recordData__)
      }
    }
    return new ResultSet(this.metadata, datas)
  },

  _getDatasById: function (ids) {
    let datas = []
    let ds = this
    each(ids, function (id) {
      datas.push(ds.db._getById(id))
    })
    return new ResultSet(this.metadata, datas)
  },

  /**
   * 获取新增记录
   * @return {@link ResultSet}
   */
  getInsertedRecords: function () {
    return this._getDatasById(this.insertIds)
  },

  /**
   * 获取更新记录
   * @return {@link ResultSet}
   */
  getUpdatedRecords: function () {
    return this._getDatasById(this.updateIds)
  },

  /**
   * 获取已删除记录
   * @return {@link ResultSet}
   */
  getDeletedRecords: function () {
    return new ResultSet(this.metadata, this.deleteDatas)
  },
  /**
   * 获取数据源中所有已选中记录
   * @return {@link ResultSet}
   */
  getSelectedRecords: function () {
    if (!this.isMultipleSelect()) {
      //如果为单选db，则跟当前行同步，加入快照功能 xiedh 2016-09-18
      let rd = this.getCurrentRecord()
      let datas = rd ? [rd] : []
      return this._r2rs(datas)
    }
    return this._getDatasById(this.selectIds)
  },
  /**
   * 获取数据源中当前行记录
   * @return {@link Record}
   */
  getCurrentRecord: function () {
    let snapshot = this._getSnapshot()
    if (snapshot) {
      //TODO
      return snapshot.getCurrentRecord()
    }
    return this.getRecordById(this.currentId)
  },

  /**
   * 是否为已选中记录
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   * @return Boolean
   * @see
   * Record 请参考vjs.framework.extension.platform.interface.model.datasource模块中Record定义
   */
  isSelectedRecord: function (params) {
    let record = params.record
    if (record) {
      let selectedIds = this.selectIds
      return contains(selectedIds, record.getSysId())
    }
    return false
  },

  /**
   * 是否为已当前行记录
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   * @return Boolean
   * @see
   * Record 请参考vjs.framework.extension.platform.interface.model.datasource模块中Record定义
   */
  isCurrentRecord: function (params) {
    let snapshot = this._getSnapshot()
    if (snapshot) {
      //TODO
      return snapshot.isCurrentRecord(params)
    }
    let record = params.record
    if (record) {
      let id = this.currentId
      return id == record.get('id')
    }
    return false
  },
  /**
   * 记录是否已删除
   * @param {Object} params 参数信息
   * {
   * 	 "record" :　{@link Record} 记录
   * }
   */
  isDeletedRecord: function (params) {
    let record = params.record
    let datas = this.deleteDatas
    let metadata = this.getMetadata()
    let flag = false
    each(datas, function (data) {
      let rd = new nRecord(metadata, data)
      if (rd.getSysId() == record.getSysId()) {
        flag = true
        return
      }
    })
    return flag
  },

  /**
   * 获取前台实体与之关联的后台数据源信息
   * @return DataAccessor
   */
  getDataAccessor: function () {
    return this.dataAccessObject
  },

  /**
   * 设置前台实体与之关联的后台数据源信息
   * @param {Object} params 参数信息
   * {
   * 		accessor : DataAccessor
   * }
   */
  setDataAccessor: function (params) {
    this.dataAccessObject = params.accessor
  },

  /**
   * 更新选中记录(只选中给出的记录，其他已选中的记录将被取消选中)
   * @param {Object} params 参数信息
   * {
   * 		ids : Array<String> 记录id集合
   *      records : Array<{@link Record}> 记录集合
   * }
   */
  updateSelectedRecords: function (params) {
    let rds = params.records,
      ids = params.ids,
      selectedIds = this.selectIds
    let iter = []
    if (rds) {
      iter = iter.concat(rds)
    }
    if (ids) {
      iter = iter.concat(ids)
    }
    if (!this.isMultipleSelect()) {
      //单选
      if (iter.length == 0) {
        let currentId
        let snapshot = this._getSnapshot()
        if (snapshot) {
          let record = snapshot.getCurrentRecord()
          currentId = record.getSysId()
        } else {
          currentId = this.currentId
        }
        if (currentId != null) {
          let rd = this.getRecordById(currentId)
          this.currentId = null
          if (snapshot) {
            snapshot.clearCurrentRecord()
          }
          let resultSet = this._r2rs([rd])
          this._fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: false,
            datasource: this
          })
        }
      } else {
        let rd = iter[iter.length - 1],
          unSelected = []
        rd = rd instanceof nRecord ? rd : this.getRecordById(rd)
        this.setCurrentRecord({ record: rd })
        let id = rd.getSysId()
        let isSel = false
        let db = this
        each(selectedIds, function (selectedId) {
          if (selectedId == id) {
            isSel = true
          } else {
            unSelected.push(db.getRecordById(selectedId))
          }
        })
        this.selectIds = [id]
        if (!isSel) {
          let resultSet = this._ids2rs([id])
          this._fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: true,
            datasource: this
          })
        }
        if (unSelected.length > 0) {
          let resultSet = this._r2rs(unSelected)
          this._fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: false,
            datasource: this
          })
        }
      }
    } else {
      each(iter, function (record, index) {
        let id = record instanceof nRecord ? record.getSysId() : record
        iter[index] = id
      })
      let toSel = arrays.difference(iter, selectedIds),
        unSel = arrays.difference(selectedIds, iter)
      this.selectIds = iter
      if (unSel && unSel.length > 0) {
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(unSel),
          isSelect: false,
          datasource: this
        })
      }
      if (toSel && toSel.length > 0) {
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(toSel),
          isSelect: true,
          datasource: this
        })
      }
    }
  },

  /**
   * 选中数据源记录
   * 如果数据源为单选，则选中最后一条
   * 如果没有选中记录，则直接返回空结果集
   * @param {Object} params 参数信息
   * {
   * 		records : Array<{@link Record}> 记录数组
   * 		isSelect : Boolean 选中/取消选中
   * }
   * @return {@link ResultSet}
   */
  selectRecords: function (params) {
    let records = params.records,
      isSelect = params.isSelect,
      selectRecords = []
    if (records.length < 1) {
      return this._r2rs([])
    }
    let selectedIds = this.selectIds
    if (isSelect && !this.isMultipleSelect()) {
      let unSelected = []
      let record = records[records.length - 1]
      this.setCurrentRecord({ record: record })
      let id = record.getSysId()
      let isSel = false
      let db = this
      each(selectedIds, function (selectedId) {
        if (selectedId == id) {
          isSel = true
        } else {
          unSelected.push(db.getRecordById(selectedId))
        }
      })
      if (!isSel) {
        this.selectIds = [id]
        selectRecords.push(record)
      }
      if (unSelected.length > 0) {
        let resultSet = this._r2rs(unSelected)
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: resultSet,
          isSelect: false,
          datasource: this
        })
      }
    } else {
      each(records, function (record) {
        let id = record.getSysId()
        if (isSelect && !contains(selectedIds, id)) {
          //选中记录
          selectedIds.push(id)
          selectRecords.push(record)
        } else if (!isSelect && contains(selectedIds, id)) {
          remove(selectedIds, id)
          selectRecords.push(record)
        }
      })
    }
    let rs = this._r2rs(selectRecords)
    if (selectRecords.length > 0) {
      this._fireEvent({
        eventName: this.Events.SELECT,
        resultSet: rs,
        isSelect: isSelect,
        datasource: this
      })
    }
    return rs
  },

  /**
   *设置当前行
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   */
  setCurrentRecord: function (params) {
    let snapshot = this._getSnapshot()
    if (snapshot) {
      //TODO
      snapshot.setCurrentRecord(params)
    }
    let record = params.record
    if (record) {
      let id = record.getSysId()
      if (this.currentId != id) {
        let preRecord = this.getRecordById(this.currentId)
        this.currentId = id
        if (!this.isMultipleSelect()) {
          //单选db，当前行和选中行同步
          this.updateSelectedRecords({ records: [record] })
        }
        //注意：需要放置在选择记录之后，否则造成记录变更事件中无法获取已选中记录
        this._fireEvent({
          eventName: this.Events.CURRENT,
          currentRecord: record,
          preCurrentRecord: preRecord,
          datasource: this
        })
      }
    }
  },
  /**
   * 事件名称枚举
   * @enum {String}
   */
  Events: {
    /**加载事件*/
    LOAD: 'LOAD',
    /**新增事件*/
    INSERT: 'INSERT',
    /**更新事件*/
    UPDATE: 'UPDATE',
    /**删除事件*/
    DELETE: 'DELETE',
    /**当前行切换事件*/
    CURRENT: 'CURRENT',
    /**记录选择事件*/
    SELECT: 'SELECT',
    /**获取数据事件*/
    FETCH: 'FETCH',
    /**获取数据后事件*/
    FETCHED: 'FETCHED',
    /**
     *@private
     * 记录处理事件
     * */
    RECORDPROCESS: 'RECORDPROCESS'
  },
  /**
   * 数据位置枚举
   * @enum {String}
   */
  Position: {
    /**前*/
    BEFORE: 'BEFORE',
    /**后*/
    AFTER: 'AFTER',
    /**最前*/
    TOP: 'TOP',
    /**最后*/
    BOTTOM: 'BOTTOM'
  },
  /**
   * 注册事件回调
   * @param {Object} params 参数信息
   * {
   * 		"eventName" : {@link Datasource#Events|Events} 事件名称,
   * 		"fieldCode" : String 字段编码,
   * 		"handler" : Function 回调
   * }
   * @example
   *  var datasourceFactory = sandbox.getService("vjs.framework.extension.platform.services.model.datasource.datasourceFactory");
   *  var datasource = datasourceFactory.create(metadata);
   *  datasource.on({
   * 		"eventName":datasource.Events.Load
   * 		"handler" : function(){alert("loaded@");}
   * });
   */
  on: function (params) {
    let eName = params.eventName
    let handler = params.handler
    let handlers = []
    if (eName == this.Events.RECORDPROCESS) {
      let fieldCode = params.fieldCode
      if (fieldCode) {
        if (!this._eventPool[eName]) this._eventPool[eName] = {}
        handlers = this._eventPool[eName][fieldCode] || []
        handlers.push(handler)
        this._eventPool[eName][fieldCode] = handlers
      }
    } else {
      handlers = this._eventPool[eName] || []
      handlers.push(handler)
      this._eventPool[eName] = handlers
    }
  },

  /**
   * 是否为多选
   * @return Boolean
   */
  isMultipleSelect: function () {
    return this.isMultipleSel
  },
  _selectionChangedDeal: function () {
    //标记当前行为选中状态
    if (this.currentId && this.currentId != '') {
      if (this.selectIds.indexOf(this.currentId) == -1) {
        this.selectIds.push(this.currentId)
      }
      this._fireEvent({
        eventName: this.Events.SELECT,
        resultSet: this._ids2rs([this.currentId]),
        isSelect: true,
        datasource: this
      })
    }
  },
  /**
   * 标记数据源为多选
   */
  markMultipleSelect: function () {
    if (!this.isMultipleSel) {
      this.isMultipleSel = true
      this._selectionChangedDeal()
    }
  },
  /**
   * 标记数据源为单选
   */
  markMultipleSingle: function () {
    this.isMultipleSel = false
    this._selectionChangedDeal()
  },
  /**
   * 是否默认选中记录
   * @return Boolean
   */
  isDefaultSelect: function () {
    return this.isDefaultSel
  },
  /**
   * 设置是否默认选中
   * @param {Object} params 参数信息
   * {
   * 		"defaultSel" : Boolean 是否默认选中
   * }
   */
  setDefaultSelect: function (params) {
    this.isDefaultSel = params.defaultSel
  },
  /**
   * 数据源序列化
   * @return Object
   * @example
   * 输出格式
   * {
   * 		"datas":{
   * 			"recordCount": {Integer} 数据源记录数
   * 			"values":{Array} 数据源记录集合
   * 		}，
   * 		"metadata":{
   * 			"model":[{
   * 				"datasource":{String} 数据源名称
   * 				"fields":[{
   * 					"code":编码,
   *  				"name":名称,
   *  				"length":长度,
   *  				"type":类型,
   *  				"defaultValue":默认值,
   *  				"precision":精度
   * 				}...]
   * 			}]
   * 		}
   * }
   */
  serialize: function () {
    let rs = { metadata: this.metadata.serialize() }
    let set = this.getAllRecords()
    let values = []
    set.iterate(function (record) {
      //过滤字段,剔除非数据源中的字段
      values.push(record.toMap())
    })
    let datas = { values: values, recordCount: this.dataAmount }
    rs['datas'] = datas
    return rs
  },
  /**
   * 标记数据源将要取数据
   */
  markWillToFecth: function () {
    this._fireEvent({ eventName: this.Events.FETCH, datasource: this })
  },
  /**
   * 标记数据已加载过
   */
  markFecthed: function () {
    this._fireEvent({ eventName: this.Events.FETCHED, datasource: this })
  },
  /**
   * 查询记录
   * @param {Object} params 参数信息
   * {
   * 		"criteria" : {@link Criteria} 条件
   * }
   * @return {@link ResultSet}
   */
  queryRecord: function (params) {
    let datas = this.db._query(params.criteria)
    return new ResultSet(this.metadata, datas)
  },
  /**
   * 获取db数据量
   * @return Integer
   */
  getDataAmount: function () {
    return this.dataAmount
  },

  getOrginalDatasource: function () {
    return this.db
  },

  /**
   * 根据id获取数据下标值,如果记录不存在,则返回-1
   * @param {String} id 记录id值
   * @return Integer
   */
  getIndexById: function (id) {
    return this.db._getIndex(id)
  },

  /**
   * 获取当前实体数据量
   */
  getCurrentDataAmount: function () {
    let rs = this.getAllRecords()
    return rs.size()
  }
}

Datasource.Events = Datasource.prototype.Events

Datasource.Position = Datasource.prototype.Position

Datasource._putSnapshotManager = function (manager) {
  //TODO
  Datasource.prototype._snapshotManager = manager
}

return Datasource
