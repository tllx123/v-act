import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ResultSet as Resultset } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { Record as Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
const initModule = function (sBox: any) {}

let primaryKey = 'id'

let SmartclientDatasource = function (metadata: any) {
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

SmartclientDatasource.prototype = {}

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
