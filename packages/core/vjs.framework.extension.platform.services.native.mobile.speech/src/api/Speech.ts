const startListening = function (callback) {
  if (window.VJSBridge) {
    //移动端
    if (typeof callback == 'function') {
      window.VJSBridge.plugins.vplatform.Speech.startListening(
        { language: 'zh_cn', accent: 'mandarin' },
        callback
      )
    }
  }
}

const stopListening = function () {
  if (window.VJSBridge) {
    //移动端
    window.VJSBridge.plugins.vplatform.Speech.stopListening()
  }
}

const startSpeaking = function (text) {
  if (window.VJSBridge) {
    //移动端
    window.VJSBridge.plugins.vplatform.Speech.startSpeaking(text, {
      voice_name: 'xiaoyan'
    })
  }
}

const stopSpeaking = function (callback) {
  if (window.VJSBridge) {
    //移动端
    window.VJSBridge.plugins.vplatform.Speech.stopSpeaking()
  }
}

export { startListening, stopListening, startSpeaking, stopSpeaking }
