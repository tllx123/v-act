import { ZIndex as service } from '@v-act/vjs.framework.extension.platform.services.view.ui'

//默认值调整了，sc的JGwindow需要调整，
//在窗体关闭时，会触发eventHandler的hideClickMask，导致所有sc的窗体bringToFront,所有bs窗体在sc之后
//改造点，判断超过zindex默认值时，取消设置zindex



const getZIndex = function () {
  return service.getZIndex()
}

const getFrontZIndex = function () {
  return service.getFrontZIndex()
}

const setZIndex = function (_zIndex:any) {
  service.setZIndex(_zIndex)
}

export {
  //addEventHandler,
 // fireDynamicWidgetEvent,
 // fireEvent,
 // get,
 // getAction,
 // getAll,
  getFrontZIndex,
 // getInit,
  getZIndex,
  //Hide,
 // put,
 // putAll,
 // removeAllEventHandler,
 // set,
  setZIndex,
 // Show
}
