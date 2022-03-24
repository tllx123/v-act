import * as aes from '@v-act/vjs.framework.extension.platform.encrypt.domain.aesimpl'
import * as base64 from '@v-act/vjs.framework.extension.platform.encrypt.domain.base64impl'
import * as bcrypt from '@v-act/vjs.framework.extension.platform.encrypt.domain.bcryptimpl'
import * as cryptosha1 from '@v-act/vjs.framework.extension.platform.encrypt.domain.cryptosha1impl'
import * as md5 from '@v-act/vjs.framework.extension.platform.encrypt.domain.md5impl'
import * as sha1 from '@v-act/vjs.framework.extension.platform.encrypt.domain.sha1impl'
import * as standardMd5 from '@v-act/vjs.framework.extension.platform.encrypt.domain.standardmd5impl'

const impls = { aes, base64, bcrypt, cryptosha1, md5, sha1, standardMd5 }

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
