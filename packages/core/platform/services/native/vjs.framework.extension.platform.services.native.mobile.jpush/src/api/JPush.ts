let instance

const putInstance = function (ins) {
  instance = ins
}

const setAlias = function (param) {
  instance && instance.setAlias(param)
}

const setBadge = function (param) {
  instance && instance.setBadge(param)
}

const getBadge = function (callback) {
  instance && instance.getBadge(callback)
}

const init = function () {
  instance.init()
}

const setDebugMode = function (isDebug) {
  instance.setDebugMode(isDebug)
}

const stopPush = function () {
  instance.stopPush()
}

const resumePush = function () {
  instance.resumePush()
}

const isPushStopped = function (callback) {
  instance.isPushStopped(callback)
}

const getRegistrationID = function (callback) {
  instance.getRegistrationID(callback)
}

const registerOpenNotification = function (callback) {
  instance.registerOpenNotification(callback)
}

export {
  putInstance,
  setAlias,
  setBadge,
  getBadge,
  init,
  setDebugMode,
  stopPush,
  resumePush,
  isPushStopped,
  getRegistrationID,
  registerOpenNotification
}
