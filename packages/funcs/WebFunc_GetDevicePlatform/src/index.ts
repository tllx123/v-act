/**
 *
 *
 */
const main = function () {
  //        var type=deviceUtil.getDevicePlatform();

  var ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'iOS'
  } else if (/android/.test(ua)) {
    return 'Android'
  } else {
    return 'pc'
  }

  //        return ua;
}
export { main }
