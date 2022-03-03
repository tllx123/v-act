import { ZIndex as service } from '@v-act/vjs.framework.extension.platform.services.view.ui'
//默认值调整了，sc的JGwindow需要调整，
//在窗体关闭时，会触发eventHandler的hideClickMask，导致所有sc的窗体bringToFront,所有bs窗体在sc之后
//改造点，判断超过zindex默认值时，取消设置zindex
let undefined

exports.initModule = function (sb) {}

const getZIndex = function () {
  return service.getZIndex()
}

const getFrontZIndex = function () {
  return service.getFrontZIndex()
}

const setZIndex = function (_zIndex) {
  service.setZIndex(_zIndex)
}

export {
  Show,
  Hide,
  fireEvent,
  addEventHandler,
  fireDynamicWidgetEvent,
  removeAllEventHandler,
  get,
  getAll,
  putAll,
  put,
  set,
  get,
  getInit,
  getAction,
  getZIndex,
  getFrontZIndex,
  setZIndex
}
