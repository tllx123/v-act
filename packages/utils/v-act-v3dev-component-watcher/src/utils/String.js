const crypto = require('crypto-js')

exports.toMD5 = function (content) {
  return crypto.MD5(content).toString()
}
