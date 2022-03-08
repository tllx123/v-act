import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

export function initModule(sb) {}

/**
 * 获取固定布局下控件布局的位置
 *
 * @param {String} widgetCode 控件编号
 *
 */
let setAnimationCss = function (target, Animation) {
  if (Animation == 'null') {
    return
  }
  if (Animation['Effect'] == 'FadeInUp') {
    target.addClass('animated fadeInUp')
  }
  if (Animation['Effect'] == 'FadeIn') {
    target.addClass('animated fadeIn')
    target.css({
      'animation-duration': '2s',
      '-webkit-animation-duration': '2s'
    })
  }
  if (Animation['Effect'] != 'None') {
    let delayTime = Animation['Delay'] + 'ms'
    target.css({
      'animationDelay': delayTime,
      '-webkit-animation-delay': delayTime
    })
  }
}

/**
 * 封装控件事件。
 *
 * @param {String} widgetCode 控件编号
 * @param {String} EventType 事件类型
 * @param {String} millisecond 间隔触发事件
 * @param {String} IsPrevent 是否冒泡
 *
 *
 */
let PreventDefault = function (widgetCode, EventType, millisecond, IsPrevent) {
  if (typeof millisecond == 'boolean') {
    IsPrevent = millisecond
    millisecond = null
  }
  let IsHasEvent = widgetContext.get(widgetCode, EventType)
  if (IsHasEvent) {
    eventManager.fireEvent(widgetCode, EventType, millisecond)()
  }
  if (IsPrevent) {
    let e = event || window.event
    event.stopPropagation()
  }
}
export { setAnimationCss }
