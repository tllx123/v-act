/**
 *	e
 *  代码示例:E() 返回值为2.718281828459045
 *  无参数
 *  返回值为小数
 */
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

var main = function (param) {
  return vds.math.e()
}
export { main }
