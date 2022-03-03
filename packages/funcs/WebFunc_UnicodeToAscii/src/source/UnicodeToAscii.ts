import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sb) {}

//�����(������)
let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg1)) return ''

  arg1 = String(arg1)
  let retVal = toAscii(arg1)
  return retVal
}

function toAscii(data) {
  if (mathUtil.isEmpty(data)) return ''

  let code = data.match(/&#(\d+);/g)
  let retVal = ''
  for (let i = 0; i < code.length; i++) {
    retVal += String.fromCharCode(code[i].replace(/[&#;]/g, ''))
  }
  return retVal
}

export { main }
