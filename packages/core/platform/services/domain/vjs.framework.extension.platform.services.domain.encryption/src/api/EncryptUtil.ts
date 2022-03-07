let sandbox
export function initModule(sb) {
  sandbox = sb
}

/**
 * 获取运行时对应的具体加密实现服务
 */
let _getEncryptService = function (type) {
  let encrypt = sandbox.getService(
    'vjs.framework.extension.platform.encrypt.domain.encrypt.encryptImpl',
    { type: type }
  )
  return encrypt
}
/**
 * 生成加密后的hash值
 */
let genHash = function (encryptValue, type) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.genHash(encryptValue)
  return result
}

let genPwdHash = function (encryptValue, type, pwd) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.genPwdHash(encryptValue, pwd)
  return result
}

/**
 * 解密生成的字符串
 */
let decryptHash = function (encryptValue, type) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.decryptHash(encryptValue)
  return result
}

let decryptPwdHash = function (encryptValue, type, pwd) {
  let encrypt = _getEncryptService(type)
  let result = encrypt.decryptPwdHash(encryptValue, pwd)
  return result
}
export { genHash, genPwdHash, decryptHash, decryptPwdHash }
