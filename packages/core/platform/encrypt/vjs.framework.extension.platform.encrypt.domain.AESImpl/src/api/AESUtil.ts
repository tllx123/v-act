//import * as aes from './src/aes'
import * as aes from '../src/aes'

let genHash = function (encryptValue: string) {
  let result = aes.CryptoJS.AES.encrypt(encryptValue, '')
  return result
}

let genPwdHash = function (encryptValue: string, pwd: string) {
  //生成加密后的hash值
  let hash = aes.CryptoJS.AES.encrypt(encryptValue, pwd)
  return hash
}

let decryptHash = function (decryptValue: string) {
  let aesDecrypt = aes.CryptoJS.AES.decrypt(decryptValue, '')
  let result = aesDecrypt.toString(aes.CryptoJS.enc.Utf8)
  return result
}

let decryptPwdHash = function (decryptValue: string, pwd: string) {
  //根据密钥，解密生成的字符串
  let aesDecrypt = aes.CryptoJS.AES.decrypt(decryptValue, pwd)
  let result = aesDecrypt.toString(aes.CryptoJS.enc.Utf8)
  return result
}

export { decryptHash, decryptPwdHash, genHash, genPwdHash }
