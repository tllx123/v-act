import { Inappbrowser as browserService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
let ERRORNAME, sandbox
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  if (undefined != browserService && window.VJSBridge) {
    ERRORNAME = '函数[OpenLinkByBrowser]：'
    let args = param.getArgs()
    let BROWERTYPE = browserService.BROWERTYPE.SystemBrowser
    if (args.length != 1)
      HandleException('需要一个参数，当前参数个数：' + args.length)
    let url = args[0] //获取函数第一个参数
    if (undefined == url || null == url || url == '')
      HandleException('参数1不能为空')
    //调用vjs服务
    browserService.open(url, BROWERTYPE)
  } else {
    //非移动端不处理
  }
}
//判断是否PC
function IsPC() {
  let userAgentInfo = navigator.userAgent
  let Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  ]
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
/**
 * desc 非回调中抛异常
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException(error_msg) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  throw exception
}
export { main }
