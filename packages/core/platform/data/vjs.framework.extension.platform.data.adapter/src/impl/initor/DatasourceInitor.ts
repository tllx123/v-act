import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sb: any) {}

const init = function (params: any) {
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

export { init }
