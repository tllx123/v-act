import * as md5 from '../src/md5'

let genHash = function (encryptValue: string) {
  let result = md5.CryptoJS.MD5(encryptValue)
  return result
}

export { genHash }
