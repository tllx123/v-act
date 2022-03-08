import { DatasourceManager as dsManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

export function initModule(sb) {}

const getSelectedAndCurrentRecords = function (params) {
  let datasource = dsManager.lookup({ datasourceName: params.datasourceName })
  let rd = datasource.getCurrentRecord()
  let rs = []
  if (rd) {
    rs.push(rd)
  }
  let sel = datasource.getSelectedRecords()
  let iterator = sel.iterator()
  while (iterator.hasNext()) {
    let record = iterator.next()
    if (!rd || rd.getSysId() != record.getSysId()) {
      rs.push(record)
    }
  }
  return rs
}

const hasChanged = function (params) {
  let datasource = dsManager.lookup({ datasourceName: params.datasourceName })
  let rds = datasource.getInsertedRecords()
  if (rds.size() > 0) {
    return true
  }
  rds = datasource.getUpdatedRecords()
  if (rds.size() > 0) {
    return true
  }
  rds = datasource.getDeletedRecords()
  if (rds.size() > 0) {
    return true
  }
  return false
}

const getFieldName = function (fieldName) {
  let retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    retvalue = fieldName.split('.')[1]
  }
  return retvalue
}

const createRecords = function (params) {
  let datas = params.datas
  if (datas && datas.length > 0) {
    let datasource = dsManager.lookup({ datasourceName: params.datasourceName })
    let rs = []
    for (let i = 0, l = datas.length; i < l; i++) {
      let data = datas[i]
      let record = datasource.createRecord()
      record.setDatas(data)
      rs.push(record)
    }
    return rs
  }
  return []
}

export { createRecords, getFieldName, getSelectedAndCurrentRecords, hasChanged }
