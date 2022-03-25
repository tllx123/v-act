const hide = function () {
  //@ts-ignore
  if (window.VJSBridge && window.VJSBridge.plugins.vplatform.Splashscreen) {
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Splashscreen.hide()
  } else {
    throw new Error('PC端浏览器不支持闪屏功能，请在手机客户端尝试！')
  }
}

export { hide }
