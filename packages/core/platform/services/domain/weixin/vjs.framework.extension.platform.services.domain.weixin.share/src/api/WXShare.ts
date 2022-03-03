const onMenuShareTimeline = function (config) {
  if (window.VJSBridge && window.VJSBridge.plugins.weixin.Share) {
    window.VJSBridge.plugins.weixin.Share.onMenuShareTimeline(config)
  } else {
    throw new Error(
      '不存在微信分享插件对象：window.VJSBridge.plugins.wexin.Share'
    )
  }
}

const onMenuShareAppMessage = function (config) {
  if (window.VJSBridge && window.VJSBridge.plugins.weixin.Share) {
    window.VJSBridge.plugins.weixin.Share.onMenuShareAppMessage(config)
  } else {
    throw new Error(
      '不存在微信分享插件对象：window.VJSBridge.plugins.wexin.Share'
    )
  }
}

export { onMenuShareTimeline, onMenuShareAppMessage }
