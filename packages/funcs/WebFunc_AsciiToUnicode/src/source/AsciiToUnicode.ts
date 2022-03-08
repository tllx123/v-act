import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'

export function initModule(sb) {}

//�����(������)
const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null

  if (mathUtil.isEmpty(arg1)) return ''

  arg1 = String(arg1)
  let retVal = toUnicode(arg1)
  return retVal
}

function toUnicode(data) {
  if (mathUtil.isEmpty(data)) return ''

  let retVal = ''
  for (let i = 0; i < data.length; i++) {
    retVal += '&#' + data.charCodeAt(i) + ';'
  }
  return retVal
}

export { main }
