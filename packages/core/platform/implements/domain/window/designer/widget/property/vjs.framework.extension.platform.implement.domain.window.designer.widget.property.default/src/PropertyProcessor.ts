import { ProcessorUtils as processorUtils } from '@v-act/vjs.framework.extension.platform.application.window.web.designer.utils'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import * as childrenEditor from './editors/children'
import * as entityEditor from './editors/entity'
import * as expressionEditor from './editors/expression'
import * as resourceEditor from './editors/resource'
import * as rulesetEditor from './editors/ruleset'
import * as addToComponentContainerHandler from './handlers/addToComponentContainer'
import * as browsercreateDialogHandler from './handlers/browser.createDialog'
import * as browserredirectHandler from './handlers/browser.redirect'
import * as browsershowModalHandler from './handlers/browser.showModal'
import * as componentActionHandler from './handlers/componentAction'
import * as componentRenderHandler from './handlers/componentRender'
import * as containerParentHandler from './handlers/containerParent'
import * as createDatasourceFromJsonHandler from './handlers/createDatasourceFromJson'
import * as DropdownSourceObserverHandler from './handlers/DropdownSourceObserver'
import * as entityHandler from './handlers/entity'
import * as eventCallerHandler from './handlers/eventCaller'
import * as eventHandlerHandler from './handlers/eventHandler'
import * as executeWindowRouteHandler from './handlers/executeWindowRoute'
import * as expressionHandler from './handlers/expression'
import * as fieldValueHandler from './handlers/fieldValue'
import * as getCurrencyFieldHandler from './handlers/getCurrencyField'
import * as getDropDownDataHandler from './handlers/getDropDownData'
import * as getFieldPropertyFormVMHandler from './handlers/getFieldPropertyFormVM'
import * as getParentWidgetHandler from './handlers/getParentWidget'
import * as getTableNameFormVMHandler from './handlers/getTableNameFormVM'
import * as getTreeHandler from './handlers/getTree'
import * as getWidgetContextPropertyHandler from './handlers/getWidgetContextProperty'
import * as handleComponentPackInfoHandler from './handlers/handleComponentPackInfo'
import * as handleWindowMappingHandler from './handlers/handleWindowMapping'
import * as instanceHandlerHandler from './handlers/instanceHandler'
import * as menuActionHandler from './handlers/menuAction'
import * as onHandler from './handlers/on'
import * as putWidgetContextPropertyHandler from './handlers/putWidgetContextProperty'
import * as registerContainerHandler from './handlers/registerContainer'
import * as remoteMethodAccessorHandler from './handlers/remoteMethodAccessor'
import * as remoteOperationHandler from './handlers/remoteOperation'
import * as renderWindowsHandler from './handlers/renderWindows'
import * as serverExpressionHandler from './handlers/serverExpression'
import * as treeHandlerHandler from './handlers/treeHandler'
import * as webDesignclonePropsHandler from './handlers/webDesign.cloneProps'
import * as widgetActionHandler from './handlers/widgetAction'
import * as widgetChildrenHandler from './handlers/widgetChildren'
import * as widgetParentHandler from './handlers/widgetParent'
import * as windowdestroyHandler from './handlers/window.destroy'
import * as windowopenWindowByRecordHandler from './handlers/window.openWindowByRecord'
import * as windowrenderToElementHandler from './handlers/window.renderToElement'
import * as windowrenderToVuiContainerHandler from './handlers/window.renderToVuiContainer'
import * as windowRelationdestroyHandler from './handlers/windowRelation.destroy'
import * as windowRelationgetHandler from './handlers/windowRelation.get'
import * as windowRelationgetByConditionHandler from './handlers/windowRelation.getByCondition'
import * as windowRelationupdateHandler from './handlers/windowRelation.update'
import * as windowVariantHandler from './handlers/windowVariant'

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
    entityEditor,
    expressionEditor,
    rulesetEditor,
    resourceEditor,
    childrenEditor
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
    addToComponentContainerHandler,
    browsercreateDialogHandler,
    browserredirectHandler,
    browsershowModalHandler,
    componentActionHandler,
    componentRenderHandler,
    containerParentHandler,
    createDatasourceFromJsonHandler,
    DropdownSourceObserverHandler,
    getDropDownDataHandler,
    entityHandler,
    eventCallerHandler,
    eventHandlerHandler,
    executeWindowRouteHandler,
    expressionHandler,
    fieldValueHandler,
    getCurrencyFieldHandler,
    getFieldPropertyFormVMHandler,
    getParentWidgetHandler,
    getTableNameFormVMHandler,
    getTreeHandler,
    getWidgetContextPropertyHandler,
    handleComponentPackInfoHandler,
    handleWindowMappingHandler,
    instanceHandlerHandler,
    menuActionHandler,
    onHandler,
    putWidgetContextPropertyHandler,
    registerContainerHandler,
    remoteMethodAccessorHandler,
    remoteOperationHandler,
    renderWindowsHandler,
    serverExpressionHandler,
    treeHandlerHandler,
    webDesignclonePropsHandler,
    widgetActionHandler,
    widgetChildrenHandler,
    widgetParentHandler,
    windowdestroyHandler,
    windowopenWindowByRecordHandler,
    windowrenderToElementHandler,
    windowrenderToVuiContainerHandler,
    windowRelationdestroyHandler,
    windowRelationgetHandler,
    windowRelationgetByConditionHandler,
    windowRelationupdateHandler,
    windowVariantHandler
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
