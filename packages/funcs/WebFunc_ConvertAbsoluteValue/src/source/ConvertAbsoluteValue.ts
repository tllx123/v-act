import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  //获取参数示例：
  //var param1 = args[0];//获取函数第一个参数
  let value = parseFloat(args[0])
  if (value == null || value.toString() == 'NaN') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '参数传入的值为空或者不是数字类型！'
    })
    throw exception
  }
  if (value >= 0) return value
  else return -value
}

export { main }
