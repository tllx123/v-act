import * as iptlisten from './inputListen/inputListen'
import * as iptReadOnly from './inputReadOnly/inputReadOnly'
import * as iptScroll from './inputScroll/inputScroll'

export function initModule(sb) {}

const inputlisten = function (el, callBack) {
  el = $(el)
  el.each(function () {
    iptlisten.inputListen(this, callBack)
  })
}

const inputScroll = function (el) {
  iptScroll.scroll(el)
}

const readOnlyOn = function (obj, scopeId, focus, blur) {
  iptReadOnly.readOnlyOn.call(obj, scopeId, focus, blur)
}

const readOnlyOff = function (obj) {
  iptReadOnly.readOnlyOff.call(obj)
}

const readOnlyToggle = function (obj, scopeId, focus, blur, state) {
  iptReadOnly.readOnlyToggle.call(obj, scopeId, focus, blur, state)
}

export { inputlisten, inputScroll, readOnlyOff, readOnlyOn, readOnlyToggle }
