import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

//主入口(必须有)
let main = function (param: any) {
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

export { main }
