import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

let CONTROLTYPE_READONLY = '1' //控制类型：只读
let CONTROLTYPE_ENABLE = '2' //控制类型：使能
let CONTROLTYPE_VISIBLE = '3' //控制类型：显示

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let mapping = inParamsObj['mapping'] // 控件数组
  let type = inParamsObj['type'] // 控制类型：1为只读，2为使能，3为显示
  let func = funcFactory(type)
  if (mapping != null && mapping.length > 0) {
    for (let i = 0; i < mapping.length; i++) {
      let widgetId = mapping[i]['componentControlCode']
      let control = mapping[i]['control']
      func(widgetId, control)
    }
  }
}

/**
 *	方法工厂
 *	@param type 根据控制类型获取对应方法
 */
let funcFactory = function (type) {
  switch (type) {
    case CONTROLTYPE_READONLY:
      return setReadonlyOrWrite
      break
    case CONTROLTYPE_ENABLE:
      return setDisableOrEnable
      break
    case CONTROLTYPE_VISIBLE:
      return setShowOrHide
      break
    default:
      return setDisableOrEnable
      break
  }
}

/**
 *	设置控件的只读或可写
 *	@param	destWidgetId 控件id
 *  @param  readonly 是否只读
 */
let setReadonlyOrWrite = function (destWidgetId, readonly) {
  let isReadOnly = readonly == true || readonly.toLowerCase() == 'true'
  if (isReadOnly) {
    widgetProperty.set(destWidgetId, 'ReadOnly', true)
  } else {
    widgetProperty.set(destWidgetId, 'ReadOnly', false)
  }
}

/**
 *	设置控件的使能或失效
 *	@param	destWidgetId 控件id
 *  @param  enable 是否使能
 */
let setDisableOrEnable = function (destWidgetId, enable) {
  let isEnable = enable == true || enable.toLowerCase() == 'true'
  if (isEnable) {
    widgetProperty.set(destWidgetId, 'Enabled', true)
  } else {
    widgetProperty.set(destWidgetId, 'Enabled', false)
  }
}

/**
 *	设置控件的显示或隐藏
 *	@param	destWidgetId 控件id
 *  @param  show 是否显示
 */
let setShowOrHide = function (destWidgetId, show) {
  let isShow = show == true || show.toLowerCase() == 'true'
  if (isShow) {
    widgetProperty.set(destWidgetId, 'Visible', true)
  } else {
    widgetProperty.set(destWidgetId, 'Visible', false)
  }
}

export { main }
