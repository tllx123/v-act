let instance: any

const putInstance = function (ins: any) {
  instance = ins
}

const bluetoothPrint = function (
  successCallback: any,
  errorCallback: any,
  params: any
) {
  instance.bluetoothPrint(successCallback, errorCallback, params)
}

export { bluetoothPrint, putInstance }
