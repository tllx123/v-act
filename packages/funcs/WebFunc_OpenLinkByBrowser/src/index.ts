/**
 *
 *
 */
var main = function (param) {
  //获取函数传入的参数
  if (undefined != browserService && window.VJSBridge) {
    ERRORNAME = '函数[OpenLinkByBrowser]：'
    var args = param.getArgs()
    var BROWERTYPE = browserService.BROWERTYPE.SystemBrowser
    if (args.length != 1)
      HandleException('需要一个参数，当前参数个数：' + args.length)
    var url = args[0] //获取函数第一个参数
    if (undefined == url || null == url || url == '')
      HandleException('参数1不能为空')
    //调用vjs服务
    browserService.open(url, BROWERTYPE)
  } else {
    //非移动端不处理
  }
}
export { main }
