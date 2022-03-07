/**
 * 表单设计属性处理器
 * */
define('./FormDesignPropertyHandler', function (require, exports, module) {
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
      var propertys = params.propertys
      //			//预览数据定制逻辑
      //			if(window._v3Platform){
      //				var previewData = window._v3Platform.getPreviewData();
      //				if(previewData)
      //					propertys = previewData.propertys;
      //			}
      //新格式
      var newFormat = false
      if (
        propertys &&
        propertys.Component &&
        propertys.Forms &&
        propertys.Forms.length > 0
      ) {
        //新格式
        var newPropertys = []
        newFormat = true
        propertys = propertys.Forms[0].Widgets
      }
      if (propertys && propertys.length > 0) {
        var propertyMap = {}
        if (newFormat) {
          var newPropertys = []
          //把全部子控件递归取出来，不做层级
          getChildWidgets(propertys, newPropertys)
          propertys = newPropertys
          for (var i = 0, len = propertys.length; i < len; i++) {
            var property = propertys[i]
            var props = property.Properties
            if (props) {
              for (var key in props) {
                var val = props[key]
                if (val) {
                  if (
                    typeof val == 'object' &&
                    val.hasOwnProperty &&
                    val.hasOwnProperty('Value')
                  ) {
                    val = val.Value
                  }
                }
                if (
                  (key == 'MultiWidth' || key == 'MultiHeight') &&
                  typeof val == 'number'
                ) {
                  val = val + 'px'
                }
                props[key] = val
              }
            }
            var childWidgets = property.Widgets
            if (childWidgets && childWidgets.length > 0) {
              for (var j = 0, _l = childWidgets.length; j < _l; j++) {
                var props = childWidgets[j].Properties
                if (!props) {
                  continue
                }
                for (var key in props) {
                  props[key] = props[key].Value
                }
              }
            }
            propertyMap[property.WidgetCode] = property
          }
        }
        var widgets = windowScope.getWidgets()
        if (widgets) {
          for (var widgetCode in widgets) {
            var widget = widgets[widgetCode]
            var propertyInfo = propertyMap[widgetCode]
            if (!propertyInfo) {
              continue
            }
            //新二开控件
            var initor = getWidgetRender(widget.type) //widgetModule.get(widget.type);
            if (!initor) continue
            if (initor.updatePropertys) {
              initor.updatePropertys({
                propertys: propertyInfo,
                widget: widget
              })
            } else {
              var props = propertyInfo.Properties
              if (props) {
                for (var prop in props) {
                  if (props.hasOwnProperty(prop)) {
                    widget[prop] = props[prop]
                  }
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
  var recordToMap = function (initor, records) {
    if (!records) {
      return records
    }
    if (initor.isNewDevelopMode && initor.isNewDevelopMode()) {
      var newDatas = []
      for (var i = 0, len = records.length; i < len; i++) {
        var record = records[i]
        if (typeof record.toMap == 'function') {
          record = record.toMap()
        }
        newDatas.push(record)
      }
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

  var getChildWidgets = function (widgets, newWidgets) {
    if (widgets && widgets.length > 0) {
      for (var i = 0, len = widgets.length; i < len; i++) {
        var widget = widgets[i]
        newWidgets.push(widget)
        var type = widget.WidgetType
        if (
          type != 'JGFormLayout' &&
          type != 'JGDataGrid' &&
          type != 'JGTreeView' &&
          type != 'JGTreeGrid'
        ) {
          getChildWidgets(widget.Widgets, newWidgets)
        }
      }
    }
  }
})
