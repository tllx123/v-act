/**
 *  Encrypt 加密函数
 * 输入：encryptValue：需要加密的值
 *       type：加密类型
 * 输出：加密后的值
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'

const vds = { exception }

const main = function (decryptValue, type, secretkey) {
  var result = ''
  if (decryptValue == null || decryptValue == undefined) {
    var exception = vds.exception.newConfigException('加密的值不能为空!')
    throw exception
  }
  if (type == null || type == undefined) {
    var exception = vds.exception.newConfigException('加密的类型不能为空!')
    throw exception
  }
  if (secretkey) {
    if (type == 'aes') {
      result = math.genPwdHash(decryptValue, type, secretkey)
    } else {
      result = math.genHash(decryptValue, type)
    }
  } else {
    result = math.genHash(decryptValue, type)
  }
  return result
}
export { main }
