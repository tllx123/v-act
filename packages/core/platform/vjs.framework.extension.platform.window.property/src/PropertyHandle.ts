/**
 * 属性处理器，模板统一调用，避免模板重新生成
 * */
var scopeManager,
  sandbox,
  widgetModule,
  formDesignPropertyHandler,
  entityFieldPropertyHandler,
  defaultPropertyHandler

export function initModule(sb) {
  sandbox = sb
  scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  widgetModule = sb.getService(
    'vjs.framework.extension.widget.manager.widgetModule'
  )
  formDesignPropertyHandler = require('vjs/framework/extension/platform/window/property/handle/impl/FormDesignPropertyHandler')
  defaultPropertyHandler = require('vjs/framework/extension/platform/window/property/handle/impl/DefaultPropertyHandler')
  entityFieldPropertyHandler = require('vjs/framework/extension/platform/window/property/handle/impl/EntityFieldPropertyHandler')
}

/**
 * 模板统一调用修改属性，避免模板重新生成，后面有时间再改造成接口与实现的方式
 * params	{Object}	生成vjs的数据
 * {}
 * */
export function process(params) {
  var returnData
  var type = params['_$DataType']
  switch (type) {
    case 'FormDesignPropertyData':
      returnData = formDesignPropertyHandler.process(params)
      break
    case 'EntityFieldCurrencyData':
      returnData = entityFieldPropertyHandler.process(params)
      break
    default:
      returnData = defaultPropertyHandler.process(params)
      break
  }
  if (null != returnData) {
    return returnData
  }
  var dtd = $.Deferred()
  setTimeout(function () {
    dtd.resolve()
  }, 1)
  return dtd
}

/**
 * 处理货币格式 （新格式）
 * params	{Object}	生成vjs的数据
 * {}
 * */
export function processCurrencyField(params) {
  var returnData = entityFieldPropertyHandler.processNew(params)
  if (null != returnData) {
    return returnData
  }
  var dtd = $.Deferred()
  setTimeout(function () {
    dtd.resolve()
  }, 1)
  return dtd
}