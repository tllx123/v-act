/**
 *
 *
 */
import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
const vds = { component }

const main = function () {
  var compCode = vds.component.getCode()
  return compCode ? compCode : ''
}
export { main }
