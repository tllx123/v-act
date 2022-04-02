import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

//主入口(必须有)
let main = function (...args: any[]) {
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
