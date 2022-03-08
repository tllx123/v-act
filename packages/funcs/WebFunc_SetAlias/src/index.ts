import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { math }

var main = function (param) {
  FUNCNAME = '函数[SetAlias]：'
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
  if (window.JPush) {
    if (window.device && window.device.platform == 'iOS') {
      window.JPush.setAlias(alias)
    } else {
      window.JPush.setAlias({
        sequence: vds.math.floor(vds.math.random() * 10000) + 1,
        alias: alias
      })
    }
  } else {
    alert('请确认在移动App端使用此【SetAlias】函数，并且开启【极光推送】插件')
  }
}
export { main }
