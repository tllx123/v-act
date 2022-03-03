import * as aes from './src/aes'
let undefined
exports.initModule = function () {}

let genHash = function (encryptValue) {
  let result = aes.CryptoJS.AES.encrypt(encryptValue, '')
  return result
}

let genPwdHash = function (encryptValue, pwd) {
  //生成加密后的hash值
  let hash = aes.CryptoJS.AES.encrypt(encryptValue, pwd)
  return hash
}

let decryptHash = function (decryptValue) {
  let aesDecrypt = aes.CryptoJS.AES.decrypt(decryptValue, '')
  let result = aesDecrypt.toString(aes.CryptoJS.enc.Utf8)
  return result
}

let decryptPwdHash = function (decryptValue, pwd) {
  //根据密钥，解密生成的字符串
  let aesDecrypt = aes.CryptoJS.AES.decrypt(decryptValue, pwd)
  let result = aesDecrypt.toString(aes.CryptoJS.enc.Utf8)
  return result
}

export { genHash, genPwdHash, decryptHash, decryptPwdHash }
