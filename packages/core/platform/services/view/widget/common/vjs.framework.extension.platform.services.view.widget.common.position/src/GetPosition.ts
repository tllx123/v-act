import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

/*
	var arrayUtil;
	var windowVmManager;
	var datasourceManager;
	var widgetAction;
	var widgetContext;
	var CurrentRecordObserver;
	var DatasourceObserver;
	var datasourceObserverManager;
	var datasourceUtil;
*/

export function initModule(sb) {}

/**
 * 获取固定布局下控件布局的位置
 *
 * @param {String} widgetCode 控件编号
 *
 */
let getPosition = function (widgetCode: string, IsAutoHeight: any) {
  let info = widgetRenderer.executeComponentRenderAction(
    'getParentContainerInfo'
  ) // 获取窗体宽度

  let clientWidth = info.Width || 375 //${_ParentWidget.Width!''} //document.body.clientWidth;
  let RootSize = clientWidth / 10 //37.5//parseInt(document.documentElement.style.fontSize);
  let zIndex = widgetContext.get(widgetCode, 'ZIndex')
  let Height = widgetContext.get(widgetCode, 'Height')
  let HeightPercent = Height + 'px;'

  let Top = widgetContext.get(widgetCode, 'Top')
  let TopPosition = Top + 'px;' //Top*10/clientWidth+"rem;";

  let Bottom = widgetContext.get(widgetCode, 'Bottom')
  let BottomPosition = Bottom + 'px;' //Top*10/clientWidth+"rem;";

  let width = widgetContext.get(widgetCode, 'Width')
  let widthPercent = widgetContext.get(widgetCode, 'PercentWidth')
  let widthPer = widthPercent ? parseFloat(widthPercent.replace(/%$/g, '')) : 0
  let ParentWidth = (width * 100) / widthPer || 80

  let left = widgetContext.get(widgetCode, 'Left')
  let LeftPosition = (left * 100) / ParentWidth + '%;'

  let Right = widgetContext.get(widgetCode, 'Right')
  let RightPosition = (Right * 100) / ParentWidth + '%;' //Top*10/clientWidth+"rem;";

  let PositionAnchor = 'position:absolute;'

  let anchor = widgetContext.get(widgetCode, 'Anchor')
  if (anchor) {
    if (!(anchor.indexOf('Left') > -1 && anchor.indexOf('Right') > -1)) {
      PositionAnchor += 'width:' + widthPercent + ';'
    }
    if (IsAutoHeight == 'false') {
      if (!(anchor.indexOf('Top') > -1 && anchor.indexOf('Bootm') > -1)) {
        PositionAnchor += 'height:' + HeightPercent
      }
    }

    anchor = anchor.split(',')
    toTrim(anchor)
  } else {
    return null
  }

  for (let i = 0; i < anchor.length; i++) {
    switch (anchor[i].trim()) {
      case 'Top':
        PositionAnchor += 'top:' + TopPosition
        break
      case 'Left':
        PositionAnchor += 'left:' + LeftPosition
        break
      case 'Bottom':
        PositionAnchor += 'bottom:' + BottomPosition
        break
      case 'Right':
        PositionAnchor += 'right:' + RightPosition
        break
    }
  }
  if (zIndex) {
    PositionAnchor += 'z-index:' + zIndex + ';'
  }
  return PositionAnchor
}
let toTrim = function (arr: any) {
  for (let i = 0; i < arr.lenght; i++) {
    arr[i] = arr[i].trim()
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
let PreventDefault = function (
  widgetCode: string,
  EventType: string,
  millisecond: any,
  IsPrevent: any
) {
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
export { getPosition, PreventDefault }
