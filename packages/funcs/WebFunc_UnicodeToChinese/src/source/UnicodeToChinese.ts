import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'

let undefined

exports.initModule = function (sb) {}

//�����(������)
let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg1)) return ''

  arg1 = String(arg1)
  let retVal = toChinese(arg1)
  return retVal
}

function toChinese(data) {
  if (mathUtil.isEmpty(data)) return ''

  data = data.replace(/\\/g, '%')
  let retVal = unescape(data)
  return retVal
}

export { main }
