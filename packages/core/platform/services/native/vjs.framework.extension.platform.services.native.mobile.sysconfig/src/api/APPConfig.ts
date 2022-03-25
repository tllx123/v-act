import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let instance: any
let VJSNAME = 'VJS[APPConfig]：'

// export function initModule(sb) {}

const putInstance = function (ins: unknown) {
  instance = ins
}

const isAwakeByURL = function (callback: unknown) {
  if (instance && instance.isAwakeByURL) {
    instance.isAwakeByURL(callback)
  } else {
    log.log(VJSNAME + '没有isAwakeByURL的PC端方法实现')
  }
}

const getAwakeParams = function (callback: unknown) {
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

const pasteBoard = function (content: unknown) {
  if (instance && instance.pasteBoard) {
    instance.pasteBoard(content)
  } else {
    log.log(VJSNAME + '没有pasteBoard的PC端方法实现')
  }
}

const call = function (phoneNum: number) {
  if (instance && instance.call) {
    instance.call(phoneNum)
  } else {
    log.log(VJSNAME + '没有call的PC端方法实现')
  }
}

const setPreferences = function (param: unknown) {
  if (instance && instance.setPreferences) {
    instance.setPreferences(param)
  } else {
    log.log(VJSNAME + '没有setPreferences的PC端方法实现')
  }
}

const getPreferences = function (successCallback: unknown, param: unknown) {
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
