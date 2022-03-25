import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let isEmpty, sandbox

export function initModule(sBox: any) {
  isEmpty = sBox.util.object.isEmpty
  sandbox = sBox
}

let DataSourceExt = function (metadata) {
  //元数据
  this.metadata = metadata

  this.datasource = null

  this.forcePropertyCase = 'no'

  this.recordIndexs = {}

  let dsName = metadata.getDatasourceName()

  let fields = this._createEntityDSFields(metadata.getFields())
  let scopeId = ScopeManager.getCurrentScopeId()
  //数据源
  this._db = isc.VDataSource.create({
    dbName: dsName,
    scopeId: scopeId,
    clientOnly: true,
    fields: fields
  })

  this.init()
}

DataSourceExt.prototype = {
  getOrginalDatasource: function () {
    return this._db
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
  /**
   * 加载数据
   *
   */
  _load: function (datas, isAppend) {
    //不触发插入事件
    let cacheData = this._db.getCacheData()
    if (!cacheData) {
      cacheData = []
      this._db.setCacheData(cacheData)
    }
    if (!isAppend) {
      cacheData.removeList(cacheData)
      this.recordIndexs = {}
    }
    cacheData.addList(datas)
    //cacheData = cacheData ? cacheData:[];
    //cacheData = cacheData.concat(datas);
    //this._db.setCacheData(cacheData);
    if (datas) {
      //添加主键索引
      let primaryKey = 'id'
      for (let i = 0, record; (record = datas[i]); i++) {
        let primaryVal = record[primaryKey]
        if (this.recordIndexs.hasOwnProperty(primaryVal)) {
          throw Error('加载数据失败，存在相同主键值【' + primaryVal + '】')
        }
        this.recordIndexs[primaryVal] = record
      }
    }
  },

  _insert: function (records, index) {
    //先检查主键是否有重复
    let list = []
    for (let i = 0, record; (record = records[i]); i++) {
      let primaryId = record.getSysId()
      if (this.recordIndexs[primaryId]) {
        throw Error('新增记录失败，存在相同主键值【' + primaryId + '】')
      } else {
        let data = record.toMap()
        list.push(data)
        record.__recordData__ = data
      }
    }
    if (index == -1 || index > this._db.cacheData.length) {
      this._db.cacheData.addList(list)
    } else {
      this._db.cacheData.addListAt(list, index)
    }
    let idField = 'id'
    for (let i = 0, record; (record = list[i]); i++) {
      //添加索引
      let primaryVal = record[idField]
      this.recordIndexs[primaryVal] = record
    }
    return records
  },

  _getById: function (id) {
    return this.recordIndexs[id]
  },

  _update: function (records) {
    let primaryKey = 'id'
    let notFound = []
    for (let i = 0, record; (record = records[i]); i++) {
      let primaryVal = record.getSysId()
      if (primaryVal) {
        let rd = this.recordIndexs[primaryVal]
        if (!rd) {
          notFound.push(primaryVal)
        }
      } else {
        throw Error('[smartclientDB._update]更新记录失败！缺少主键值！')
      }
    }
    if (notFound.length > 0) {
      throw Error(
        '更新记录失败！找不到对应的记录，主键值：' + notFound.join(',')
      )
    }
    let olds = []
    for (let i = 0, record; (record = records[i]); i++) {
      let changedData = record.getChangedData()
      let empty = isEmpty(changedData)
      if (!empty) {
        let primaryVal = record.getSysId()
        let rd = this.recordIndexs[primaryVal]
        let old = sandbox.util.object.clone(rd)
        for (let fieldName in changedData) {
          rd[fieldName] = changedData[fieldName]
        }
        this._db.cacheData.dataChanged()
        olds.push(old)
      }
    }
    return olds
  },

  _remove: function (ids) {
    let removedDatas = []
    for (let i = 0, id; (id = ids[i]); i++) {
      let r = this.recordIndexs[id]
      if (r) {
        removedDatas.push(r)
        this.recordIndexs[id] = null
        try {
          delete this.recordIndexs[id]
        } catch (e) {}
      }
    }
    if (removedDatas.length > 0) {
      this._db.cacheData.removeList(removedDatas)
    }
    return removedDatas
  },

  _getByIndex: function (index) {
    let records = this._db.getCacheData()
    if (records && records.length > 0 && records[index]) {
      return records[index]
    } else {
      return null
    }
  },

  _getAll: function () {
    return this._db.getCacheData()
  },

  _getIndex: function (id) {
    let record = this.recordIndexs[id]
    if (record) {
      let records = this._db.getCacheData()
      if (records && records.length > 0) {
        for (let i = 0, l = records.length; i < l; i++) {
          if (record == records[i]) {
            return i
          }
        }
      }
    }
    return -1
  },

  _getPreData: function (record) {
    let changed = record.getChangedData()
    let rs = {}
    if (changed) {
      let orginal = record.getOriginalData()
      for (let f in changed) {
        if (changed.hasOwnProperty(f)) {
          rs[f] = orginal[f]
        }
      }
    }
    return rs
  },

  init: function () {
    let db = this
    this._db.beforePerformDSOperation = function (
      operationType,
      data,
      requestProperties
    ) {
      //处理字段事件
      if (requestProperties && requestProperties.notFromUI !== true) {
        //由UI触发才需要触发字段事件
        let eventCfg = this.__fieldEventCfg
        if (eventCfg) {
          for (let attr in eventCfg) {
            if (data.hasOwnProperty(attr)) {
              data[attr] = eventCfg[attr](data[attr])
            }
          }
        }
      }
      let ds = db.datasource
      switch (operationType) {
        case 'add':
        case 'insert':
          ScopeManager.openScope(this.scopeId)
          var record = ds.createRecord()
          ds.insertRecords({
            records: [record]
          })
          record.setDatas(data)
          ds.updateRecords({
            records: [record]
          })
          ScopeManager.closeScope()
          return false
        case 'replace':
        case 'update':
          ScopeManager.openScope(this.scopeId)
          var record
          if (data && data.hasOwnProperty('id')) {
            record = ds.getRecordById(data.id)
          } else {
            record = ds.getCurrentRecord()
          }
          record.setDatas(data)
          // 如果在这里把更新记录提交的话，DB的修改记录无法同步到UI
          // 把需要更新记录缓存起来，afterPerformDSOperation中再提交记录
          requestProperties.record = record
          var preData = db._getPreData(record)
          requestProperties.preData = preData
          ScopeManager.closeScope()
          break
        case 'updateList':
          ScopeManager.openScope(this.scopeId)
          for (var i = 0; i < data.length; i++) {
            var record
            if (data[i] && data[i].hasOwnProperty('id')) {
              record = ds.getRecordById(data[i].id)
            } else {
              record = ds.getCurrentRecord()
            }
            record.setDatas(data[i])
            // 如果在这里把更新记录提交的话，DB的修改记录无法同步到UI
            // 把需要更新记录缓存起来，afterPerformDSOperation中再提交记录
            if (!requestProperties.record) {
              requestProperties.record = []
            }
            requestProperties.record.push(record)
            var preData = db._getPreData(record)
            if (!requestProperties.preData) {
              requestProperties.preData = []
            }
            requestProperties.preData.push(preData)
          }
          ScopeManager.closeScope()
      }
    }
    this._db.afterPerformDSOperation = function (
      operationType,
      data,
      requestProperties
    ) {
      let ds = db.datasource
      switch (operationType) {
        case 'replace':
        case 'update':
          ScopeManager.openScope(this.scopeId)
          /*for ( var fieldCode in requestProperties.record.changedData) {
                    if (undefined == requestProperties.oldValues || null == requestProperties.oldValues || undefined == requestProperties.oldValues[fieldCode] || null == requestProperties.oldValues[fieldCode]) {
                        requestProperties.record.__recordData__[fieldCode] = null;
                    } else {
                        requestProperties.record.__recordData__[fieldCode] = requestProperties.oldValues[fieldCode];
                    }
                }*/
          if (requestProperties.preData) {
            var preData = requestProperties.preData
            for (var fieldCode in preData) {
              if (preData.hasOwnProperty(fieldCode)) {
                requestProperties.record.__recordData__[fieldCode] =
                  preData[fieldCode]
              }
            }
            requestProperties.preData = null
          }
          if (requestProperties.record)
            ds.updateRecords({
              records: [requestProperties.record]
            })
          ScopeManager.closeScope()
          return false
        case 'updateList':
          ScopeManager.openScope(this.scopeId)
          if (requestProperties.preData) {
            for (var i = 0; i < requestProperties.preData.length; i++) {
              var preData = requestProperties.preData[i]
              for (var fieldCode in preData) {
                if (preData.hasOwnProperty(fieldCode)) {
                  requestProperties.record[i].__recordData__[fieldCode] =
                    preData[fieldCode]
                }
              }
            }
            requestProperties.preData = null
          }
          if (requestProperties.record) {
            ds.updateRecords({
              records: requestProperties.record
            })
          }

          ScopeManager.closeScope()
          return false
      }
    }
    //初始化db
    this._load([], false)
    return this
  },

  _setDatasource: function (datasource) {
    this.datasource = datasource
  },

  _query: function (criteria) {
    let criterias = []
    let adCriteria = {
      _constructor: 'AdvancedCriteria',
      operator: 'and',
      criteria: criterias
    }
    let cds = criteria.getConditions()
    let datas = [].concat(this._db.getCacheData() || [])
    for (let i = 0, l = cds.length; i < l; i++) {
      let cd = cds[i]
      let operator = cd.getOperator()
      let op
      if ('Eq' == operator) {
        op = 'equals'
      } else if ('Sw' == operator) {
        op = 'startsWith'
      } else {
        throw Error(
          '[SmartclientDB._query]未支持查询条件! operation=' + operator
        )
      }
      criterias.push({
        fieldName: cd.getFieldCode(),
        operator: op,
        value: cd.getValue()
      })
    }
    return this._db.applyFilter(datas, adCriteria)
  },
  _getNextRecordId: function (widget, ids) {
    widget.getNextRecordId(ids)
  },
  _clear: function () {
    this.recordIndexs = {}
    this._db.cacheData.clear()
  },
  getNextRecordId: function (ids) {
    let nextRecordId = null
    if (this._db.bindWidgets) {
      for (let i = 0; i < this._db.bindWidgets.length; i++) {
        if (this._db.bindWidgets[i].getNextRecordId) {
          nextRecordId = this._db.bindWidgets[i].getNextRecordId(ids)
          break
        }
      }
    }
    return nextRecordId
  }
}

let DB = function () {
  return new DataSourceExt()
}
/**
 *
 * @param {Object} input
 */
let unSerialize = function (input) {
  let dataSourceName = input.dataSource + '_$unSerialize'
  let dataCfg = input.datas
  let metadataCfg = input.metadata
  let fields = _getFieldsFromModels(metadataCfg)
  let scopeId = ScopeManager.getCurrentScopeId()
  isc.VDataSource.createFormCfg(dataSourceName, fields, scopeId)
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
  return DataSourceExt
}

export { DB, getConstructor, unSerialize }
