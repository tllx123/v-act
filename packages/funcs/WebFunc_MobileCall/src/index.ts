/**
 *  拨打电话函数
 */
var main = function (param) {
  var args = param.getArgs()
  var argsLen = args ? args.length : 0
  var phoneNumber = argsLen >= 1 ? args[0] : null
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
