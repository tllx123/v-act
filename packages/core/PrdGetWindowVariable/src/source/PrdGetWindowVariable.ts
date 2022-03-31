import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { JsonUtil as jsonUtil } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'

const initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  // 获取输入变量编码
  let variableCode = args.length > 0 ? args[0] : null
  if (null == variableCode || '' == variableCode) {
    return
  }
  let variableValue = windowParam.getInput({
    code: variableCode
  })
  return variableValue
}

export { initModule, main }
