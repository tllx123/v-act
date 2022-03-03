import { Device as deviceUtil } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
let undefined
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //        var type=deviceUtil.getDevicePlatform();

  let ua = navigator.userAgent.toLowerCase()
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
