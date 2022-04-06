import { IOptions } from '../interfase/initComponentInterface'
import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { parseData } from '../utils'

export default (componentCode: string, options: IOptions) => {
  if (Array.isArray(options.option)) {
    for (let item of options.option) {
      item && ComponentParam.addVariantDefines(componentCode, parseData(item))
    }
  } else {
    options.option &&
      ComponentParam.addOptionDefines(componentCode, parseData(options.option))
  }
}
