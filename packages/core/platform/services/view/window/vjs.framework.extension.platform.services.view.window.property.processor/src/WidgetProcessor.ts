/**
 * @namespace WidgetProcessor
 * @module WidgetProcessor
 * @desc 控件属性处理器<br/>
 * vjs名称：vjs.framework.extension.platform.services.view.window.property.processor<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.view.window.property.WidgetProcessor<br/>
 * @author liangzc
 * */
var sandbox,
  scopeManager,
  processorManager,
  propertyHandle,
  configDataUtil,
  webDesignPropertyHandle,
  jsonUtils,
  prototypeProcessor

export function initModule(sb) {
  sandbox = sb
  scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  configDataUtil = sb.getService(
    'vjs.framework.extension.platform.util.configDataUtil'
  )
  jsonUtils = sb.getService('vjs.framework.extension.util.JsonUtil')
  webDesignPropertyHandle = sb.getService(
    'vjs.framework.extension.platform.window.property.handle.WebDesignPropertyHandle'
  )
  prototypeProcessor = sb.getService(
    'vjs.framework.extension.platform.services.view.prototype.property.PrototypeProcessor'
  )
  processorManager = require('vjs/framework/extension/platform/services/view/window/property/processor/ProcessorManager')
  propertyHandle = sb.getService(
    'vjs.framework.extension.platform.window.property.handle.PropertyHandle'
  )
}
/**
 * 窗体属性处理器
 * @param	{Object}	params
 * callback	{Function}	回调函数
 * */
export function process(params) {
  /**
   * 1、获取全部控件属性处理器
   * 2、调用process，获取Deffered
   * 3、等待全部Deffered执行完成，再执行回调
   * 调整顺序：默认序号为0，执行顺序从小到大执行，权限设置序号为10，请尽量别超过权限的序号
   * */
  var dtds = []
  //旧版vjs 表单标题自适应 权限
  var services = sandbox.getAllServices(
    'vjs.framework.extension.platform.interface.view.window.widget.property.processor'
  )
  if (!services) {
    services = []
  }

  var windowScope = scopeManager.getWindowScope()
  var componentCode = windowScope.getComponentCode()
  var windowCode = windowScope.getWindowCode()
  //直接处理窗体设计器数据，后续涉及窗体设计器数据处理逻辑都可以删除，注意实体金额字段以及控件权限的逻辑
  _handleWindowDesignData(windowScope)
  //实体金额服务
  var currencyService = sandbox.getService(
    'vjs.framework.extension.platform.interface.web.design.' +
      componentCode +
      '.' +
      windowCode +
      '.currency.field.property'
  )
  if (currencyService) {
    services.push(currencyService)
  }
  //新版vjs
  var newServices = sandbox.getAllServices(
    'vjs.framework.extension.platform.interface.web.design.' +
      componentCode +
      '.' +
      windowCode +
      '.property'
  )
  if (newServices) {
    services = services.concat(newServices)
  }

  //		//预览数据定制逻辑
  //		if(window._v3Platform && window._v3Platform.getPreviewData){
  //			var _v3Platform = window._v3Platform;
  //			var previewData = window._v3Platform.getPreviewData();
  //			if(previewData){
  //				services.push(previewData)
  //			}
  //		}
  var defaultOrder = []
  var os = []
  for (var i = 0, len = services.length; i < len; i++) {
    try {
      var service = services[i]
      if (typeof service.getOrder == 'function') {
        var order = service.getOrder()
        order = Number(order)
        if (isNaN(Number(order))) {
          defaultOrder.push(service)
        } else {
          if (!os[order]) {
            os[order] = []
          }
          os[order].push(service)
        }
      } else {
        defaultOrder.push(service)
      }
    } catch (e) {
      defaultOrder.push(service)
    }
  }
  for (var i = 0, len = os.length; i < len; i++) {
    var _o = os[i]
    if (_o && _o.length > 0) {
      defaultOrder = defaultOrder.concat(_o)
    }
  }
  for (var i = 0, len = defaultOrder.length; i < len; i++) {
    try {
      //忽略无效的。
      if (!defaultOrder[i].isInValid) {
        if (
          typeof defaultOrder[i].getType == 'function' &&
          defaultOrder[i].getType() == 'CurrencyField'
        ) {
          dtds.push(
            propertyHandle.processCurrencyField({
              datas: defaultOrder[i].getCurrencyData()
            })
          )
        } else {
          dtds.push(defaultOrder[i].process())
        }
      }
    } catch (e) {
      //暂不处理
    }
  }
  var callback
  if (params && typeof params.callback == 'function') {
    callback = scopeManager.createScopeHandler({
      handler: params.callback
    })
  }
  if (callback) {
    if (dtds.length > 0) {
      $.when.apply($.when, dtds).done(callback)
    } else {
      callback()
    }
  }
}
/**
 * 从指定地方获取窗体设计器数据，并设置到控件上
 * */
var _handleWindowDesignData = function (windowScope) {
  var componentCode = windowScope.getComponentCode()
  var windowCode = windowScope.getWindowCode()
  //优先取配置数据
  var filter = null
  if (windowScope) {
    var vjsContext = windowScope.getVjsContext()
    if (vjsContext) {
      filter = {}
      for (var key in vjsContext) {
        if (vjsContext.hasOwnProperty(key)) {
          filter[key] = vjsContext[key]
        }
      }
    }
  }
  var cond = {}
  if (filter) {
    for (var key in filter) {
      if (filter.hasOwnProperty(key)) {
        cond[key] = filter[key]
      }
    }
  }
  cond[configDataUtil.KEYS.COMPONENTCODE] = componentCode
  cond[configDataUtil.KEYS.WINDOWCODE] = windowCode
  var allDatas = configDataUtil.getDataSync('WebDesign', cond)
  if (allDatas) {
    for (var i = 0; i < allDatas.length; i++) {
      var allData = allDatas[i]
      if (!allData.datas) {
        continue
      }
      var _data = allData.datas
      var condition = allData.conditions
      var allow = false
      if (filter && jsonUtils.obj2json(filter) != '{}') {
        if (condition) {
          /*with (filter) {
            allow = eval('(' + condition + ')')
          }*/
          throw Error('TODO:未处理异常！')
        }
      } else if (!condition) {
        allow = true
      }
      if (allow) {
        var propertys = {}
        var datas = {
          componentCode: componentCode,
          propertys: propertys,
          windowCode: windowCode
        }
        var _data = allData.datas
        for (var key in _data) {
          if (_data.hasOwnProperty(key)) propertys[key] = _data[key]
        }
        webDesignPropertyHandle.process(datas)
      }
    }
  }
}
