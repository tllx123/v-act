let instance

const putInstance = function (ins) {
  instance = ins
}

function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

const scanQRCode = function (successCallback) {
  if (instance) {
    instance.scanQRCode(successCallback)
  } else {
    if (isWeiXinFunc()) {
      //调用微信js sdk 扫描二维码接口
      wx.scanQRCode({
        desc: '',
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          let rs = res.resultStr
          if (typeof successCallback == 'function') {
            successCallback(rs)
          }
          // 回调
        },
        error: function (res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
        }
      })
    } else {
      window.console.log('二维码扫描接口不支持PC端，请在移动端使用')
    }
  }
}

export { putInstance, scanQRCode }
