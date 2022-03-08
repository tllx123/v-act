import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let sandbox
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let FUNCNAME = '前台函数[IsExistWindowInstanceCode]-'
  //获取函数传入的参数
  let _result = true
  let args = param.getArgs()
  if (!CheckParamNum(FUNCNAME, args, 1)) return false
  let scopeId = args[0] //获取函数第一个参数
  if (undefined == scopeId || scopeId == '') {
    DWException(FUNCNAME + '第一个参数为空,请检查配置！')
    return false
  }
  scopeManager.openScope(scopeId)
  let scope = scopeManager.getWindowScope()
  if (undefined == scope) {
    _result = false
  }
  scopeManager.closeScope()
  return _result
}
/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * */
function CheckParamNum(funName, paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    DWException(
      funName +
        '需要' +
        targetNum +
        '个参数，当前参数个数：' +
        paramArray.length
    )
    return false
  }
  return true
}
//异常处理方法
function DWException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Dialog,
    message: tmpvar
  })
  exception.handle()
}
export { main }
