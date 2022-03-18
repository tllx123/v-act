/**
 * 编码字符串累加或累减
 * @author	huangjr
 * @since	20120705
 * @param {Object} numberCode	能转换成数值的编码字符串
 * @param {Object} num	加减值
 */
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { string }

const main = function (numberCode: string, num: number) {
  if (typeof numberCode == 'string' && numberCode != '')
    numberCode = vds.string.trim(numberCode)

  return vds.string.numberAdd(numberCode, num)
}
export { main }
