exports.initModule = function () {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    checkStr = argsLen >= 1 ? args[0] : null

  if (undefined == checkStr || null == checkStr) return false
  else {
    checkStr = checkStr + ''
    let checkret = checkStr.match(/[\u4e00-\u9fa5]/)
    return checkret != null
  }
}

export { main }
