let instance

const putInstance = function (ins) {
  instance = ins
}

const bluetoothPrint = function (successCallback, errorCallback, params) {
  instance.bluetoothPrint(successCallback, errorCallback, params)
}

export { putInstance, bluetoothPrint }
