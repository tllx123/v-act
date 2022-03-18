import * as iptlisten from './inputListen/inputListen'
import * as iptReadOnly from './inputReadOnly/inputReadOnly'
import * as iptScroll from './inputScroll/inputScroll'
import * as $ from '@v-act/vjs.framework.extension.vendor.jquery'
const vds = { $ }

export function initModule(sb) {}

const inputlisten = function (el: any, callBack: any) {
  el = $(el)
  el.each(function () {
    iptlisten.inputListen(this, callBack)
  })
}

const inputScroll = function (el: any) {
  iptScroll.scroll(el)
}

const readOnlyOn = function (obj: any, scopeId: any, focus: any, blur: any) {
  iptReadOnly.readOnlyOn.call(obj, scopeId, focus, blur)
}

const readOnlyOff = function (obj: any) {
  iptReadOnly.readOnlyOff.call(obj)
}

const readOnlyToggle = function (
  obj: any,
  scopeId: any,
  focus: any,
  blur: any,
  state: any
) {
  iptReadOnly.readOnlyToggle.call(obj, scopeId, focus, blur, state)
}

export { inputlisten, inputScroll, readOnlyOff, readOnlyOn, readOnlyToggle }
