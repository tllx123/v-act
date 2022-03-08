/**
 *
 *
 */
var main = function (param) {
  //获取函数传入的参数
  var args = param.getArgs()
  var argsLen = args ? args.length : 0
  var componentCode = argsLen >= 1 ? args[0] : null
  var windowCode = argsLen >= 2 ? args[1] : null
  var title = null
  var windowInputParams = { variable: {} }
  browser.redirectLocation({
    componentCode: componentCode,
    windowCode: windowCode,
    title:
      title == undefined || title == null ? title : encodeURIComponent(title),
    inputParam: windowInputParams
  })
}
export { main }
