//@ts-nocheck
let cb = function (res) {
  debugger
  let obj = $.parseJSON(res)
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: obj.corpid, // 必填，企业号的唯一标识
    timestamp: obj.timestamp, // 必填，生成签名的时间戳
    nonceStr: obj.nonceStr, // 必填，生成签名的随机串
    signature: obj.signature, // 必填，签名，见附录1
    jsApiList: [
      'getLocation',
      'openLocation',
      'chooseImage',
      'uploadImage',
      'downloadImage',
      'scanQRCode',
      'closeWindow',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'openBluetoothAdapter',
      'closeBluetoothAdapter',
      'getBluetoothAdapterState',
      'onBluetoothAdapterStateChange',
      'startBluetoothDevicesDiscovery',
      'stopBluetoothDevicesDiscovery',
      'getBluetoothDevices',
      'onBluetoothDeviceFound',
      'getConnectedBluetoothDevices',
      'createBLEConnection',
      'closeBLEConnection',
      'onBLEConnectionStateChange',
      'getBLEDeviceServices',
      'getBLEDeviceCharacteristics',
      'readBLECharacteristicValue',
      'writeBLECharacteristicValue',
      'notifyBLECharacteristicValueChange',
      'onBLECharacteristicValueChange'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  })

  wx.error(function (res) {
    let errorMsg = ''
    if (res) {
      errorMsg = res.errMsg ? '错误信息：' + res.errMsg : ''
    }
    alert('请确认服务端已开启微信js-sdk服务!' + errorMsg)
  })
}
let currUrl = location.href.split('#')[0]
let config = { callBack: cb, isAsync: true }
let ajaxUrl =
  location.href.substring(0, location.href.indexOf('module-operation')) +
  '/module-operation!executeOperation?operation=WexinSignature'
let ajaxData = {
  curr_url: currUrl
}

let sendRequest = function (url, params, isAsync, callBack) {
  jQuery.ajax({
    type: 'POST',
    url: url,
    async: isAsync,
    data: params,
    error: function (xhr, textStatus, errorThrown) {
      alert('网络请求失败，请检查网络！')
    },
    success: function (xhr, status) {
      if (callBack) {
        callBack(xhr, status)
      }
    }
  })
}

function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

if (isWeiXinFunc()) {
  sendRequest(ajaxUrl, ajaxData, true, cb)
}
