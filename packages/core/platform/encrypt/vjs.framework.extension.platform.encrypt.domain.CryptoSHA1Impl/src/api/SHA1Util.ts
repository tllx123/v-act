import * as SHA1Util from './src/SHA1'

export function initModule() {}

let genHash = function (encryptValue) {
  //生成加密后的hash值
  let hash = SHA1Util.CryptoJS.SHA1(encryptValue)
  return hash
}
export { genHash }
