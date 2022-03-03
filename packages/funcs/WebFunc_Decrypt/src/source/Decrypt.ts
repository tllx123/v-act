import { EncryptUtil as math } from '@v-act/vjs.framework.extension.platform.services.domain.encrypt'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
let undefined
let undefined
exports.initModule = function (sb) {
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  let decryptValue = args[0] //需解密的值
  let type = args[1] //加密类型
  let result = ''
  if (decryptValue == null || decryptValue == undefined) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '解密的值不能为空!'
    })
    throw exception
  }
  if (type == null || type == undefined) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '解密的类型不能为空!'
    })
    throw exception
  }
  if (args[2]) {
    result = math.decryptPwdHash(decryptValue, type, args[2])
  } else {
    result = math.decryptHash(decryptValue, type)
  }
  return result
}

export { main }
