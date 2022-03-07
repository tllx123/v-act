import * as formulaUtil from 'module'
import * as viewModel from 'module'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

/**
 * 获取表达式的值
 */
let getExpressionValue = function (widgetCode, propertyKey) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let defaultValueScript = widgetContext.get(widgetCode, propertyKey)
  return formulaUtil.evalExpression(defaultValueScript)
}

/**
 * 获取真实的值
 */
let getValueFromValueAccessor = function (valueAccessor) {
  let valueData = valueAccessor
  if (!valueData) {
    throw new Error('待更新值数据结构不能为空')
  }
  let valueObj = valueData.getValue()
  if (!valueObj) {
    return
  }
  return valueObj['values']
}

/**
 * 获取单值类的默认值
 */
let getSingleColumnWidgetDefaultValue = function (widgetCode) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let defaultValueScript = widgetContext.get(widgetCode, 'DefaultValue')
  if (defaultValueScript != undefined && defaultValueScript != null) {
    let value = formulaUtil.evalExpression(defaultValueScript)
  } else {
    let value = null
  }

  if (value == null) {
    return null
  } else {
    let columnName = widgetContext.get(widgetCode, 'ColumnName')
    let reMap = {}
    reMap[columnName] = value
    return reMap
  }
}

/**
 * 处理颜色
 */
let handleColor = function (colorStr) {
  if (colorStr.indexOf(',') == -1) {
    return colorStr
  } else {
    let rgbs = colorStr.split(',')
    // 0, 255, 255, 255 四位前面为0的代表为透明色
    if (rgbs.length == 4 && rgbs[0] == '0') {
      return 'transparent'
    } else {
      return 'rgb(' + rgbs + ')'
    }
  }
}

/**
 * 设置控件的值
 */
let setValue = function (widgetCode, value) {
  setSingleRecordMultiValue(widgetCode, 'ColumnName', value)
}

/**
 * 设置单行多值控件的值
 * @widgetId 控件编码
 * @refieldKey 控件字段属性名 如:IDColumnName
 * @propertyValue 属性值
 */
let setSingleRecordMultiValue = function (widgetCode, refieldKey, value) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let refield = widgetContext.get(widgetCode, refieldKey)
  let dateValue = {}
  dateValue[refield] = value
  viewModel.getDataModule().setSingleRecordMultiValue(widgetCode, dateValue)
}

/**
 * 设置控件的值
 */
let getValue = function (widgetCode) {
  return viewModel.getDataModule().getSingleValue(widgetCode)
}

/**
 * 设置控件的值
 */
let getSingleRecordMultiValue = function (widgetCode) {
  return viewModel.getDataModule().getSingleRecordMultiValue(widgetCode)
}

/**
 * 获取refield，只能获取单行单值的类型的
 */
let getRefieldByWidgetCode = function (widgetCode) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  return widgetContext.get(widgetCode, 'ColumnName')
}

export {
  getExpressionValue,
  getRefieldByWidgetCode,
  getSingleColumnWidgetDefaultValue,
  getSingleRecordMultiValue,
  getValue,
  getValueFromValueAccessor,
  handleColor,
  setSingleRecordMultiValue,
  setValue
}
