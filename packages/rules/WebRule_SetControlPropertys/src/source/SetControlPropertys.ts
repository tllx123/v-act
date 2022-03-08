import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DialogUtil as rendererUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sBox) {}

//定义常量
let READONLY = 'readonly'
let VISIBLE = 'visible'
let VALUE = 'value'
let JAPANESETITLE = 'japanesetitle'
let COMPLEXCHINESETITLE = 'complexchinesetitle'
let ENGLISHTITLE = 'englishtitle'
let SIMPLECHINESETITLE = 'simplechinesetitle'
let ENABLED = 'enabled'
let LABELFORECOLOR = 'labelforecolor'
let LABELBACKCOLOR = 'labelbackcolor'
let VALUEFORECOLOR = 'valueforecolor'
let VALUEBACKCOLOR = 'valuebackcolor'
let MAXCHILDNUM = 'maxchildnum'
let VALUEFORECOLOR = 'valueforecolor'
let VALUEBACKCOLOR = 'valuebackcolor'

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let conditions = inParamsObj['condition']
  if (!conditions || conditions.length < 1) return
  for (let tmp = 0; tmp < conditions.length; tmp++) {
    let condition = conditions[tmp]
    let formula = condition['name'] //条件
    let isFormula = false
    try {
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      isFormula = formulaUtil.execute({
        expression: formula,
        context: context
      })
    } catch (e) {
      rendererUtil.infoDialog(
        '表达式' + formula + '不正确，请检查！',
        null,
        true
      )
      return false
    }
    let items = condition['items']
    if (!items || items.length < 1) break
    if (isFormula === true) {
      for (let index = 0; index < items.length; index++) {
        let item = items[index]

        let controlID = item['controlCode'] //控件ID
        let propertyCode = item['propertyCode'] // 要更改的属性ID
        let values = item['values'] //期望值
        let valueType = item['valuetype'] //期望值类型
        //根据属性ID得到属性名PropertyCode
        if (!stringUtil.isEmpty(values)) {
          values = getValues(values, valueType, ruleContext)
        }
        //dengb:zhengll说这段逻辑无用应该干掉
        /*if (propertyCode == ENABLED) {
                    var widgetType = viewContext.getWidgetExtTypeFromContext(controlID);
                    var destWidgetType = widgetType ? widgetType : viewContext.getWidgetTypeFromContext(controlID);
                    if (destWidgetType == "Column") {
                        rendererUtil.infoDialog("表格的列不支持设置使能属性,请检查", true);
                        return false;
                    }else if(destWidgetType == "TreeColumn"){
                        rendererUtil.infoDialog("树表的列不支持设置使能属性,请检查", true);
                        return false;
                    }else if(destWidgetType == "BizCodeTreeColumn"){
                        rendererUtil.infoDialog("编码树表的列不支持设置使能属性,请检查", true);
                        return false;
                    }
                }*/

        setProperty(controlID, propertyCode, values)
      }
    }
  }
  return true
}

/**
 *	TODO:此方法调整为统一调用插件机制的action方法，只保留默认
 */
let setProperty = function (controlID, propertyCode, values) {
  try {
    widgetProperty.set(controlID, propertyCode, values)
  } catch (e) {
    let widgetType = widgetContext.getType(controlID)
    let widgetCode = controlID
    let chineseTitleName = widgetProperty.get(controlID, 'SimpleChineseTitle')
    log.error(
      '[SetControlPropertys.setProperty](' +
        widgetType +
        ')' +
        widgetCode +
        '控件属性' +
        propertyCode +
        '设置出错。'
    )
    let alertMsg =
      '控件<' + chineseTitleName + '>属性[' + propertyCode + ']赋值出错。'
    rendererUtil.infoDialog(alertMsg, null, true)
    return false
  }
}

/**
 * 获得控件的属性值
 */
let getValues = function (controlValues, controlValueType, ruleContext) {
  if (controlValueType == '1') {
    try {
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      let cV = formulaUtil.execute({
        expression: controlValues,
        context: context
      })
    } catch (e) {
      rendererUtil.infoDialog(
        '执行条件表达式出错，表达式为：' + controlValues,
        null,
        true
      )
      return false
    }
    controlValues = cV
  }
  return controlValues
}

export { main }
