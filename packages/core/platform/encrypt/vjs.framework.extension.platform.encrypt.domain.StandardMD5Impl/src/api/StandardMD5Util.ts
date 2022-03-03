import * as md5 from './src/md5'
let undefined
exports.initModule = function (sb) {}

let genHash = function (encryptValue) {
  let result = md5.CryptoJS.MD5(encryptValue)
  return result
}

export { genHash }
