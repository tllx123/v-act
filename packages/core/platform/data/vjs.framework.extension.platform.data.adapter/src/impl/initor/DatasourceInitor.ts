import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'

let undefined

exports.initModule = function (sb) {}

const init = function (params) {
  let configs = params.configs
  let dsName = params.code ? params.code : uuid.generate()
  let fields = []
  for (let i = 0, len = configs.length; i < len; i++) {
    let config = configs[i]
    fields.push({
      code: config.getCode(),
      name: config.getName(),
      type: config.getType(),
      defaultValue: config.geInitValue()
    })
  }
  let data = {
    metadata: {
      model: [
        {
          datasource: dsName,
          fields: fields
        }
      ]
    }
  }
  return datasourceFactory.unSerialize(data)
}

export { adapt, init, init, adapt, adapt, adapt, init }
