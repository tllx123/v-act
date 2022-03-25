const startListening = function (callback: Function) {
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    if (typeof callback == 'function') {
      //@ts-ignore
      window.VJSBridge.plugins.vplatform.Speech.startListening(
        { language: 'zh_cn', accent: 'mandarin' },
        callback
      )
    }
  }
}

const stopListening = function () {
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Speech.stopListening()
  }
}

const startSpeaking = function (text: string) {
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Speech.startSpeaking(text, {
      voice_name: 'xiaoyan'
    })
  }
}

const stopSpeaking = function (callback: Function) {
  //@ts-ignore
  if (window.VJSBridge) {
    //移动端
    //@ts-ignore
    window.VJSBridge.plugins.vplatform.Speech.stopSpeaking()
  }
}

export { startListening, startSpeaking, stopListening, stopSpeaking }
