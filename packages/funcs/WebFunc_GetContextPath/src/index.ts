/**
 * 获取当前应用上下文：GetContextPath() 返回值等同 request.getContextPath的效果。
 */
import * as environment from '@v-act/vjs.framework.extension.platform.services.integration.vds.environment'
const vds = { environment }

const main = function () {
  var path = vds.environment.getContextPath()
  return path ? path : ''
}
export { main }
