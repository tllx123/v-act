import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let retSetItems = inParamsObj['componentControlCodes']
  if (!retSetItems || retSetItems.length < 1) return
  for (let index = 0; index < retSetItems.length; index++) {
    let widgetID = retSetItems[index]['componentControlCode']

    if (!widgetID) {
      continue
    }

    if (!widgetContext.isWidgetExist(widgetID)) {
      throw new Error(
        '[ResetSelectedControlValue.main]规则配置信息中控件(componentControlID)不存在,请检开发系统查组件界面中是否移除了此控件。widgetId = ' +
          widgetID
      )
    }

    /**
     * 2015-04-25 liangchaohui：
     * 通过与zhengll沟通，遍历执行子控件函数的逻辑不应该在本规则实现
     * 本规则只实现：调用控件的cleanSelectedControlValue接口
     * 遍历调用子控件的cleanSelectedControlValue应当在容器控件内实现
     */
    if (widgetAction.isWidgetActionExist(widgetID, 'cleanSelectedControlValue'))
      widgetAction.executeWidgetAction(widgetID, 'cleanSelectedControlValue')
    else
      throw new Error(
        '[ResetSelectedControlValue.main]规则配置信息中控件不支持清空控件数值。widgetId = ' +
          widgetID
      )

    //			var widgetType = viewContext.getWidgetTypeFromContext(widgetID);
    //			//如果是容器
    //			if(panelMap[widgetType]){
    //				//根据widgetID获得容器内所有的组件
    //				var panelItems = getPanelItems(widgetID);
    //				for(var j = 0; j < panelItems.length; j++){
    //					var widgetItemID=panelItems[j]
    //					var widgetItemType = viewContext.getWidgetTypeFromContext(widgetItemID);
    //					if(!panelMap[widgetItemType]){
    //						actionHandler.executeWidgetAction(widgetItemID,"cleanSelectedControlValue");
    //					}
    //				}
    //			}else {
    //				actionHandler.executeWidgetAction(widgetID,"cleanSelectedControlValue");
    //			}
  }
}

export { main }
