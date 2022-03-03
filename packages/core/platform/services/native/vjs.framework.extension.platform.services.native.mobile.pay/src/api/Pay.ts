let instance

const putInstance = function (ins) {
  instance = ins
}

const pay = function (config, successCallback, failCallback) {
  instance.pay(config, successCallback, failCallback)
}

const getPayInfo = function (chargeId, successCallback, errorCallback) {
  if (instance.getPayInfo) {
    instance.getPayInfo(chargeId, successCallback, errorCallback)
  } else {
    errorCallback('平台不支持getPayInfo函数')
  }
}

export { putInstance, pay, getPayInfo }
