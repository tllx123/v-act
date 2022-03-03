/**
 * 初始化cordova的语音识别插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Speech = window.navigator.speech
}
