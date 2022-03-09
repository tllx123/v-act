/**
 * EncryptFunc 加密函数
 * 输入：encryptValue：需要加密的值
 *       type：加密类型 支持【SHA-1、SHA-256、SHA-384、SHA512、AES、MD5】
 *       algorithmKey：密钥。aes加密下必填
 * 输出：加密后的值
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { exception, string }

const main = function (encryptValue, type, algorithmKey) {
  var result = ''

  if (encryptValue == null) {
    throw vds.exception.newConfigException('参数1(明文字符串)不能为空！')
  }
  if (type == null) {
    throw vds.exception.newConfigException('参数2(加密算法)不能为空！')
  }
  if (algorithmKey == null) {
    throw vds.exception.newConfigException('参数3(密钥)不能为空！')
  }
  if (type.toLowerCase() == 'aes' && algorithmKey == null) {
    throw vds.exception.newConfigException('aes加密需要指定密钥')
  }

  if (type.toLowerCase() == 'aes') {
    result = vds.string.encrypt(encryptValue, type, algorithmKey)
  } else {
    result = vds.string.encrypt(encryptValue, type)
    // 为什么要baseEncode？
    // result = math.baseEncode(result);
  }
  return result
}
export { main }
