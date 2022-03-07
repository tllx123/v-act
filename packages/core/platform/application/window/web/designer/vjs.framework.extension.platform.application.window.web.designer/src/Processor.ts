import { ProcessorUtils as designerUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'
/**
 * 窗体设计器运行时处理器
 * */
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { configDataUtil } from '@v-act/vjs.framework.extension.platform.util.configDataUtil'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.json'

/**
 * 窗体viewlib渲染时调用的接口
 * {
 * 	"viewlib" : 窗体viewlib对象
 * }
 * */
exports.render = function (params) {
  var viewlib = params.viewlib
  if (viewlib) {
    var viewInfo = getViewlibData({
      viewlib: viewlib,
      scopeId: params.scopeId
    })
    var widgetPropertys = viewInfo.widgetPropertys
    var widgetRelation = viewInfo.widgetRelation
    var series = viewlib.getSeries()
    if (widgetPropertys) {
      for (var key in widgetPropertys) {
        var widgetProperty = widgetPropertys[key]
        var type = widgetProperty.type
        var service = sandbox.getService(
          'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
          {
            widgetType: type
          }
        )
        if (!service) {
          service = sandbox.getService(
            'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
            {
              widgetType: undefined
            }
          )
        }
        if (service && service.appendDefaultProperty) {
          service.appendDefaultProperty({
            propertys: widgetProperty,
            series: series
          })
        }
      }
    }
  }
}

/**
 * 转换成运行时数据
 * @param	{Object}	designDatas		设计器数据
 * @param	{Object}	mappingDatas	映射数据，用于区分多个窗体
 * */
exports.toRenderData = function (designDatas, mappingDatas) {
  var datas = {}
  if (designDatas && designDatas.Forms[0] && designDatas.Forms[0].Widgets) {
    var componentCode = designDatas.Component
    var windowCode = designDatas.Forms[0].Form
    var widgets = designDatas.Forms[0].Widgets
    for (var i = 0, len = widgets.length; i < len; i++) {
      var widget = widgets[i]
      var type = widget.WidgetType
      if (!type) {
        continue
      }
      var viewData
      var scopeId = designerUtils.getDataScopeId(widget, mappingDatas)
      if (scopeId) {
        var windowScope = scopeManager.getScope(scopeId)
        viewData = getViewlibData({
          //不建议直接传scopeId，因为用scopeId取的viewlib是引用的，避免误修改
          componentCode: windowScope.getComponentCode(),
          windowCode: windowScope.getWindowCode(),
          missModify: true
        })
      } else {
        viewData = getViewlibData({
          componentCode: componentCode,
          windowCode: windowCode,
          missModify: true
        })
      }
      var service = sandbox.getService(
        'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
        {
          widgetType: type
        }
      )
      if (!service) {
        service = sandbox.getService(
          'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
          {
            widgetType: undefined
          }
        )
      }
      if (service) {
        //列表自行处理widget，其他控件的widget在默认处理里面递归
        service.toRuntimeWidgetProps({
          propertys: widget,
          propObj: datas,
          mappingDatas: mappingDatas,
          viewlibPropDatas: viewData.widgetPropertys,
          series: viewData.series
        })
      }
    }
  }
  return datas
}

/**
 * 获取控件设计器服务
 * @param	{String}	widgetType	控件编码
 * */
var getWidgetDesignService = function (widgetType) {
  var service = sandbox.getService(
    'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
    {
      widgetType: widgetType
    }
  )
  if (!service) {
    service = sandbox.getService(
      'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
      {
        widgetType: undefined
      }
    )
  }
  return service
}

/**
 * 窗体设计器渲染时调用的接口
 * {
 * 	"componentCode" :	'构件编码',
 * 	"windowCode"	:	'窗体编码',
 * 	"callback"		:	Function//回调函数
 * }
 * */
exports.designer = function (params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var formWidgets = []
  var designDatas = {
    Component: componentCode,
    Forms: [
      {
        Form: windowCode,
        Widgets: formWidgets
      }
    ]
  }
  var viewData = getViewlibData({
    componentCode: componentCode,
    windowCode: windowCode
  })
  var widgetPropertys = viewData['widgetPropertys']
  var widgetRelation = viewData['widgetRelation']
  if (widgetRelation && widgetPropertys) {
    genDesignChild(
      windowCode,
      widgetPropertys,
      widgetRelation,
      formWidgets,
      viewData['series']
    )
  }
  if (params.callback) {
    params.callback(designDatas)
  }
  return designDatas
}

/**
 * 获取viewlib的数据
 * @param	params	可传入构件编码和窗体编码，或者直接传viewlib也可以
 * {
 * 	componentCode	{String}	//构件编码
 * 	windowCode		{String}	//窗体编码
 * 	scopeId			{String}	//窗体域
 * 	viewlib			{Object}	//viewlib对象
 *  missModify		{Boolean}	//忽略修改
 * }
 * @return
 * {
 * 	"widgetPropertys":{Object}//属性数据
 * 	"widgetRelation":{Object}//控件关系
 * 	"series":{String}//插件体系
 * }
 * */
var getViewlibData = function (params) {
  var componentCode = params.componentCode,
    windowCode = params.windowCode,
    scopeId = params.scopeId,
    viewlib = params.viewlib
  var datas = {}
  if (scopeId) {
    var windowScope = scopeManager.getScope(scopeId)
    componentCode = windowScope.getComponentCode()
    windowCode = windowScope.getWindowCode()
  }
  if (!viewlib) {
    viewlib = sandbox.getService(
      'vjs.framework.extension.publish.' +
        componentCode +
        '.' +
        windowCode +
        '.viewLib'
    )
  }
  if (viewlib) {
    var widgetPropertys = viewlib.getWidgetPropertys(scopeId)
    if (widgetPropertys.WidgetProperty) {
      widgetPropertys = widgetPropertys.WidgetProperty
    }
    var widgetRelation = viewlib.getWidgetRelation()
    if (!params.missModify) {
      var modifyDatas = getModifyProperty(componentCode, windowCode)
      if (modifyDatas) {
        for (var widgetCode in modifyDatas) {
          var wProp = widgetPropertys[widgetCode]
          if (!wProp || !wProp.type) {
            continue
          }
          var mData = modifyDatas[widgetCode]
          var service = getWidgetDesignService(wProp.type)
          if (service && service.cloneProps) {
            service.cloneProps(mData, wProp, {})
          } else {
            deepClone(mData, wProp)
          }
        }
      }
    }
    datas['widgetPropertys'] = widgetPropertys
    datas['widgetRelation'] = widgetRelation
    datas['series'] = viewlib.getSeries()
  }
  return datas
}

exports.getViewlibData = getViewlibData

/**
 * 深度拷贝
 * */
var deepClone = function (obj, newObj) {
  var newObj = newObj || {}
  if (newObj.constructor == Array) {
    for (var i = 0, len = obj.length; i < len; i++) {
      var val = obj[i]
      if (typeof val == 'object') {
        if (!newObj[i]) {
          newObj[i] = val.constructor === Array ? [] : {}
        }
        deepClone(val, newObj[i])
      } else {
        newObj[i] = val
      }
    }
  } else {
    for (key in obj) {
      if (typeof obj[key] == 'object') {
        if (!newObj[key]) {
          newObj[key] = obj[key].constructor === Array ? [] : {}
        }
        deepClone(obj[key], newObj[key])
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}

/**
 * 生成设计器的子元素
 * @param	{String}	widgtetCode		控件编码
 * @param	{Object}	propertys		全部编码
 * @param	{Object}	relationDatas	全部依赖关系
 * @param	{Object}	widgets			用于存储子控件
 * */
var genDesignChild = function (
  widgetCode,
  propertys,
  relationDatas,
  widgets,
  series,
  otherPropertys
) {
  if (!widgets) {
    widgets = []
  }
  if (!otherPropertys) {
    //目前页签页的属性不与控件属性同层
    otherPropertys = {}
  }
  if (relationDatas) {
    var relations = relationDatas[widgetCode]
    for (var i = 0, len = relations.length; i < len; i++) {
      var relation = relations[i]
      var property = propertys[relation]
      if (!property) {
        if (otherPropertys[relation]) {
          var widgetProperty = otherPropertys[relation]
          widgets.push(widgetProperty)
          var cWidget = []
          widgetProperty['Widgets'] = genDesignChild(
            relation,
            propertys,
            relationDatas,
            cWidget,
            series,
            otherPropertys
          )
        }
        continue
      } else {
        var service = sandbox.getService(
          'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
          {
            widgetType: property.type
          }
        )
        if (!service) {
          service = sandbox.getService(
            'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
            {
              widgetType: undefined
            }
          )
        }
        if (service) {
          var widgetProperty = service.toDesignerWidgetProps(property, series, {
            otherPropertys: otherPropertys
          })
          if (widgetProperty) {
            var childCode = property.code
            if (relationDatas.hasOwnProperty(childCode)) {
              var cWidget = []
              widgetProperty['Widgets'] = genDesignChild(
                childCode,
                propertys,
                relationDatas,
                cWidget,
                series,
                otherPropertys
              )
            }
            widgets.push(widgetProperty)
          }
        }
      }
    }
  }
  return widgets
}

/**
 * 获取修改的属性
 * */
var getModifyProperty = function (componentCode, windowCode) {
  var services = sandbox.getAllServices(
    'vjs.framework.extension.platform.interface.view.window.widget.property.processor'
  )
  if (!services) {
    services = []
  }
  var windowScope = scopeManager.getWindowScope()
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
  if (filter && jsonUtils.obj2json(filter) != '{}') {
    //有条件的
    //有条件的，只需要那指定一个即可，因为目前除了窗体设计器生成框架窗体有条件，其他都是没条件的
    var newService = sandbox.getService(
      'vjs.framework.extension.platform.interface.web.design.' +
        componentCode +
        '.' +
        windowCode +
        '.property',
      filter
    )
    if (newService) {
      services.push(newService)
    }
  } else {
    //新版vjs 窗体设计器和实体字段金额(旧版)使用同一个vjs服务，因为此处货币字段的服务是没用到的，但获取单服务可能获取到货币字段的服务，所以要获取全部服务
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
  }
  //		//新版vjs 窗体设计器和实体字段金额使用同一个vjs服务，所以要获取全部服务
  //		var newServices = sandbox.getAllServices("vjs.framework.extension.platform.interface.web.design."+componentCode+"."+windowCode+".property");
  //		if(newServices){
  //			services = services.concat(newServices);
  //		}
  //预览的数据仅存在缓存，属于最优先且不能被忽略
  var previewServices = []
  //预览数据定制逻辑
  if (window._v3Platform) {
    var _v3Platform = window._v3Platform
    if (_v3Platform.getExtraHandler) {
      services = services.concat(_v3Platform.getExtraHandler())
      previewServices = previewServices.concat(_v3Platform.getExtraHandler())
    }
    if (_v3Platform.getPreviewData) {
      var previewData = window._v3Platform.getPreviewData()
      if (previewData) {
        services.push(previewData)
        previewServices.push(previewData)
      }
    }
  }
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
  //优先取配置数据
  var datas = _getWebDegignData(filter, componentCode, windowCode)
  //再处理窗体设计器预览数据
  for (var i = 0, len = defaultOrder.length; i < len; i++) {
    var service = defaultOrder[i]
    if (typeof service.getProperty != 'function') {
      continue
    }
    //标记为无效
    service.isInValid = true
    if (previewServices.indexOf(service) != -1) {
      //窗体设计器数据预览需要生效，不能被缓存覆盖
      var data = service.getProperty(componentCode, windowCode)
      if (data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            datas[key] = data[key]
          }
        }
      }
    }
  }
  return datas
}
/**
 * 根据构件编码和窗体编码获取窗体设计器数据
 * @param	{Object}	filter			过滤条件
 * @param	{String}	componentCode	构件编码
 * @param	{Object}	windowCode		窗体编码
 * @return	{Object}	相应的窗体设计器数据
 * {
 * 	{String}:{Any},
 * 	.....
 * }
 * */
var _getWebDegignData = function (filter, componentCode, windowCode) {
  var datas = {}
  var cond = {}
  if (filter && jsonUtils.obj2json(filter) != '{}') {
    for (var key in filter) {
      if (filter.hasOwnProperty(key)) {
        cond[key] = filter[key]
      }
    }
  } else {
    filter = null //后续直接判断null即可，不用判断{}
  }
  //优先取配置数据
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
      if (filter) {
        if (condition) {
          with (filter) {
            allow = eval('(' + condition + ')')
          }
        }
      } else if (!condition) {
        allow = true
      }
      if (allow) {
        var _data = allData.datas
        for (var key in _data) {
          datas[key] = _data[key]
        }
      }
    }
  }
  return datas
}
