import { ComponentInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { IParams } from '../interfase/initComponentInterface'
import addRoute from './addRoute'
import addVariantDefines from './addVariantDefines'
import addOptionDefines from './addOptionDefines'
import addServiceMapping from './addServiceMapping'
import registerMetadata from './registerMetadata'

const init = function ({ componentCode, componentSchema }: IParams) {
  // if (!ComponentInfo.isComponentSchemaInited(componentCode)) return
  if (!componentSchema) return
  let { variants, options, logics, manifest, domains } = componentSchema

  logics && addRoute(componentCode, logics)
  variants && addVariantDefines(componentCode, variants)
  options && addOptionDefines(componentCode, options)
  manifest && addServiceMapping(manifest)
  domains && registerMetadata(componentCode, domains)

  ComponentInfo.markComponentSchemaInited(componentCode)
}
export { init }
