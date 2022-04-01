import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { IDomains } from '../interfase/initComponentInterface'

export default (domains: IDomains) => {
  if (!domains) return
  let { module } = domains
  if (Array.isArray(module)) {
    for (let item of module) {
      if (Array.isArray(item.elements)) {
      } else {
        // item.elements.element.config = JSON.parse(item.elements.element.config)
        // console.log(item.elements.element)
      }
    }
  }
}
