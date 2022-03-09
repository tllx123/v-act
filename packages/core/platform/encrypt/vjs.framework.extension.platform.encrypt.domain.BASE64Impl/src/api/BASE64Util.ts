import * as base64 from './src/base64'
const initModule = function () {}

let genHash = function (encryptValue) {
  let wordArray = base64.CryptoJS.enc.Utf8.parse(encryptValue)
  let result = base64.CryptoJS.enc.Base64.stringify(wordArray)
  return result
}

let decryptHash = function (decryptValue) {
  let parsedWordArray = base64.CryptoJS.enc.Base64.parse(decryptValue)
  let result = parsedWordArray.toString(base64.CryptoJS.enc.Utf8)
  return result
}

export { decryptHash, genHash }
