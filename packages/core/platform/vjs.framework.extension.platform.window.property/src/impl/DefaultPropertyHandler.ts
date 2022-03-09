/**
 * 默认属性处理器
 * */
var scopeManager, sandbox, widgetModule

export function initModule(sb) {
  sandbox = sb
  scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  widgetModule = sb.getService(
    'vjs.framework.extension.widget.manager.widgetModule'
  )
}

/**
 * 处理接口
 * params	{Object}	生成vjs的数据
 * */
export function process(params) {
  var windowScope = scopeManager.getWindowScope()
  var componentCode = windowScope.getComponentCode()
  var windowCode = windowScope.getWindowCode()
  if (
    params.componentCode == componentCode &&
    windowCode == params.windowCode
  ) {
    var propertyMap = params.propertys
    var widgets = windowScope.getWidgets()
    if (widgets) {
      for (var widgetCode in widgets) {
        var widget = widgets[widgetCode]
        var propertyInfo = propertyMap[widgetCode]
        if (!propertyInfo) {
          continue
        }
        var records =
          params.extra && params.extra.widgetRecords
            ? params.extra.widgetRecords[widgetCode]
            : null
        var initor = getWidgetRender(widget.type)
        if (!initor) continue
        if (initor.updatePropertys) {
          records = recordToMap(widget.type, records)
          initor.updatePropertys({
            propertys: propertyInfo,
            widget: widget,
            records: records
          })
        } else {
          var props = propertyInfo.Properties
          if (props) {
            for (var prop in props) {
              if (prop.hasOwnProperty(prop)) {
                widget[prop] = props[prop]
              }
            }
          }
        }
      }
    }
  }
  var dtd = $.Deferred()
  setTimeout(function () {
    dtd.resolve()
  }, 1)
  return dtd
}
/**
 * 平台Record对象转普通map：二开只接受简单的map
 * */
var recordToMap = function (widgetType, records) {
  if (!records) {
    return records
  }
  var initor = widgetModule.get(widgetType)
  if (initor && initor.isNewDevelopMode && initor.isNewDevelopMode()) {
    var newDatas = []
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i]
      if (typeof record.toMap == 'function') {
        record = record.toMap()
      }
      newDatas.push(record)
    }
    return newDatas
  }
  return records
}

var getWidgetRender = function (widgetType) {
  var initor = widgetModule.get(widgetType)
  /* 不存在render或者控件已经经过二开改造的，都统一用静态方法 */
  if (!initor || (initor.isNewDevelopMode && initor.isNewDevelopMode())) {
    initor = isc[widgetType]
  }
  return initor
}
