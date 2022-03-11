/**
 * 初始化cordova的语音识别插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Speech = window.navigator.speech
}
