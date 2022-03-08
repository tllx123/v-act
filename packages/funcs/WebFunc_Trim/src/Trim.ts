import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

//主入口(必须有)
const main = function (param: FunctionContext) {
  let args = param.getArgs()
  let param1 = args[0]
  let param2: string | boolean = ''
  if (args.length > 1) {
    param2 = args[1]
  }

  let isAll = false
  let newStr = ''
  if (param1 == null || param1 == undefined || param1 == 'NaN') {
    return
  }
  if (param2 == true || param2 == 'true') {
    isAll = true
  }
  newStr = param1.replace(/(^\s*)|(\s*$)/g, '')
  if (isAll) {
    newStr = newStr.replace(/\s/g, '')
  }
  return newStr
}

export { main }
