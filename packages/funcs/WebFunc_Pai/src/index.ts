/**
 *	圆周率
 *  代码示例:Pai() 返回值为3.141592653589793
 *  无参数
 *  返回值为小数
 */
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

var main = function () {
  return vds.math.pi()
}
export { main }
