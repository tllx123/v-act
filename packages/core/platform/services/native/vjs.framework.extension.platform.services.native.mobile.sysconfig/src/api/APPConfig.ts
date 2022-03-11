import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let instance
let VJSNAME = 'VJS[APPConfig]：'

export function initModule(sb) {}

const putInstance = function (ins) {
  instance = ins
}

const isAwakeByURL = function (callback) {
  if (instance && instance.isAwakeByURL) {
    instance.isAwakeByURL(callback)
  } else {
    log.log(VJSNAME + '没有isAwakeByURL的PC端方法实现')
  }
}

const getAwakeParams = function (callback) {
  if (instance && instance.getAwakeParams) {
    instance.getAwakeParams(callback)
  } else {
    log.log(VJSNAME + '没有getAwakeParams的PC端方法实现')
  }
}

const clear = function () {
  if (instance && instance.clear) {
    instance.clear()
  } else {
    log.log(VJSNAME + '没有clear的PC端方法实现')
  }
}

const pasteBoard = function (content) {
  if (instance && instance.pasteBoard) {
    instance.pasteBoard(content)
  } else {
    log.log(VJSNAME + '没有pasteBoard的PC端方法实现')
  }
}

const call = function (phoneNum) {
  if (instance && instance.call) {
    instance.call(phoneNum)
  } else {
    log.log(VJSNAME + '没有call的PC端方法实现')
  }
}

const setPreferences = function (param) {
  if (instance && instance.setPreferences) {
    instance.setPreferences(param)
  } else {
    log.log(VJSNAME + '没有setPreferences的PC端方法实现')
  }
}

const getPreferences = function (successCallback, param) {
  if (instance && instance.getPreferences) {
    instance.getPreferences(successCallback, param)
  } else {
    log.log(VJSNAME + '没有getPreferences的PC端方法实现')
  }
}

export {
  call,
  clear,
  getAwakeParams,
  getPreferences,
  isAwakeByURL,
  pasteBoard,
  putInstance,
  setPreferences
}
