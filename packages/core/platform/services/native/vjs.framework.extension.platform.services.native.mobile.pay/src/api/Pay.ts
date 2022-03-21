let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const pay = function (config: any, successCallback: any, failCallback: any) {
  instance.pay(config, successCallback, failCallback)
}

const getPayInfo = function (
  chargeId: string,
  successCallback: any,
  errorCallback: any
) {
  if (instance.getPayInfo) {
    instance.getPayInfo(chargeId, successCallback, errorCallback)
  } else {
    errorCallback('平台不支持getPayInfo函数')
  }
}

export { getPayInfo, pay, putInstance }
