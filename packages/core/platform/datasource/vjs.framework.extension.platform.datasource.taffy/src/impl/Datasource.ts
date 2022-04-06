import {
  Record as nRecord,
  ResultSet
} from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import * as taffy from './TaffyDB'
import { Metadata } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { CollectionUtil } from '@v-act/vjs.framework.extension.util.collection'
import { ObjectUtil } from '@v-act/vjs.framework.extension.util.object'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'

interface obj {
  [key: string]: any
}

interface Events {
  LOAD: string
  INSERT: string
  UPDATE: string
  DELETE: string
  CURRENT: string
  SELECT: string
  FETCH: string
  FETCHED: string
  RECORDPROCESS: string
}

interface Position {
  BEFORE: string
  AFTER: string
  TOP: string
  BOTTOM: string
}

let primaryKey = 'id'

let each: any = CollectionUtil.each
let find: any = CollectionUtil.find
let contains: any = CollectionUtil.contains

class Datasource {
  public Events: Events
  public Position: Position
  public indexData?: obj
  public datas: Array<any>
  public ds: any
  public metadataJson: any
  public db = taffy.DB()
  public isMultipleSel: boolean
  public isDefaultSel: boolean
  public dataAmount = 0
  public _eventPool = {}
  public currentId: string | null
  public dataAccessObject: any
  public snapshotHandler: () => void
  public bindWidgets: any
  public _snapshotManager: any

  constructor(public metadata?: any) {
    this.indexData = {}
    this.datas = []
    this.ds = null
    this.metadataJson = null
    this.db = taffy.DB()
    this.isMultipleSel = false
    this.isDefaultSel = true
    this.dataAmount = 0
    this._eventPool = {}
    this.currentId = ''
    this.dataAccessObject = null
    this.snapshotHandler = () => {}
    this.bindWidgets = null
    this._snapshotManager = null
    this.Events = {
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
    }
    this.Position = {
      /**前*/
      BEFORE: 'BEFORE',
      /**后*/
      AFTER: 'AFTER',
      /**最前*/
      TOP: 'TOP',
      /**最后*/
      BOTTOM: 'BOTTOM'
    }

    return this
  }

  _putSnapshotHandler(handler: any) {
    this.snapshotHandler = handler
  }

  _putDatasource(ds: any) {
    this.ds = ds
  }

  _getSnapshot() {
    return this.snapshotHandler ? this.snapshotHandler() : null
  }

  _r2rs(records: any) {
    return new ResultSet(this.metadata, records)
  }

  _ids2rs(ids: string[]) {
    let datas: any[] = [],
      _this = this
    ids.some((id: string) => {
      datas.push(_this.db._getById(id))
    })
    let rs = new ResultSet(this.metadata, datas)
    return rs
  }

  getMetadata() {
    return this.metadata
  }

  load(params: any) {
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
      //this.deleteDatas = []
      let snapshot: any = this._getSnapshot()
      if (snapshot) {
        snapshot.clearCurrentRecord()
      }
      this.currentId = null
    }
    let rs = new ResultSet(this.metadata, datas)
    let _this = this
    rs.iterate(function (record: any, i: any) {
      _this._fireEvent({
        eventName: _this.Events.RECORDPROCESS,
        eventType: _this.Events.LOAD,
        datasource: _this.ds,
        resultSet: rs,
        record: record,
        isAppend: isAppend
      })
    })
    //this.db._load(datas, isAppend)
    //v-act:加载实体记录
    const { context, code } = this._getDataSourceHandler()
    let paramsTemp = {
      code: code,
      records: datas
    }
    context.loadRecords(paramsTemp, context)

    if (_fireEvent) {
      this._fireEvent({
        eventName: this.Events.LOAD,
        resultSet: rs,
        isAppend: isAppend,
        dataAmount: dataAmount,
        datasource: this.ds
      })
    }
    //是否默认设置当前行
    let defaulSel = params.defaultSel
    defaulSel = typeof defaulSel == 'boolean' ? defaulSel : true
    if (defaulSel) {
      this._defaultSelectFirstRecord()
    }
    return rs
  }

  _fireEvent(params: any) {
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
  }

  _fireRecordProcessEvent(params: any) {
    let handlers = []
    let eName = params.eventName
    let ePool = this._eventPool[eName]
    if (ePool) {
      let eHandlers: any = []
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
  }

  _processLoadDatas(datas: Array<{ [fieldCode: string]: any }>) {
    //处理加载数据,如果加载数据不存在id值,则补全
    if (datas) {
      let rs: any = []
      each(datas, function (data: { [fieldCode: string]: any }) {
        if (!data.hasOwnProperty(primaryKey)) {
          data[primaryKey] = uuid.generate()
        }
        rs.push(data)
      })
      datas = rs
    }
    return datas
  }

  _defaultSelectFirstRecord() {
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
  }

  insertRecords(params: any) {
    let records = params.records
    if (records.length == 0) {
      //空数据直接返回Task20210621022
      return this._r2rs([])
    }
    let position = params.position ? params.position : this.Position.BOTTOM
    let resetCurrent =
      typeof params.resetCurrent == 'boolean' ? params.resetCurrent : true
    let toInserted: any = []
    let _this = this

    each(records, function (record: any) {
      let id = record.getSysId()
      if (_this.getRecordById(id)) {
        throw Error(
          '[Datasource.insertRecords]当前数据源已存在id为:' +
            id +
            '记录，无法新增，请检查！'
        )
      }

      toInserted.push(record)
      _this._fireEvent({
        eventName: _this.Events.RECORDPROCESS,
        eventType: _this.Events.INSERT,
        datasource: _this.ds,
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
        let min: any = null,
          max: any = null
        let db = this
        rs.iterate(function (rd: any) {
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

    //v-act:新增实体记录
    const { context, code } = this._getDataSourceHandler()

    let paramsTemp = {
      code: code,
      records: [toInserted[0]?.changedData]
    }
    context.insertRecords(paramsTemp, context)

    let resultSet = this._r2rs(toInserted)
    this._fireEvent({
      eventName: this.Events.INSERT,
      resultSet: resultSet,
      datasource: this.ds,
      position: position
    })
    //let currentId = this.currentId
    let currentId = this._getCurrentRecordId()
    let current = find(toInserted, function (record: any) {
      return record.getSysId() == currentId
    })
    if (!current && resetCurrent) {
      //如果当前行处于新增记录中，则不设置当前行
      //如果不存在当前行，则必须设置当前行；否则按照resetCurrent来
      if (!this._hasCurrentRecord() || resetCurrent) {
        this.setCurrentRecord({ record: toInserted[0] })
      }
    } else if (currentId == toInserted[0].getSysId()) {
      //2019-07-30 liangzc：如果当前行为新增记录，则删除其改变的数据，解决树型复制后（不复制IsLeaf）会触发值改变事件的问题
      toInserted[0].setChangedData(null)
    }
    return resultSet
  }

  updateRecords(params: Record<string, any>) {
    let records = params.records
    let updated: any = []
    let ds = this

    let insertIds = this.getArrayDataFromContextEntity('insertIds')
    let updateIds = this.getArrayDataFromContextEntity('updateIds')
    each(records, function (record: any) {
      let diffData = record.getDiff()

      if (diffData && !ObjectUtil.isEmpty(diffData)) {
        updated.push(record)
        let id = record.getSysId()

        if (!(contains(updateIds, id) || contains(insertIds, id))) {
          updateIds.push(id)
        }
        let changedFieldCodes = []
        for (let changeFieldCode in diffData) {
          changedFieldCodes.push(changeFieldCode)
        }
        ds._fireEvent({
          eventName: ds.Events.RECORDPROCESS,
          eventType: ds.Events.UPDATE,
          fieldCode: changedFieldCodes,
          datasource: ds.ds,
          record: record
        })
      }
    })
    let resultSet = this._r2rs(updated)
    if (updated.length > 0) {
      //let oDatas = this.db._update(updated)

      //v-act:更新实体记录
      const { context, code } = this._getDataSourceHandler()
      let paramsTemp = {
        code: code,
        records: [
          Object.assign(updated[0]?.orginalData, updated[0].changedData)
        ]
      }

      const oDatas = context.updateRecords(paramsTemp, context)

      let rs = new ResultSet(this.metadata, oDatas)
      this._fireEvent({
        eventName: this.Events.UPDATE,
        resultSet: resultSet,
        oldResultSet: rs,
        datasource: this.ds
      })
    }
    return resultSet
  }

  removeRecordByIds(params: any) {
    let ids: any = params.ids
    let nextRecordId: any = this.db.getNextRecordId()
    //let datas: any = this.db._remove(ids)

    const datas: Array<Record<string, any>> = []
    if (Array.isArray(ids)) {
      ids.forEach((item: string) => {
        const record = this.getRecordById(item)
        record && datas.push(record.orginalData)
      })
    }

    return this._removeRecords(datas, nextRecordId, false)
  }

  _removeRecords(datas: any, nextRecordId: any, isClear: any) {
    let deleted: any = []
    let deletedIds: any = []

    each(datas, (data: any) => {
      let id = data['id']

      if (
        !arrayUtil.remove(this.getArrayDataFromContextEntity('insertIds'), id)
      ) {
        deleted.push(data)
      }

      arrayUtil.remove(this.getArrayDataFromContextEntity('updateIds'), id)

      arrayUtil.remove(this.getArrayDataFromContextEntity('selectIds'), id)
      deletedIds.push(id)
    })

    this.getArrayDataFromContextEntity('deleteDatas').push(...deleted)

    //v-act:删除实体记录
    const { context, code } = this._getDataSourceHandler()
    let paramsTemp = {
      code: code,
      records: deletedIds
    }

    context.removeRecords(paramsTemp, context)

    let rs = new ResultSet(this.metadata, datas)
    if (datas.length > 0) {
      this._fireEvent({
        eventName: this.Events.DELETE,
        resultSet: rs,
        datasource: this.ds,
        isClear: isClear
      })
    }
    if (nextRecordId) {
      let nextRecord = this.getRecordById(nextRecordId)
      this.setCurrentRecord({ record: nextRecord })
    } else {
      let record = this.getRecordByIndex(0)
      if (record) {
        this.setCurrentRecord({ record: record })
      }
    }
    return rs
  }

  clear() {
    //let datas = this.db._getAll()
    const { context, code } = this._getDataSourceHandler()

    let datas = context.getAll(code, context)
    if (datas.length > 0) {
      let ids = [],
        temp = []
      for (let i = 0, l = datas.length; i < l; i++) {
        let data = datas[i]
        ids.push(data[primaryKey])
        temp.push(data)
      }
      datas = temp

      //v-act:清除实体记录
      const { context, code } = this._getDataSourceHandler()
      context.clearRecords(code, context)
    }

    //context.clearRecords已经清除实体记录，无需再次执行this._removeRecords
    //this._removeRecords(datas, null, true)
    this.reset()
    let snapshot = this._getSnapshot()
    if (snapshot) {
      //@ts-ignore
      snapshot.clearCurrentRecord()
    }
    this.currentId = null
  }

  clearRemoveDatas() {
    this.getArrayDataFromContextEntity('deleteDatas').length = 0
  }

  reset() {
    const { context, code } = this._getDataSourceHandler()
    const entities = context?.entities

    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return
      }
      Array.isArray(entity.insertIds) && (entity.insertIds.length = 0)
      Array.isArray(entity.updateIds) && (entity.updateIds.length = 0)
      Array.isArray(entity.deleteDatas) && (entity.deleteDatas.length = 0)
      Array.isArray(entity.selectIds) && (entity.selectIds.length = 0)
    }
  }

  createRecord() {
    let metadata = this.getMetadata()
    let record = new nRecord(metadata, null)
    record.set(primaryKey, uuid.generate())
    return record
  }

  getRecordById(id: string) {
    let data = this._getDataById(id)
    return data != null ? new nRecord(this.metadata, data) : null
  }

  getRecordByIndex(index: number) {
    const { context, code } = this._getDataSourceHandler()

    let allDatas = context.getAll(code, context)
    let data = allDatas[index]
    return data ? new nRecord(this.metadata, data) : null
  }

  getAllRecords() {
    const { context, code } = this._getDataSourceHandler()
    let datas = context.getAll(code, context)
    return new ResultSet(this.metadata, datas)
  }

  isEmpty() {
    return this.db.isEmpty()
  }

  _getModifyRecords(state: any) {
    // @ts-ignore
    let records: any = this.db.getChangedData(state)
    let datas = []
    if (records && records.length > 0) {
      for (let i = 0, len = records.length; i < len; i++) {
        datas.push(records[i].__recordData__)
      }
    }
    return new ResultSet(this.metadata, datas)
  }

  _getDataSourceHandler() {
    const scopeId = scopeManager.getCurrentScopeId()
    const scope = scopeManager.getScope(scopeId)
    const context = scope.get('dataSourceHandler')
    const code = this.metadata.getDatasourceName()
    return {
      context,
      code,
      scopeId,
      scope
    }
  }

  _getDataById(id: string) {
    const code = this.metadata.getDatasourceName()
    if (!code) {
      return null
    }
    const { context } = this._getDataSourceHandler()
    const entities = context?.entities
    let mydata: any[] = []
    if (entities) {
      mydata = entities[code].datas
    }
    return mydata.find((item: any) => {
      return item.id === id
    })
  }

  _getDatasById(ids: any) {
    let datas: any = []

    each(ids, (id: any) => {
      //datas.push(ds.db._getById(id))
      let itemObj = this._getDataById(id)
      datas.push(itemObj)
    })
    return new ResultSet(this.metadata, datas)
  }

  getInsertedRecords() {
    return this._getDatasById(this.getArrayDataFromContextEntity('insertIds'))
  }

  getUpdatedRecords() {
    return this._getDatasById(this.getArrayDataFromContextEntity('updateIds'))
  }

  getDeletedRecords() {
    return new ResultSet(
      this.metadata,
      this.getArrayDataFromContextEntity('deleteDatas')
    )
  }

  getSelectedRecords() {
    if (!this.isMultipleSelect()) {
      //如果为单选db，则跟当前行同步，加入快照功能 xiedh 2016-09-18
      let rd = this.getCurrentRecord()
      let datas = rd ? [rd] : []
      return this._r2rs(datas)
    }
    return this._getDatasById(this.getArrayDataFromContextEntity('selectIds'))
  }

  //从v-act的context entity上获取数组数据
  getArrayDataFromContextEntity(key: string) {
    const { context, code } = this._getDataSourceHandler()
    const entities = context?.entities
    let arrayData: Array<any> = []
    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return arrayData
      }
      let keyStr = key || '$invalidKey'
      Array.isArray(entity[keyStr]) && (arrayData = entity[keyStr])
    }
    return arrayData
  }

  _hasCurrentRecord() {
    let currentId = this._getCurrentRecordId()
    return currentId !== null && currentId !== undefined
  }

  _getCurrentRecordId() {
    let snapshot = this._getSnapshot()
    if (snapshot) {
      // @ts-ignore
      return snapshot.getCurrentId()
    } else {
      //return this.currentId
      const { code, context } = this._getDataSourceHandler()
      const _current = context.getCurrentRecord(code, context)
      return _current?.id || this.currentId
    }
  }

  getCurrentRecord() {
    return this.getRecordById(this._getCurrentRecordId())
  }

  isSelectedRecord(params: any) {
    let record = params.record
    if (record) {
      return contains(
        this.getArrayDataFromContextEntity('selectIds'),
        record.getSysId()
      )
    }
    return false
  }

  isCurrentRecord(params: any) {
    let snapshot = this._getSnapshot()
    if (snapshot) {
      //TODO
      // @ts-ignore
      return snapshot.isCurrentRecord(params)
    }
    let record = params.record
    if (record) {
      //let id = this.currentId
      let id = this._getCurrentRecordId()
      return id == record.get('id')
    }
    return false
  }

  isDeletedRecord(params: any) {
    let record = params.record
    let datas = this.getArrayDataFromContextEntity('deleteDatas')
    let metadata = this.getMetadata()
    let flag = false

    each(datas, function (data: any) {
      let rd = new nRecord(metadata, data)
      if (rd.getSysId() == record.getSysId()) {
        flag = true
        return
      }
    })
    return flag
  }

  getDataAccessor() {
    return this.dataAccessObject
  }

  setDataAccessor(params: any) {
    this.dataAccessObject = params.accessor
  }

  updateSelectedRecords(params: any) {
    let rds = params.records,
      ids = params.ids,
      selectedIds = this.getArrayDataFromContextEntity('selectIds')
    let iter: any = []
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
        let snapshot: any = this._getSnapshot()
        if (snapshot) {
          let record = snapshot.getCurrentRecord()
          currentId = record.getSysId()
        } else {
          //currentId = this.currentId
          currentId = this._getCurrentRecordId()
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
            datasource: this.ds
          })
        }
      } else {
        let rd = iter[iter.length - 1],
          unSelected: any = []
        rd = rd instanceof nRecord ? rd : this.getRecordById(rd)
        this.setCurrentRecord({ record: rd })
        let id = rd.getSysId()
        let isSel = false
        let db = this

        each(selectedIds, function (selectedId: any) {
          if (selectedId == id) {
            isSel = true
          } else {
            unSelected.push(db.getRecordById(selectedId))
          }
        })
        selectedIds.length = 0
        selectedIds.push(id)

        if (!isSel) {
          let resultSet = this._ids2rs([id])
          this._fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: true,
            datasource: this.ds
          })
        }
        if (unSelected.length > 0) {
          let resultSet = this._r2rs(unSelected)
          this._fireEvent({
            eventName: this.Events.SELECT,
            resultSet: resultSet,
            isSelect: false,
            datasource: this.ds
          })
        }
      }
    } else {
      each(iter, function (record: any, index: any) {
        let id = record instanceof nRecord ? record.getSysId() : record
        iter[index] = id
      })

      let toSel = arrayUtil.difference(iter, selectedIds),
        unSel = arrayUtil.difference(selectedIds, iter)
      selectedIds.splice(0, selectedIds.length, ...iter)

      if (unSel && unSel.length > 0) {
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(unSel),
          isSelect: false,
          datasource: this.ds
        })
      }
      if (toSel && toSel.length > 0) {
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: this._ids2rs(toSel),
          isSelect: true,
          datasource: this.ds
        })
      }
    }
  }

  selectRecords(params: any) {
    let records = params.records,
      isSelect = params.isSelect,
      selectRecords = []
    if (records.length < 1) {
      return this._r2rs([])
    }
    let selectedIds: any = this.getArrayDataFromContextEntity('selectIds')
    if (isSelect && !this.isMultipleSelect()) {
      let unSelected: any = []
      let record = records[records.length - 1]
      this.setCurrentRecord({ record: record })
      let id = record.getSysId()
      let isSel = false
      let db = this

      each(selectedIds, function (selectedId: any) {
        if (selectedId == id) {
          isSel = true
        } else {
          unSelected.push(db.getRecordById(selectedId))
        }
      })
      if (!isSel) {
        selectedIds.splice(0, selectedIds.length, id)
        selectRecords.push(record)
      }
      if (unSelected.length > 0) {
        let resultSet = this._r2rs(unSelected)
        this._fireEvent({
          eventName: this.Events.SELECT,
          resultSet: resultSet,
          isSelect: false,
          datasource: this.ds
        })
      }
    } else {
      each(records, function (record: any) {
        let id = record.getSysId()
        if (isSelect && !contains(selectedIds, id)) {
          //选中记录
          selectedIds.push(id)
          selectRecords.push(record)
        } else if (!isSelect && contains(selectedIds, id)) {
          arrayUtil.remove(selectedIds, id)
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
        datasource: this.ds
      })
    }
    return rs
  }

  setCurrentRecord(params: any) {
    let snapshot: any = this._getSnapshot()
    if (snapshot) {
      snapshot.setCurrentRecord(params)
    }
    let record = params.record
    if (record) {
      let id = record.getSysId()
      //if (this.currentId != id) {
      //let currentId = this._getCurrentRecordId()//会死循环
      let currentId = this.currentId || ''
      if (currentId != id) {
        if (this.currentId != id) {
          let preRecord = this.getRecordById(currentId)
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
            datasource: this.ds
          })
        }

        //v-act:设置当前行
        const { context, code } = this._getDataSourceHandler()
        context.setCurrentRecord(id, code, context)
      }
    }
  }

  on(params: Record<string, any>) {
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
  }

  isMultipleSelect() {
    return this.isMultipleSel
  }
  _selectionChangedDeal() {
    //标记当前行为选中状态
    let currentId = this._getCurrentRecordId()
    if (currentId && currentId != '') {
      let selectIds = this.getArrayDataFromContextEntity('selectIds')
      if (selectIds.indexOf(currentId) == -1) {
        selectIds.push(currentId)
      }
      this._fireEvent({
        eventName: this.Events.SELECT,
        resultSet: this._ids2rs([currentId]),
        isSelect: true,
        datasource: this.ds
      })
    }
  }
  /**
   * 标记数据源为多选
   */
  markMultipleSelect() {
    if (!this.isMultipleSel) {
      this.isMultipleSel = true
      this._selectionChangedDeal()
    }
  }
  /**
   * 标记数据源为单选
   */
  markMultipleSingle() {
    this.isMultipleSel = false
    this._selectionChangedDeal()
  }
  /**
   * 是否默认选中记录
   * @return Boolean
   */
  isDefaultSelect() {
    return this.isDefaultSel
  }
  /**
   * 设置是否默认选中
   * @param {Object} params 参数信息
   * {
   * 		"defaultSel" : Boolean 是否默认选中
   * }
   */
  setDefaultSelect(params: any) {
    this.isDefaultSel = params.defaultSel
  }

  serialize() {
    let rs: any = { metadata: this.metadata.serialize() }
    let set = this.getAllRecords()
    let values: any = []
    set.iterate(function (record: any) {
      //过滤字段,剔除非数据源中的字段
      values.push(record.toMap())
    })
    let datas = { values: values, recordCount: this.dataAmount }
    rs['datas'] = datas
    return rs
  }
  /**
   * 标记数据源将要取数据
   */
  markWillToFecth() {
    this._fireEvent({ eventName: this.Events.FETCH, datasource: this.ds })
  }
  /**
   * 标记数据已加载过
   */
  markFecthed() {
    this._fireEvent({ eventName: this.Events.FETCHED, datasource: this.ds })
  }
  /**
   * 查询记录
   * @param {Object} params 参数信息
   * {
   * 		"criteria" : {@link Criteria} 条件
   * }
   * @return {@link ResultSet}
   */
  queryRecord(params: any) {
    let datas = this.db._query(params.criteria)
    return new ResultSet(this.metadata, datas)
  }
  /**
   * 获取db数据量
   * @return Integer
   */
  getDataAmount() {
    return this.dataAmount
  }

  getOrginalDatasource() {
    return this.db
  }

  /**
   * 根据id获取数据下标值,如果记录不存在,则返回-1
   * @param {String} id 记录id值
   * @return Integer
   */
  getIndexById(id: string) {
    //return this.db._getIndex(id)
    const { context, code } = this._getDataSourceHandler()
    const recordId = id
    const entities = context?.entities
    let outputIndex = -1
    if (entities) {
      const entity = entities[code]

      if (!entity) {
        return outputIndex
      }

      !Array.isArray(entity.datas) && (entity.datas = [])

      if (entity.datas.length === 0) {
        return outputIndex
      }

      entity.datas.find((item: any, index: number) => {
        if (item.id === recordId.toString()) {
          outputIndex = index
          return true
        }
      })
    }
    return outputIndex
  }

  /**
   * 获取当前实体数据量
   */
  getCurrentDataAmount() {
    let rs = this.getAllRecords()
    return rs.size()
  }

  destroy() {
    if (this.bindWidgets) {
      this.bindWidgets = null
    }
    // @ts-ignore
    this.Super('destroy', arguments)
  }

  _putSnapshotManager(manager: any) {
    this._snapshotManager = manager
  }

  DB() {
    return new Datasource()
  }

  getConstructor() {
    return Datasource
  }
}

const DB = function () {
  return new Datasource()
}

const unSerialize = function () {}

const isDB = function (db: any) {
  return db instanceof Datasource
}

const getConstructor = function () {
  return Datasource
}

export { DB, getConstructor, isDB, unSerialize }
