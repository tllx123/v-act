import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as number from '@v-act/vjs.framework.extension.platform.services.integration.vds.number'
const vds = { object, math, number }

const main = function (num: number): number {
  if (vds.object.isUndefOrNull(num)) {
    throw new Error('反余弦函数参数为空，请检查')
  }
  if (!vds.object.isNumber(num)) {
    throw new Error('反余弦函数参数不是数字，请检查')
  }
  if (num > 1 || num < -1) {
    throw new Error('反余弦函数参数不在-1至1之间，请检查')
  }
  var result = vds.number.toFixed(vds.math.acos(num), 10)
  return Number(result)
}

export { main }
