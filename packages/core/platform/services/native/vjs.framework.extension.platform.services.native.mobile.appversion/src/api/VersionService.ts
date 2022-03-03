let instance

const putInstance = function (ins) {
  instance = ins
}

const getVersionNumber = function (callback) {
  if (instance) {
    instance.getVersionNumber(callback)
  } else {
    alert('提示：获取App版本号服务仅支持移动App内使用，其他终端返回0')
    callback(0)
  }
}

const getAppName = function (callback) {
  instance.getAppName(callback)
}

export { putInstance, getVersionNumber, getAppName }
