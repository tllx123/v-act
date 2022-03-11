import * as PayService from '@v-act/vjs.framework.extension.platform.services.native.mobile.Pay'

export function initModule(sb: any) {
  PayService.putInstance(exports)
}

/**
 * 初始化cordova的支付插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Pingpp = navigator.Pingpp
}

const pay = function (
  config: Record<string, any>,
  successCallback: Function,
  failCallback: Function
) {
  //@ts-ignore
  navigator.Pingpp.pay(config, successCallback, failCallback)
}

export { pay }
