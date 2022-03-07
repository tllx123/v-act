import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { processorUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'
var _handlers = {},
  _compatibleHandlers = {},
  _editorHandlers = {}

_initEditorHandlers()
_initCompatibleHandlers()
_initHandlers()

/**
 * 初始化编辑器handler
 */
var _initEditorHandlers = function () {
  var handlers = [
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/editors/entity'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/editors/expression'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/editors/ruleset'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/editors/resource'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/editors/children')
  ]
  for (var i = 0, l = handlers.length; i < l; i++) {
    var handler = handlers[i]
    _editorHandlers[handler.getType()] = handler.getHandler()
  }
}

var _initCompatibleHandlers = function () {
  var handlers = [
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/compatible/DropDownSource')
  ]
  for (var i = 0, l = handlers.length; i < l; i++) {
    var handler = handlers[i]
    _compatibleHandlers[handler.getType()] = handler.getHandler()
  }
}

var _initHandlers = function () {
  var handlers = [
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/addToComponentContainer'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/browser.createDialog'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/browser.redirect'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/browser.showModal'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/componentAction'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/componentRender'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/containerParent'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/createDatasourceFromJson'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/DropdownSourceObserver'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getDropDownData'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/entity'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/eventCaller'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/eventHandler'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/executeWindowRoute'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/expression'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/fieldValue'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getCurrencyField'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getFieldPropertyFormVM'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getParentWidget'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getTableNameFormVM'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getTree'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/getWidgetContextProperty'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleComponentPackInfo'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/handleWindowMapping'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/instanceHandler'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/menuAction'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/on'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/putWidgetContextProperty'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/registerContainer'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/remoteMethodAccessor'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/remoteOperation'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/renderWindows'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/serverExpression'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/treeHandler'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/vPlatformVue'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/webDesign.cloneProps'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/widgetAction'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/widgetChildren'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/widgetParent'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/window.destroy'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/window.openWindowByRecord'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/window.renderToElement'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/window.renderToVuiContainer'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/windowRelation.destroy'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/windowRelation.get'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/windowRelation.getByCondition'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/windowRelation.update'),
    require('vjs/framework/extension/platform/implement/domain/window/designer/widget/property/default/handlers/windowVariant')
  ]
  for (var i = 0, l = handlers.length; i < l; i++) {
    var handler = handlers[i]
    _handlers[handler.getHandlerName()] = handler.getHandler()
  }
}
/**
 * 添加默认属性
 */
export function appendDefaultProperty(params) {
  var widgetProperty = params.propertys
  var series = params.series
  var metadataService = sandbox.getService(
    'vjs.framework.extension.ui.plugin.' +
      series +
      '.metadata.' +
      widgetProperty.type
  )
  if (!metadataService) {
    return
  }
  var metadata = metadataService.getMetadata()
  if (!metadata || !metadata.properties) {
    return
  }
  // 处理新规范二次开发的控件
  if (metadataService.isNewDevelopMode && metadataService.isNewDevelopMode()) {
    return this.dealManifestProperties(params, metadata)
  }
  var defaultProps = metadata.properties
  for (var key in defaultProps) {
    if (!widgetProperty.hasOwnProperty(key)) {
      if (key == 'fields') {
        continue
      }
      var value = processorUtils.handleDefaultValue(defaultProps[key])
      widgetProperty[key] = value
    }
  }
}

export function dealManifestProperties(params, metadata) {
  var properties = metadata.properties
  var widgetProperty = params.propertys
  var windowScope = scopeManager.getWindowScope()
  widgetProperty.windowCode = windowScope.getWindowCode()
  widgetProperty.componentCode = windowScope.getComponentCode()
  // 处理绑定方法的属性
  for (var i = 0, l = properties.length; i < l; i++) {
    var property = properties[i]
    var handler = property.handler
    if (handler && _handlers[handler]) {
      _handlers[handler](property, widgetProperty)
      continue
    }
    var editor = property.editor
    var code = property.code
    if (editor) {
      var editorType = editor.type
      var handler = _editorHandlers[editorType]
      if (handler) {
        handler(property, widgetProperty)
      }
    }
    var compatible = property.compatible
    if (compatible) {
      var enhanceType = compatible.enhanceType
      var handler = _compatibleHandlers[enhanceType]
      if (handler) {
        handler(property, widgetProperty)
      }
    }
    if (
      property.hasOwnProperty('default') &&
      !widgetProperty.hasOwnProperty(code)
    ) {
      // 添加控件默认属性值
      widgetProperty[code] = property['default']
    }
  }
}

/**
 * 对metadata中的属性重新排序
 */
export function resortMetadataProperty(metadataProperty) {
  var newObj = {}
  var propertyKeys = [
    'TabIndex',
    'Alias',
    'SimpleChineseTitle',
    'Placeholder',
    'DefaultValue',
    'PeriodType',
    'MaxCount',
    'FileSize',
    'Validators',
    'MaxDate',
    'MinDate',
    'DateDisplay',
    'IntegralPartLength',
    'FractionalPartLength',
    'RowCount',
    'ColSpan',
    'Dock',
    'ValueTextAlign',
    'Theme',
    'CriteriaActionSetting',
    'ReadOnly',
    'Enabled',
    'IsMust',
    'Visible',
    'EndRow',
    'LabelVisible'
  ]
  for (var index in propertyKeys) {
    var key = propertyKeys[index]
    if (metadataProperty.hasOwnProperty(key)) {
      newObj[key] = metadataProperty[key]
    }
  }
  for (var key in metadataProperty) {
    if (!newObj.hasOwnProperty(key)) {
      newObj[key] = metadataProperty[key]
    }
  }
  return newObj
}
/**
 * 转换成控件设计器属性
 */
export function toDesignerWidgetProps(propertys, series) {
  if (!propertys || !propertys.type || !propertys.code || !series) {
    return
  }
  // var windowScope = scopeManager.getWindowScope();
  // var series = windowScope.getSeries();
  var type = propertys.type
  var widgetPropertys = {}
  var datas = {
    WidgetCode: propertys.code,
    WidgetType: type,
    widgetName: propertys.SimpleChineseTitle,
    Properties: widgetPropertys
  }
  var allDatas = []
  allDatas.push(datas)
  var metadataService = sandbox.getService(
    'vjs.framework.extension.ui.plugin.' + series + '.metadata.' + type
  )
  if (!metadataService) {
    return allDatas
  }
  var metadata = metadataService.getMetadata()
  if (!metadata || !metadata.properties) {
    return allDatas
  }
  var metadataPropertys = metadata.properties
  if (
    typeof metadataService.isNewDevelopMode == 'function' &&
    metadataService.isNewDevelopMode()
  ) {
    metadataPropertys = processorUtils.convert(metadataPropertys) // 二次开发格式转换成控件所需的格式
  }
  metadataPropertys = exports.resortMetadataProperty(metadataPropertys)
  for (var key in metadataPropertys) {
    if (
      !metadataPropertys.hasOwnProperty(key) ||
      !metadataPropertys[key] ||
      !metadataPropertys[key].editor
    ) {
      continue
    }
    var editor = metadataPropertys[key].editor
    var editService = sandbox.getService(
      'vjs.framework.extension.platform.interface.domain.widget.property.editor',
      {
        type: editor.type
      }
    )
    if (!editService) {
      continue
    }
    var value = propertys.hasOwnProperty(key)
      ? propertys[key]
      : metadataPropertys[key]['default']
    widgetPropertys[key] = {
      Title: metadataPropertys[key].title,
      Value: value,
      EditorProperties: editService.getEditor(propertys, null, editor)
    }
  }
  if (!datas.widgetName) {
    var info =
      metadataPropertys['simpleChineseTitle'] ||
      metadataPropertys['SimpleChineseTitle'] ||
      metadataPropertys['Alias']
    if (info) {
      if (info.editor) {
        datas.widgetName = info['default'] || info['defaultValue']
      } else {
        datas.widgetName = info
      }
    }
  }
  return allDatas
}

/**
 * 转换成运行时的控件属性 { propertys : 转换的属性, propObj : 存放属性，可忽略，则结果在返回值 }
 */
export function toRuntimeWidgetProps(params) {
  // 基础属性
  var widgetPropertys = params.propertys
  var propertys = widgetPropertys.Properties
  // 引用对象
  var propObj = params.propObj
  // viewlib数据
  var viewlibPropDatas = params.viewlibPropDatas
    ? params.viewlibPropDatas[widgetPropertys.WidgetCode]
    : null
  var datas = processorUtils.toRuntimeDataByDesign({
    series: params.series,
    viewlibPropData: viewlibPropDatas,
    widgetNode: widgetPropertys
  })
  var widgets = widgetPropertys.Widgets
  if (widgets) {
    for (var i = 0, len = widgets.length; i < len; i++) {
      var widget = widgets[i]
      var widget = widgets[i]
      var type = widget.WidgetType
      if (type) {
        var service = sandbox.getService(
          'vjs.framework.extension.platform.interface.domain.window.designer.widget.property',
          {
            widgetType: type
          }
        )
        if (service) {
          service.toRuntimeWidgetProps({
            propertys: widget,
            mappingDatas: params.mappingDatas,
            propObj: propObj,
            series: params.series,
            viewlibPropDatas: params.viewlibPropDatas
          })
          continue
        }
      }
      exports.toRuntimeWidgetProps({
        propertys: widget,
        propObj: propObj,
        mappingDatas: params.mappingDatas,
        series: params.series,
        viewlibPropDatas: params.viewlibPropDatas
      })
    }
  }
  if (propObj) {
    var scopeId = processorUtils.getDataScopeId(
      widgetPropertys,
      params.mappingDatas
    )
    if (!propObj[scopeId]) {
      propObj[scopeId] = {}
    }
    propObj[scopeId][widgetPropertys['WidgetCode']] = datas
  }
  return datas
}
/**
 * 复制属性 如果属性是数组，并且数组里面存的元素是object，则需要重写此方法 指定排序的key，参考列表的cloneProps
 *
 * @param {Object}
 *            source 来源
 * @param {Object}
 *            target 目标
 */
export function cloneProps(source, target, sortCfg) {
  return processorUtils.cloneProps(source, target, sortCfg)
}

export function genDesignerWidgetProps(property, series) {
  var props = exports.toDesignerWidgetProps(property, series)
  if (props) {
    var datas = processorUtils.genParentFormats(props)
    return datas
  }
  return []
}
