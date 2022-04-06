import { IVariants } from '../interfase/initComponentInterface'
import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { parseData } from '../utils'

export default (componentCode: string, variants: IVariants) => {
  if (!variants) return
  if (Array.isArray(variants.variant)) {
    for (let item of variants.variant) {
      item && ComponentParam.addVariantDefines(componentCode, parseData(item))
    }
  } else {
    variants.variant &&
      ComponentParam.addVariantDefines(
        componentCode,
        parseData(variants.variant)
      )
  }
}
