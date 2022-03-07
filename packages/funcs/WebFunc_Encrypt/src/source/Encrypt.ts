import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

import * as math from '.Util'

export function initModule(sb) {
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let args = param.getArgs()
  let decryptValue = args[0] //需解密的值
  let type = args[1] //加密类型
  let result = ''
  if (decryptValue == null || decryptValue == undefined) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '加密的值不能为空!'
    })
    throw exception
  }
  if (type == null || type == undefined) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '加密的类型不能为空!'
    })
    throw exception
  }
  if (args[2]) {
    if (type == 'aes') {
      result = math.genPwdHash(decryptValue, type, args[2])
    } else {
      result = math.genHash(decryptValue, type)
    }
  } else {
    result = math.genHash(decryptValue, type)
  }
  return result
}

export { main }
