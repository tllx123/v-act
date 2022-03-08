import * as md5 from './src/md5'

export function initModule(sb) {}

let genHash = function (encryptValue) {
  let result = md5.CryptoJS.MD5(encryptValue)
  return result
}

export { genHash }
