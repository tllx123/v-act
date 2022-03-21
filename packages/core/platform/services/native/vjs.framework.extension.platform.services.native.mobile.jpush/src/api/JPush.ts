let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const setAlias = function (param: any) {
  instance && instance.setAlias(param)
}

const setBadge = function (param: any) {
  instance && instance.setBadge(param)
}

const getBadge = function (callback: any) {
  instance && instance.getBadge(callback)
}

const init = function () {
  instance.init()
}

const setDebugMode = function (isDebug: boolean) {
  instance.setDebugMode(isDebug)
}

const stopPush = function () {
  instance.stopPush()
}

const resumePush = function () {
  instance.resumePush()
}

const isPushStopped = function (callback: any) {
  instance.isPushStopped(callback)
}

const getRegistrationID = function (callback: any) {
  instance.getRegistrationID(callback)
}

const registerOpenNotification = function (callback: any) {
  instance.registerOpenNotification(callback)
}

export {
  getBadge,
  getRegistrationID,
  init,
  isPushStopped,
  putInstance,
  registerOpenNotification,
  resumePush,
  setAlias,
  setBadge,
  setDebugMode,
  stopPush
}
