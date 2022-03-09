import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import * as DataSourceExtService from './impl/SmartClientDB'

let isEmpty, sandbox

let MultiDataSourceExt = function (params) {
  let metadata = params.metadata
  this.multiDsSpecialChar = params.multiDsSpecialChar
  let dataSourceExt = DataSourceExtService.getConstructor()
  let ds = new dataSourceExt(metadata)
  this.dataList = params.dataList
  let newdb = (this._db = ds._db)
  let db = this
  newdb.beforePerformDSOperation = ScopeManager.createScopeHandler({
    scopeId: this.scopeId,
    handler: function (operationType, data, requestProperties) {
      switch (operationType) {
        case 'add':
        case 'insert':
        case 'replace':
        case 'update':
          //处理字段事件
          if (requestProperties && requestProperties.notFromUI !== true) {
            //由UI触发才需要触发字段事件
            var eventCfg = this.__fieldEventCfg
            if (eventCfg) {
              for (var attr in eventCfg) {
                if (data.hasOwnProperty(attr)) {
                  data[attr] = eventCfg[attr](data[attr])
                }
              }
            }
          }
          var dsDatas = {}
          for (var key in data) {
            if (
              !data.hasOwnProperty(key) ||
              key.indexOf(db.multiDsSpecialChar) == -1
            ) {
              continue
            }
            var info = key.split(db.multiDsSpecialChar)
            if (!info[1]) {
              continue
            }
            var dsName = info[0]
            var fieldValues = dsDatas[dsName]
            if (!fieldValues) {
              fieldValues = dsDatas[dsName] = {}
            }
            fieldValues[info[1]] = data[key]
          }
          for (var dsName in dsDatas) {
            var fieldDatas = dsDatas[dsName]
            var ds = db.dataList[dsName].datasource
            var record = ds.getRecordById(fieldDatas.id)
            if (record) {
              //作为更新
              record.setDatas(fieldDatas)
              // 如果在这里把更新记录提交的话，DB的修改记录无法同步到UI
              // 把需要更新记录缓存起来，afterPerformDSOperation中再提交记录
              if (!requestProperties.records) {
                requestProperties.records = []
              }
              requestProperties.records.push({
                datasource: ds,
                record: record
              })
              var preData = db._getPreData(record)
              if (!requestProperties.preDatas) {
                requestProperties.preDatas = []
              }
              requestProperties.preDatas.push(preData)
            } else {
              //作为新增
              var record = ds.createRecord()
              ds.insertRecords({
                records: [record]
              })
              fieldDatas.id = record.getSysId()
              record.setDatas(fieldDatas)
              ds.updateRecords({
                records: [record]
              })
            }
          }
          break
      }
    }
  })
  newdb.afterPerformDSOperation = ScopeManager.createScopeHandler({
    scopeId: this.scopeId,
    handler: function (operationType, data, requestProperties) {
      switch (operationType) {
        case 'add':
        case 'insert':
        case 'replace':
        case 'update':
          if (requestProperties.preDatas) {
            var preDatas = requestProperties.preDatas
            for (var i = 0, len = preDatas.length; i < len; i++) {
              var preData = preDatas[i]
              for (var key in preData) {
                if (!preData.hasOwnProperty(key)) {
                  continue
                }
                var fieldCode = preData[key]
                requestProperties.records[i].record.__recordData__[fieldCode] =
                  preData[fieldCode]
              }
            }
            requestProperties.preData = null
          }
          if (requestProperties.records) {
            var records = requestProperties.records
            for (var i = 0, len = records.length; i < len; i++) {
              var record = records[i]
              var ds = record.datasource
              ds.updateRecords({
                records: [record.record]
              })
            }
            requestProperties.records = null
          }
          return false
      }
    }
  })
  return this
}

MultiDataSourceExt.prototype = {
  initModule: function (sBox) {
    sandbox = sBox
    isEmpty = sBox.util.object.isEmpty
    var prototype = Object.create(
      DataSourceExtService.getConstructor().prototype
    )
    prototype.constructor = MultiDataSourceExt
    sandbox.util.object.extend(prototype, MultiDataSourceExt.prototype)
    MultiDataSourceExt.prototype = prototype
  }
}
return MultiDataSourceExt

export { initModule, getConstructor, DB, unSerialize }
