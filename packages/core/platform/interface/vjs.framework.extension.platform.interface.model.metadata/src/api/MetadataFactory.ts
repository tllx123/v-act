import { DatasourceEnums as datasourceEnums } from '@v-act/vjs.framework.extension.platform.interface.enum'

import * as fieldFactory from '../api/FieldFactory'
import Metadata from '../api/Metadata'

export function initModule(sb) {}

const create = function (params) {
  let dataSourceName = params.dataSourceName,
    fields = params.fields,
    chineseName = params.chineseName
  let hasPrimaryKey = false
  for (let i = 0, field; (field = params.fields[i]); i++) {
    let code = field.code.toLowerCase()
    if (code == 'id') {
      hasPrimaryKey = true
      break
    }
  }
  if (hasPrimaryKey == false) {
    fields.push(
      fieldFactory.unSerialize({
        code: datasourceEnums.IDFIELD,
        type: 'char',
        defaultValue: '',
        expression: ''
      })
    )
  }
  let metadata = new Metadata(dataSourceName, fields)
  metadata.setChineseName(chineseName)
  return metadata
}

const unSerialize = function (input) {
  let model = input.model
  if (model.length > 1) {
    throw Error('[Metadata.unSerialize]未知元数据格式，请检查！')
  }
  model = model[0]
  let dataSourceName = model.datasourceName
  let chineseName = model.chineseName
  let fields = []
  let fieldCfg = model.fields
  let hasPrimaryKey = false
  for (let i = 0, cfg; (cfg = fieldCfg[i]); i++) {
    fields.push(fieldFactory.unSerialize(cfg))
    if (!hasPrimaryKey) {
      let code = cfg.code.toLowerCase()
      hasPrimaryKey = code == 'id'
    }
  }
  if (!hasPrimaryKey) {
    fields.push(
      fieldFactory.unSerialize({
        code: datasourceEnums.IDFIELD,
        type: 'char',
        defaultValue: ''
      })
    )
  }
  return this.create({
    dataSourceName: dataSourceName,
    fields: fields,
    chineseName: chineseName
  })
}

export {
  adapt,
  Any,
  begin,
  Boolean,
  Char,
  collect,
  create,
  Date,
  File,
  getDataValidator,
  Integer,
  LongDate,
  Number,
  Object,
  Text,
  unSerialize
}
