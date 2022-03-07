export function initModule(sb) {
  let PayService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Pay'
  )
  PayService.putInstance(exports)
}

/**
 * 初始化cordova的支付插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Pingpp = navigator.Pingpp
}

const pay = function (config, successCallback, failCallback) {
  navigator.Pingpp.pay(config, successCallback, failCallback)
}

export { pay }
