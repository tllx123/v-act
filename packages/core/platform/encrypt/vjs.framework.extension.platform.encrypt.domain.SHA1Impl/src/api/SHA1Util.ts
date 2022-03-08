import * as SHA1Util from './src/SHA1'
let bcryptUtil

export function initModule() {}

let genHash = function (encryptValue) {
  //生成加密后的hash值
  let hash = SHA1Util.hex_sha1(encryptValue)
  return hash
}
export { genHash }
