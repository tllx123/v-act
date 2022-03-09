import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ResultSet as Resultset } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { Record as Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
const initModule = function (sBox) {}

let primaryKey = 'id'

let SmartclientDatasource = function (metadata) {
  this.metadata = metadata
  this.ds = null
  let dsName = metadata.getDatasourceName()
  let fields = this._createEntityDSFields(metadata.getFields())
  this.scopeId = scopeManager.getCurrentScopeId()
  //数据源
  this._db = isc.V3Datasource.create({
    dbName: dsName,
    scopeId: this.scopeId,
    clientOnly: true,
    v3Datasource: this,
    fields: fields
  })
}

SmartclientDatasource.prototype = {
  _putDatasource: function (ds) {
    /**
     * 当创建树形实体时，会重新创建数据源，导致该实例与原数据源断开联系，导致获取数据源元数据信息错误 Task20210726015
     */
    if (!this.ds) {
      this.ds = ds
    }
  },
  _putSnapshotHandler: function (handler) {
    this._db._putSnapshotHandler(handler)
  },
  _each: function (list, handler, ctx) {
    if (list && list.length > 0) {
      for (let i = 0, l = list.length; i < l; i++) {
        let rs = handler.apply(ctx, [list[i], i])
        if (rs === false) {
          break
        }
      }
    } else if (list) {
      for (let key in list) {
        if (list.hasOwnProperty(key)) {
          let rs = handler.apply(ctx, [list[key], key])
          if (rs === false) {
            break
          }
        }
      }
    }
  },
  toRes: function (datas) {
    return new Resultset(this.ds.getMetadata(), datas)
  },

  toRe: function (data) {
    return new Record(this.ds.getMetadata(), data)
  },

  re2list: function (records) {
    let list = []
    this._each(
      records,
      function (record) {
        list.push(record.toMap())
      },
      this
    )
    return list
  },

  load: function (params) {
    let datas = this._db.load(
      params.datas,
      params.isAppend,
      params.dataAmount,
      params.fireEvent,
      params.defaulSel
    )
    return this.toRes(datas)
  },

  insertRecords: function (params) {
    let list = this.re2list(params.records)
    let datas = this._db.insertRecords(
      list,
      params.position,
      params.resetCurrent
    )
    return this.toRes(params.records)
  },

  updateRecords: function (params) {
    let list = []
    this._each(
      params.records,
      function (record) {
        let changed = record.getDiff()
        if (changed) {
          changed.id = record.getSysId()
          list.push(changed)
        }
      },
      this
    )
    let datas = this._db.updateRecords(list)
    return this.toRes(datas)
  },

  removeRecordByIds: function (params) {
    let datas = this._db.removeRecordByIds(params.ids)
    return this.toRes(datas)
  },

  clear: function () {
    this._db.clear()
  },

  clearRemoveDatas: function () {
    this._db.clearRemoveDatas()
  },

  reset: function () {
    this._db.reset()
  },

  createRecord: function () {
    //V3Datasource.beforePerformDSOperation方法中有创建记录接口，此时域不正确，需要开启域
    scopeManager.openScope(this.scopeId)
    try {
      let data = this._db.createRecord()
      let id = data[primaryKey]
      delete data[primaryKey]
      let record = this.toRe(null) //传入null，生成字段默认值
      record.set(primaryKey, id)
      return record
    } finally {
      scopeManager.closeScope()
    }
  },

  getRecordById: function (id) {
    let data = this._db.getRecordById(id)
    return data ? this.toRe(data) : null
  },

  getRecordByIndex: function (index) {
    let data = this._db.getRecordByIndex(index)
    return data ? this.toRe(data) : null
  },

  getAllRecords: function () {
    let datas = this._db.getAllRecords()
    return this.toRes(datas)
  },

  isEmpty: function () {
    return this._db.isEmpty()
  },

  getInsertedRecords: function () {
    let datas = this._db.getInsertedRecords()
    return this.toRes(datas)
  },

  getUpdatedRecords: function () {
    let datas = this._db.getUpdatedRecords()
    return this.toRes(datas)
  },

  getDeletedRecords: function () {
    let datas = this._db.getDeletedRecords()
    return this.toRes(datas)
  },

  getSelectedRecords: function () {
    let datas = this._db.getSelectedRecords()
    return this.toRes(datas)
  },

  getCurrentRecord: function () {
    let data = this._db.getCurrentRecord()
    return data ? this.toRe(data) : null
  },

  isSelectedRecord: function (params) {
    return this._db.isSelectedRecordById(params.record.getSysId())
  },

  isCurrentRecord: function (params) {
    return this._db.isCurrentRecordById(params.record.getSysId())
  },

  isDeletedRecord: function (params) {
    return this._db.isDeletedRecordById(params.record.getSysId())
  },

  updateSelectedRecords: function (params) {
    let records = this.re2list(params.records)
    this._db.updateSelectedRecords(params.ids, records)
  },

  selectRecords: function (params) {
    let records = this.re2list(params.records)
    let datas = this._db.selectRecords(records, params.isSelect)
    return this.toRes(datas)
  },

  setCurrentRecord: function (params) {
    if (!params.record) {
      //兼容处理Task20210811001
      return false
    }
    this._db.setCurrentRecordById(params.record.getSysId())
  },

  _genScopedHandler: function (handler) {
    let scopeId = this.scopeId
    return function () {
      scopeManager.openScope(scopeId)
      try {
        return handler.apply(this, arguments)
      } finally {
        scopeManager.closeScope()
      }
    }
  },

  on: function (params) {
    let eventName = params.eventName
    let handler = this['_gen' + eventName + 'EventHandler']
    if (typeof handler == 'function') {
      handler = handler.apply(this, [params])
      handler = this._genScopedHandler(handler)
      this._db.on(eventName, params.fieldCode, handler)
    }
  },

  _genLOADEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          isAppend: args.isAppend,
          dataAmount: args.dataAmount,
          datasource: _this.ds,
          resultSet: _this.toRes(args.resultSet)
        }
      ])
    }
  },
  _genINSERTEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      let list = args.resultSet
      let result = []
      _this._each(
        list,
        function (item) {
          let changed = {}
          this._each(
            item,
            function (val, key) {
              if (val !== null) {
                changed[key] = val
              }
            },
            this
          )
          let record = this.toRe(item)
          record.setChangedData(changed)
          result.push(record)
        },
        _this
      )
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          position: args.position,
          datasource: _this.ds,
          resultSet: _this.toRes(result)
        }
      ])
    }
  },
  _genUPDATEEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      let updated = args.resultSet
      let list = []
      _this._each(
        updated,
        function (rd) {
          let record = this.toRe(this._db.getRecordById(rd.id))
          record.setChangedData(rd)
          list.push(record)
        },
        _this
      )
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          oldResultSet: _this.toRes(args.oldResultSet),
          datasource: _this.ds,
          resultSet: _this.toRes(list)
        }
      ])
    }
  },
  _genDELETEEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          isClear: args.isClear,
          datasource: _this.ds,
          resultSet: _this.toRes(args.resultSet)
        }
      ])
    }
  },
  _genCURRENTEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          currentRecord: _this.toRe(args.currentRecord),
          datasource: _this.ds,
          preCurrentRecord: args.preCurrentRecord
            ? _this.toRe(args.preCurrentRecord)
            : null
        }
      ])
    }
  },
  _genSELECTEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          isSelect: args.isSelect,
          datasource: _this.ds,
          resultSet: _this.toRes(args.resultSet)
        }
      ])
    }
  },
  _genFETCHEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          datasource: _this.ds
        }
      ])
    }
  },
  _genFETCHEDEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          datasource: _this.ds
        }
      ])
    }
  },
  _genRECORDPROCESSEventHandler: function (params) {
    let _this = this,
      handler = params.handler
    return function (args) {
      //args.record只包含修改的字段值，当进行字段表达式计算，因不存在其他字段，导致计算出错 Task20210813070
      let changed = args.record
      let record
      if (changed && changed.id) {
        let rd = _this.getRecordById(changed.id)
        if (rd) {
          rd.setDatas(changed)
          record = rd
        } else {
          record = _this.toRe(changed)
        }
      } else {
        record = _this.toRe(args.record)
      }
      handler.apply(_this.ds, [
        {
          eventName: args.eventName,
          eventType: args.eventType,
          datasource: _this.ds,
          resultSet: _this.toRes(args.resultSet),
          record: record,
          isAppend: args.isAppend
        }
      ])
      //处理二次加载后，实体配置的默认值被清空的问题Task20211116116
      if (args.record && record.toMap) {
        let __recordData__ = record.toMap()
        let paramRecord = args.record
        for (let key in __recordData__) {
          if (__recordData__.hasOwnProperty(key)) {
            paramRecord[key] = __recordData__[key]
          }
        }
      }
      let changed = record.getChangedData()
      if (changed) {
        isc.addProperties(args.record, changed)
      }
    }
  },

  isMultipleSelect: function () {
    return this._db.isMultipleSelect()
  },

  markMultipleSelect: function () {
    this._db.markMultipleSelect()
  },

  markMultipleSingle: function () {
    this._db.markSingleSelect()
  },

  isDefaultSelect: function () {
    return this._db.isDefaultSelect()
  },

  setDefaultSelect: function (params) {
    this._db.setDefaultSelect(params.defaultSel)
  },

  markWillToFecth: function () {
    this._db.markWillToFecth()
  },

  markFecthed: function () {
    this._db.markFecthed()
  },

  queryRecord: function (params) {
    let datas = this._db.queryRecord(params.criteria)
    return this.toRes(datas)
  },
  getDataAmount: function () {
    return this._db.getDataAmount()
  },
  getIndexById: function (id) {
    return this._db.getIndexById(id)
  },
  getCurrentDataAmount: function () {
    return this._db.getCurrentDataAmount()
  },
  /**
   * 根据实体DB创建sc数据源字段信息
   *
   * @dbCfg
   */
  _createEntityDSFields: function (fields) {
    let rs = []
    for (let j = 0, l = fields.length; j < l; j++) {
      let f = fields[j]
      let field = this.createDataSourceField(f)
      rs.push(field)
    }
    return rs
  },

  createDataSourceField: function (fieldCfg) {
    let field = {
      name: fieldCfg.getCode(),
      type: this._fieldTypeMapping[fieldCfg.getType()],
      length:
        fieldCfg.getLength() == undefined ? 255 : parseInt(fieldCfg.getLength())
    }
    if (field.name == 'id') {
      field.primaryKey = true
    }
    return field
  },

  _fieldTypeMapping: {
    char: 'text',
    text: 'text',
    number: 'float',
    boolean: 'boolean',
    date: 'text',
    longDate: 'text',
    integer: 'integer',
    1: 'text',
    2: 'text',
    3: 'float',
    4: 'boolean',
    5: 'text',
    6: 'text',
    7: 'integer'
  },

  getOrginalDatasource: function () {
    return this._db
  }
}

const DB = function () {
  return new SmartclientDatasource()
}

const unSerialize = function (input) {
  let dataSourceName = input.dataSource + '_$unSerialize'
  let dataCfg = input.datas
  let metadataCfg = input.metadata
  let fields = _getFieldsFromModels(metadataCfg)
  let scopeId = scopeManager.getCurrentScopeId()
  isc.V3Datasource.createFormCfg(dataSourceName, fields, scopeId)
  let db = new DB()
  db.init({ id: dataSourceName })
  return db
}

let _getFieldsFromModels = function (models) {
  let fields = []
  if (models) {
    for (let i = 0, model; (fieldCfg = models[i]); i++) {
      for (let j = 0, field; (field = fieldCfg.fields[j]); j++) {
        fields.push(field)
      }
    }
  }
  //添加额外字段（行记录状态信息）
  fields.push({ name: DEFAULT_COLUMN_STATE, type: 'text' })
  return fields
}

const getConstructor = function () {
  return SmartclientDatasource
}

export {
  initModule,
  getConstructor,
  DB,
  unSerialize,
  initModule,
  DB,
  unSerialize,
  getConstructor
}
