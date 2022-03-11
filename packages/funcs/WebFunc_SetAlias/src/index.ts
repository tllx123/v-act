import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import  {FunctionContext} from '@v-act/vjs.framework.extension.platform.interface.function'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { math,exception }

const main = function (param:FunctionContext) {
  var FUNCNAME = '函数[SetAlias]：'
  var args = param.getArgs()
  if (args.length != 1) {
    HandleException(FUNCNAME + '需要一个参数，当前参数个数：' + args.length)
  }
  var alias = args[0]
  if (!checkParamValid(alias)) {
    HandleException(FUNCNAME + '参数仅支持数字、字母、下划线、中文')
  }

  if (!checkStringLenValid(alias)) {
    HandleException(FUNCNAME + '仅支持40字节长度的参数')
  }
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    if (window.device && window.device.platform == 'iOS') {
      //@ts-ignore
      window.JPush.setAlias(alias)
    } else {
      //@ts-ignore
      window.JPush.setAlias({
        sequence: vds.math.floor(vds.math.random() * 10000) + 1,
        alias: alias
      })
    }
  } else {
    alert('请确认在移动App端使用此【SetAlias】函数，并且开启【极光推送】插件')
  }
}
function HandleException(error_msg:string) {
  var exception = vds.exception.newBusinessException(error_msg)
  throw exception
}
export { main }
