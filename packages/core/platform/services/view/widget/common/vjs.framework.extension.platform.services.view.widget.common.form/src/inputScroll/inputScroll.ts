import * as $ from '@v-act/vjs.framework.extension.vendor.jquery'
const vds = { $ }
export function initModule(sb) {}

/**
 * 设置输入框类控件在Android下，聚焦 || 输入 不能自动滚动到合适位置
 *
 * @param  target
 * 		Sring     id , class   HTML元素
 * 		JQ
 *
 */
let scroll = function (target: any) {
  target = $(target)
  if (!target || !target.size()) {
    console.warn('将要发生无效事件')
    return
  }
  let ipt = ($(target)[0].nodeName || '').toLowerCase()
  let reg = /input|textarea|button/g
  if (!reg.test(ipt)) {
    console.warn('然而事件触发者并不是表单类元素')
    return
  }
  let isAndroid =
    navigator.userAgent.indexOf('Android') > -1 ||
    navigator.userAgent.indexOf('Adr') > -1 //android终端
  if (isAndroid) {
    target.on('focus input', function (ev) {
      let e = ev || window.event
      let tar = e.target
      clearInterval(tar.timer)
      tar.timer = setInterval(function () {
        var clientRect = tar.getBoundingClientRect()
        var winH = window.innerHeight
        if (clientRect.bottom >= winH) {
          var y = window.scrollY
          if (tar.scrollIntoViewIfNeeded) {
            tar.scrollIntoViewIfNeeded(true)
          }
        } else {
          clearInterval(tar.timer)
        }
      }, 200)
    })
    target.on('blur', function (ev) {
      let e = ev || window.event
      let tar = e.target
      clearInterval(tar.timer)
    })
  }
}
export { scroll }
