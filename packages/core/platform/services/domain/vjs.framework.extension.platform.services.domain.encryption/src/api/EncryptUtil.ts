import * as aes from '@v-act/vjs.framework.extension.platform.encrypt.domain.aesimpl'

const impls = { aes }

/**
 * 获取运行时对应的具体加密实现服务
 */
let _getEncryptService = function (type: string) {
  return impls[type]
}
/**
 * 生成加密后的hash值
 */
let genHash = function (encryptValue: string, type: string) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.genHash(encryptValue)
  return result
}

let genPwdHash = function (encryptValue: string, type: string, pwd: string) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.genPwdHash(encryptValue, pwd)
  return result
}

/**
 * 解密生成的字符串
 */
let decryptHash = function (encryptValue: string, type: string) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.decryptHash(encryptValue)
  return result
}

let decryptPwdHash = function (
  encryptValue: string,
  type: string,
  pwd: string
) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.decryptPwdHash(encryptValue, pwd)
  return result
}
export { decryptHash, decryptPwdHash, genHash, genPwdHash }
