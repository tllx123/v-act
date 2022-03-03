let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let _setInputValue = function (widgetId, record) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  if (record) {
    let fieldName = _getRefieldByWidgetCode(widgetId)
    let globalCode = widgetContext.get(widgetId, 'GlobalCode')
    let value = record.get(fieldName)
    $('#' + globalCode).val(value)
  } else {
    _clearInputValue(widgetId)
  }
}

/**
 * 清除控件值
 */
let _clearInputValue = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let globalCode = widgetContext.get(widgetId, 'GlobalCode')
  $('#' + globalCode).val('')
}

let _setHtmlValue = function (widgetId, record) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  if (record) {
    let fieldName = _getRefieldByWidgetCode(widgetId)
    let globalCode = widgetContext.get(widgetId, 'GlobalCode')
    let value = record.get(fieldName)
    $('#' + globalCode).html(value)
  }
}

/**
 * 获取refield，只能获取单行单值的类型的
 */
let _getRefieldByWidgetCode = function (widgetCode) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  return widgetContext.get(widgetCode, 'ColumnName')
}

/**
 * 清除控件值
 */
let _clearHtmlValue = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let globalCode = widgetContext.get(widgetId, 'GlobalCode')
  $('#' + globalCode).html('')
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

let updateInput = function (widgetType, widgetId, valueAccessor) {
  let values = getValueFromValueAccessor(valueAccessor)
  let actionType = valueAccessor.getAction()
  let constModule = viewModel.getConstModule()

  switch (actionType) {
    case constModule.ACTION_CURRENT:
      _setInputValue(widgetId, values[0])
      break
    case constModule.ACTION_UPDATE:
      for (var i = 0, len = values.length; i < len; i++) {
        var record = values[i]
        if (record.isCurrent()) {
          _setInputValue(widgetId, values[0])
          break
        }
      }
      break
    case constModule.ACTION_LOAD:
      _setInputValue(widgetId, values[0])
      break
    case constModule.ACTION_DELETE:
      _clearInputValue(widgetId)
      break
  }
}

let updateHtml = function (widgetType, widgetId, valueAccessor) {
  let values = getValueFromValueAccessor(valueAccessor)
  let actionType = valueAccessor.getAction()
  let constModule = viewModel.getConstModule()

  switch (actionType) {
    case constModule.ACTION_CURRENT:
      _setHtmlValue(widgetId, values[0])
      break
    case constModule.ACTION_UPDATE:
      for (var i = 0, len = values.length; i < len; i++) {
        var record = values[i]
        if (record.isCurrent()) {
          _setHtmlValue(widgetId, values[0])
          break
        }
      }
      break
    case constModule.ACTION_LOAD:
      _setHtmlValue(widgetId, values[0])
      break
    case constModule.ACTION_DELETE:
      _clearHtmlValue(widgetId)
      break
  }
}

/**
 * 注册DB更新事件
 */
let initInput = function (widgetCode) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let eventManager = sandbox.getService(
    'vjs.framework.extension.ui.plugin.manager.eventManager'
  )
  let globalCode = widgetContext.get(widgetCode, 'GlobalCode')

  //注册一个事件
  let tempCode = widgetCode
  eventManager.addEventHandler(widgetCode, 'DBUpdate', function () {
    let value = $('#' + globalCode).val()
    value = value == '' ? null : value
    viewModel.getDataModule().setSingleValue(tempCode, value)
  })
}

export { getValueFromValueAccessor, updateInput, updateHtml, initInput }
