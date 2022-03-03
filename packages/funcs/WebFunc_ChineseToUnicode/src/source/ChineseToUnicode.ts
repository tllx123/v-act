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
  let retVal = toUnicode(arg1)
  return retVal
}

function toUnicode(data) {
  if (mathUtil.isEmpty(data)) return ''

  //ת�������ַ�
  let res = []
  for (let i = 0; i < data.length; i++) {
    res[i] = ('00' + data.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')

  //ֻת���Ĳ���
  //var txt = escape(data).toLocaleLowerCase().replace(/%u/gi, '\\u');
  //var retVal= txt.replace(/%7b/gi, '{').replace(/%7d/gi, '}').replace(/%3a/gi, ':').replace(/%2c/gi, ',').replace(/%27/gi, '\'').replace(/%22/gi, '"').replace(/%5b/gi, '[').replace(/%5d/gi, ']').replace(/%3D/gi, '=').replace(/%20/gi, ' ').replace(/%3E/gi, '>').replace(/%3C/gi, '<').replace(/%3F/gi, '?');
  //return retVal;
}

export { main }
