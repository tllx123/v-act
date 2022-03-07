import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {}

/**
 * 设置输入框类控件在只读下
 * 		ios 不触发键盘弹起事件
 * 		聚焦事件 和失焦事件 默认
 *
 * @param
 * 		focus  聚焦事件
 * 		blur   失焦事件
 * 		state : 0 readOnlyOff
 * 				1 readOnlyOn
 * $().readOnly(focus,blur);
 */
let readOnlyOn = function (scopeId, focus, blur) {
  if (!this[0]) {
    return
  }

  !this[0].readOnlyEvent &&
    (this[0].readOnlyEvent = function (ev) {
      ScopeManager.openScope(scopeId)
      focus && focus()
      blur && blur()
      ev.preventDefault()
      ScopeManager.closeScope()
    })
  !this[0].readOnlyfocus &&
    (this[0].readOnlyfocus = function () {
      $(this).blur()
    })
  this.on({
    focus: this[0].readOnlyfocus,
    touchend: this[0].readOnlyEvent
  })
  /* this[0].addEventListener('focus', this[0].readOnlyfocus, false);
   this[0].addEventListener('touchend', this[0].readOnlyEvent, false);*/
}
let readOnlyOff = function () {
  if (!this[0]) {
    return
  }
  try {
    this.off({
      focus: this[0].readOnlyfocus,
      touchend: this[0].readOnlyEvent
    })
  } catch (e) {
    console.warn('输入框只读错误')
  }
}
let readOnlyToggle = function (scopeId, focus, blur, state) {
  if (state) {
    readOnlyOn.call($(this), scopeId, focus, blur)
  } else {
    readOnlyOff.call($(this))
  }
}
export {
  inputlisten,
  inputListen,
  inputScroll,
  readOnlyOff,
  readOnlyOn,
  readOnlyToggle
}
