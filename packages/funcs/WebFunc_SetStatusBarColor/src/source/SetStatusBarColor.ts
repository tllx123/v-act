import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { StatusBar as colorUtil } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()

  //判断参数个数
  CheckParamNum('设置状态栏颜色-SetStatusBarColor', args, 1)
  //获取上下文
  let context = new ExpressionContext()
  context.setRouteContext(param.getRouteContext())

  //获取参数
  let param1 = args[0] //获取函数第一个参数

  //判断参数是否为空
  CheckParamEmpty('设置状态栏颜色-SetStatusBarColor', 'colorName', param1)

  //设置状态栏颜色
  colorUtil.changeStatusBarColor(param1)
}

/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * */
function CheckParamNum(funName, paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    throw new Error(
      '函数[' +
        funName +
        ']需要' +
        targetNum +
        '个参数，当前参数个数：' +
        paramArray.length
    )
  }
}
/*
 * 判断参数是否为空
 * paramName 参数名称
 * paramValue 参数值
 * */
function CheckParamEmpty(funName, paramName, paramValue) {
  if (paramValue == null) {
    throw new Error('函数[' + funName + ']的参数[' + paramName + ']不能为空！')
  }
}
/*
 * 执行表达式（自带空判断）
 * funName 函数名称
 * paramName 参数名称
 * paramValue 参数值
 * context 路由上下文
 * */
function ExecuteExpress(funName, paramName, paramValue, context) {
  if (paramName == null) {
    throw new Error('函数[' + funName + ']的参数[' + paramName + ']不能为空！')
  }
  let result = engine.execute({ expression: paramValue, context: context })
  if (result == null) {
    throw new Error('函数[' + funName + ']的参数[' + paramName + ']不能为空！')
  }
  return result
}
export { main }
