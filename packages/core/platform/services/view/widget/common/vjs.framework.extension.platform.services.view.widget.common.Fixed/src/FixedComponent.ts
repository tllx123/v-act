import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let widgetAction
let eventManager
let widgetRenderer
let undefined
let undefined
let undefined
let undefined
exports.initModule = function (sb) {}

const getBottomWidget = function () {
  let result = []
  result = result.concat(getWidgetByCustom(), getWidgetBylSpecial())
  return result
}

exports.isChange = true
/**
 * 当前窗体域下的直接子控件
 */
let getWidgetByCustom = function () {
  let result = []
  let scope = ScopeManager.getScope()
  //scope.getWindowCode();
  let childrenWidget = widgetRelation.get(scope.getWindowCode(), false)
  //widgetContext.getWidgetList()  // 获取当前域所有控件
  let isPanel = false
  for (let i = 0; i < childrenWidget.length; i++) {
    let widgetCode = childrenWidget[i]
    let type = widgetContext.get(widgetCode, 'type')

    let RegExpObject =
      /JGMTextBox|JGMLongTextBox|JGMFloatBox|JGMIntegerBox|JGMPasswordBox|JGMNumberSwtich|JGMDiv/
    if (RegExpObject.test(type)) continue

    let Anchor = widgetContext.get(widgetCode, 'Anchor')
    if (Anchor && Anchor.toLowerCase().indexOf('bottom') > -1) {
      result.push({
        code: widgetCode,
        globalCode: widgetContext.get(widgetCode, 'GlobalCode')
      })
    }
  }
  return result
}
/**
 *
 */
let getWidgetBylSpecial = function () {
  let result = []
  let childrenWidget = widgetContext.getWidgetList()
  for (let i = 0; i < childrenWidget.length; i++) {
    let widgetCode = childrenWidget[i]
    let type = widgetContext.get(widgetCode, 'type')
    switch (type) {
      case 'JGMToolStrip':
        var Anchor = widgetContext.get(widgetCode, 'DockType')
        var scope = ScopeManager.getScope()
        var globalCode = widgetContext.get(childrenWidget[i], 'GlobalCode')
        isBottom =
          Anchor &&
          Anchor.toLowerCase() == 'bottom' &&
          $('#' + globalCode).data('parentcode') == scope.getWindowCode()
            ? true
            : false
        if (isBottom) {
          result.push({
            code: widgetCode,
            globalCode: globalCode
          })
        }
        break
      case 'JGMDataListFoot':
        var globalCode = widgetContext.get(widgetCode, 'GlobalCode')
        parentGlobalCode = $('#' + globalCode).data('parentglobalcode')
        parentCode = $('#' + globalCode).data('parentcode')
        ShowFoot = widgetContext.get(parentCode, 'ShowFoot')
        if (ShowFoot) {
          result.push({
            code: widgetCode,
            globalCode: globalCode
          })
        }
        break
      case 'JGMNavWindowContainer':
      case 'JGMNavControlContainer':
        var DisplayPosition = (
          widgetContext.get(widgetCode, 'DisplayPosition') || ''
        ).toLowerCase()
        if (DisplayPosition == 'bottom') {
          result.push({
            code: widgetCode,
            globalCode: widgetContext.get(widgetCode, 'GlobalCode')
          })
        }
        break
    }
  }
  return result
}
export { getBottomWidget }
