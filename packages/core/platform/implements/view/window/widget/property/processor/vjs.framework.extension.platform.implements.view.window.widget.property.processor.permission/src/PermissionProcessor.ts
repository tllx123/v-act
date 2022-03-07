/**
 * @namespace PermissionProcessor
 * @module PermissionProcessor
 * @desc 表单标题属性处理器<br/>
 * vjs名称：vjs.framework.extension.platform.implements.view.window.widget.property.processor.permission<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.view.window.widget.property.processor<br/>
 * @author liangzc
 * */
define('./PermissionProcessor', function (require, exports, module) {
  var sandbox, scopeManager, windowInfo, widgetContext

  export function initModule(sb) {
    sandbox = sb
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    windowInfo = sb.getService(
      'vjs.framework.extension.platform.data.manager.runtime.info.WindowInfo'
    )
    widgetContext = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
    )
  }
  export function getOrder() {
    return 10
  }
  /**
   * 窗体属性处理器
   * @param	{Object}	params
   * callback	{Function}	回调函数
   * */
  export function process(params) {
    var windowScope = scopeManager.getWindowScope()
    var widgetPermission = windowInfo.getWidgetPermission(
      windowScope.getComponentCode(),
      windowScope.getWindowCode()
    )
    if (widgetPermission && widgetPermission.edit) {
      var allWidgets = scopeManager.getWindowScope().getWidgets()
      var wp = widgetPermission.edit
      for (var wId in wp) {
        var parentWidgetCode = widgetContext.get(wId, 'ProxyWidgetId')
        var modifyProperty = wp[wId]
        if (parentWidgetCode) {
          var parentProperty = allWidgets[parentWidgetCode]
          if (!parentProperty) continue
          var childPropertys = {}
          switch (parentProperty._$WidgetType || parentProperty.WidgetType) {
            case 'JGToolbarMenu':
              var proxyWidgetID = parentProperty.ProxyWidgetId
              var parentProperty = allWidgets[proxyWidgetID]
            case 'JGToolbar':
              var proxyWidgetID = parentProperty.ProxyWidgetId
              var proxyWidget = allWidgets[proxyWidgetID]
              var toolbars = proxyWidget.tools && proxyWidget.tools[0].toolbars
              childPropertys = setToolbarsProp(
                toolbars,
                modifyProperty,
                wId,
                childPropertys
              )
              break
            case 'JGDataGrid':
            case 'JGTreeGrid':
              var fields = parentProperty.fields
              var tools = parentProperty.tools
              if (
                (!fields || fields.length < 1) &&
                (!tools || tools.length < 1)
              )
                continue
              for (var i = 0; i < fields.length; i++) {
                var fieldProperty = fields[i]
                var columnId = fieldProperty.columnId
                if (columnId == wId) {
                  if (modifyProperty.hasOwnProperty('ReadOnly'))
                    fieldProperty.canEdit = !modifyProperty.ReadOnly
                  if (modifyProperty.hasOwnProperty('Enabled'))
                    fieldProperty.disabled = !modifyProperty.Enabled
                  if (modifyProperty.hasOwnProperty('Visible'))
                    fieldProperty.showIf = modifyProperty.Visible + ''
                  childPropertys[fieldProperty.columnId] = fieldProperty
                }
              }
              for (var i = 0; i < tools.length; i++) {
                tools[i].Visible = true
                if (tools[i].Code == wId) {
                  if (modifyProperty.hasOwnProperty('Visible')) {
                    tools[i]._Visible = modifyProperty.Visible
                  }
                  childPropertys[tools[i].Code] = tools[i]
                }
              }
              break
            case 'JGTabControl':
              var tabs = parentProperty.tabs
              if (!tabs || tabs.length < 1) continue
              for (var i = 0; i < tabs.length; i++) {
                var tabProperty = tabs[i]
                childPropertys[tabProperty.id] = tabProperty
              }
              break
            case 'JGFormLayout':
              var fields = parentProperty.fields
              if (!fields || fields.length < 1) continue
              for (var i = 0; i < fields.length; i++) {
                var fieldProperty = fields[i]
                var fieldCode = fieldProperty.Code
                if (fieldCode == wId) {
                  if (modifyProperty.hasOwnProperty('ReadOnly'))
                    fieldProperty.ReadOnly = !modifyProperty.ReadOnly
                  if (modifyProperty.hasOwnProperty('Enabled'))
                    fieldProperty.Enabled = !modifyProperty.Enabled
                  if (modifyProperty.hasOwnProperty('Visible'))
                    fieldProperty.Visible = modifyProperty.Visible
                  childPropertys[fieldProperty.Code] = fieldProperty
                }
              }
              break
          }
          var childProperty = childPropertys[wId]
          if (!childProperty) continue
          for (var mP in modifyProperty) {
            if (!modifyProperty.hasOwnProperty(mP)) continue
            if (mP == '_hasPermission')
              childProperty['Enabled'] = modifyProperty[mP]
            else childProperty[mP] = modifyProperty[mP]
          }
        } else {
          var parentProperty = allWidgets[wId]
          if (!parentProperty) continue
          for (var mP in modifyProperty) {
            if (!modifyProperty.hasOwnProperty(mP)) continue
            if (mP == '_hasPermission')
              parentProperty['Enabled'] = modifyProperty[mP]
            else parentProperty[mP] = modifyProperty[mP]
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

  var setToolbarsProp = function (
    toolbars,
    modifyProperty,
    wId,
    childPropertys
  ) {
    if (toolbars && toolbars.length > 0) {
      for (var i = 0; i < toolbars.length; i++) {
        if (toolbars[i].Code == wId) {
          for (var temp in modifyProperty) {
            toolbars[i][temp] = modifyProperty[temp]
          }
          childPropertys[toolbars[i].Code] = toolbars[i]
          return childPropertys
        }
        setToolbarsProp(
          toolbars[i].toolbars,
          modifyProperty,
          wId,
          childPropertys
        )
      }
    }
    return childPropertys
  }
})
