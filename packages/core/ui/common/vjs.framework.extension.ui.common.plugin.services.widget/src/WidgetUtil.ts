import * as actionHandler from 'module'
import * as rendererUtil from 'module'

let sandbox

export function initModule(sb:any) {
  sandbox = sb
}

/**
 * 执行子控件函数
 *
 * @widgetId 控件id
 * @functionName 执行函数名，可传入文本或文本数组
 */
let executeSubWidgetsAction = function (widgetId:string, functionName:string) {
  let subWidgetIds = rendererUtil.getChildWidgetIds(widgetId, false)
  for (let i = 0; i < subWidgetIds.length; i++) {
    let subWidgetId = subWidgetIds[i]

    if (actionHandler.isExistWidgetAction(subWidgetId, functionName)) {
      let params = []
      if (arguments.length > 2) {
        for (let j = 2, len = arguments.length; j < len; j++) {
          params.push(arguments[j])
        }
      }
      actionHandler.executeWidgetAction(subWidgetId, functionName, params)
    }
  }
}

export { executeSubWidgetsAction }
