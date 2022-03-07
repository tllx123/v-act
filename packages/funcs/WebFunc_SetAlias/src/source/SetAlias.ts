import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let jpush

export function initModule(sb) {}

const main = function (param) {
  FUNCNAME = '函数[SetAlias]：'
  let args = param.getArgs()
  if (args.length != 1) {
    HandleException(FUNCNAME + '需要一个参数，当前参数个数：' + args.length)
  }
  let alias = args[0]
  if (!checkParamValid(alias)) {
    HandleException(FUNCNAME + '参数仅支持数字、字母、下划线、中文')
  }

  if (!checkStringLenValid(alias)) {
    HandleException(FUNCNAME + '仅支持40字节长度的参数')
  }
  if (window.JPush) {
    if (window.device && window.device.platform == 'iOS') {
      window.JPush.setAlias(alias)
    } else {
      window.JPush.setAlias({
        sequence: Math.floor(Math.random() * 10000) + 1,
        alias: alias
      })
    }
  } else {
    alert('请确认在移动App端使用此【SetAlias】函数，并且开启【极光推送】插件')
  }
}

/**
 * desc 判断入参是否符合规范，仅支持数字、字母、下划线、中文
 * param 入参
 * */
function checkParamValid(param) {
  if (param === '') return true

  let reg = new RegExp('^[0-9a-zA-Z_\u4e00-\u9FA5]+$')
  return reg.test(param)
}

/**
 * desc 判断入参字节长度是否小于40字节（UTF-8）
 * param 入参
 * */
function checkStringLenValid(param) {
  let totalLength = 0,
    i,
    charCode

  for (i = 0; i < param.length; i++) {
    charCode = param.charCodeAt(i)
    if (charCode < 0x007f) totalLength = totalLength + 1
    else if (0x0080 <= charCode && charCode <= 0x07ff) totalLength += 2
    else if (0x0800 <= charCode && charCode <= 0xffff) totalLength += 3
  }

  if (totalLength > 40) return false
  else return true
}

/**
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.services.engine":null,
 * services:
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 *
 * */
function experssFunc(experss, routeContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

/**
 * desc 异常处理方法
 * error_msg 提示信息
 * */
function HandleException(error_msg) {
  log.log(error_msg)
  return false
  // 以下逻辑将使手机端前台页面弹出提示信息
  // var exception = factory.create({
  // 	"type": factory.TYPES.Dialog,
  // 	"message": error_msg
  // });
  // throw exception;
}
export { main }
