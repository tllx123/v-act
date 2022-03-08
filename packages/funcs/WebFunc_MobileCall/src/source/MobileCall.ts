//加载模块
let sandBox

export function initModule(sb) {
  sandBox = sb
}

//主入口(必须有)
const main = function (param) {
  let args = param.getArgs()
  let argsLen = args ? args.length : 0
  let phoneNumber = argsLen >= 1 ? args[0] : null
  if (phoneNumber) {
    if (window.cordova && window.cordova.platformId == 'ios') {
      if (
        window.cordova.plugins.system &&
        window.cordova.plugins.system.config.call
      ) {
        window.cordova.plugins.system.config.call(phoneNumber)
      } else {
        window.location.href = 'tel://' + phoneNumber
      }
    } else {
      window.location.href = 'tel:' + phoneNumber
    }
  }
}

export { main }
