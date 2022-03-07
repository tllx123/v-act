import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let FUNCNAME = '函数[GetSystemCurrentTimeMillis]：'
  //获取函数传入的参数
  let args = param.getArgs()
  let result = ''
  if (args.length == 0) {
    result = new Date().getTime()
    return result
  } else {
    HandleException(FUNCNAME + '参数个数不正确，当前参数个数：' + args.length)
    return
  }
}
function HandleException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Dialog,
    message: tmpvar
  })
  exception.handle()
}
export { main }
