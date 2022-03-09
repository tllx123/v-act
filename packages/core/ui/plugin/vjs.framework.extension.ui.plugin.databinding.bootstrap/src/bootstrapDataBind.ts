let viewContext = require('system/view/viewContext')
let viewModel = require('system/view/viewModel')
let logUtil = require('system/util/logUtil')
let sandBox
export function initModule(sBox) {
  sandBox = sBox
}

let bind = function () {
  let widgetList = viewContext.getWidgetList()
  let wrapObservable = function (key) {
    let elementObj = viewContext.getRuntimeWidgetObjFromContext(key)
    let widgetType = viewContext.getWidgetTypeFromContext(key)
    let observable = function (valueData) {
      _update(widgetType, elementObj, valueData, key)
    }
    return observable
  }
  for (let i = 0; i < widgetList.length; i++) {
    let elementObj = viewContext.getRuntimeWidgetObjFromContext(widgetList[i])
    let widgetType = viewContext.getWidgetTypeFromContext(widgetList[i])
    _init(widgetType, elementObj, null, widgetList[i])
    viewModel
      .getSysModule()
      .addObserver(widgetList[i], wrapObservable(widgetList[i]))
  }
}

/**
 *	handler对象生成器
 */
let _handlerCreator = function (widgetType) {
  return sandBox.getService(
    'vjs.framework.extension.ui.plugin.' +
      widgetType +
      '.data.' +
      widgetType +
      'Handler',
    { type: 'bootstrap' }
  )
}

/**
 *	执行相应控件的handler的绑定动作
 *	@param	action	绑定动作
 *	@param	element	控件元素
 *	@param	valueAccessor	控件值存储器
 *	@param	widgetType	控件类型
 */
let _action = function (action, widgetType, element, valueAccessor, code) {
  let handler = _handlerCreator(widgetType)
  //如果不存在处理对象,则用默认处理对象
  let existHandler = true
  if (!handler) {
    handler = sandBox.getService(
      'vjs.framework.extension.ui.plugin.JGComponent.data.DefaultHandler',
      { type: 'bootstrap' }
    )
    existHandler = false
  }

  try {
    return handler[action](widgetType, element, valueAccessor, code)
  } catch (e) {
    //捕捉异常信息
    if (existHandler) {
      logUtil.error(
        '数据绑定,执行控件类型为' +
          widgetType +
          '的handler的' +
          action +
          '方法时出错.' +
          e.message
      )
    } else {
      logUtil.error(
        '数据绑定,执行DefaultHandler的' +
          action +
          '方法时出错(控件类型:' +
          widgetType +
          ').' +
          e.message
      )
    }

    throw e
  }
}

/**
 *	执行相应控件的handler的init动作
 *	@param	element	控件元素
 *	@param	valueAccessor	控件值存储器
 *	@param	widgetType	控件类型
 */
let _init = function (widgetType, element, valueAccessor, code) {
  return _action('init', widgetType, element, valueAccessor, code)
}

/**
 *	执行相应控件的handler的update动作
 *	@param	element	控件元素
 *	@param	valueAccessor	控件值存储器
 *	@param	widgetType	控件类型
 */
let _update = function (widgetType, element, valueAccessor, code) {
  return _action('update', widgetType, element, valueAccessor, code)
}

export { bind }