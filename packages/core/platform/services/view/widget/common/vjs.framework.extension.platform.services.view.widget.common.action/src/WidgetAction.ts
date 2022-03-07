import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'

/**
 * 判断控件是否存在指定的接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let isWidgetActionExist = function (widgetId, actionName) {
  let widgetActionHandler = getWidgetActionHandler(widgetId)
  if (widgetActionHandler) {
    if (typeof widgetActionHandler[actionName] == 'function') {
      return true
    } else {
      let proxyWidgetType = widgetContext.get(widgetId, 'WidgetType')
      if (
        widgetActionHandler[proxyWidgetType] &&
        widgetActionHandler[proxyWidgetType][actionName]
      ) {
        if (
          typeof widgetActionHandler[proxyWidgetType][actionName] == 'function'
        ) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * 判断组件是否存在指定的接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let isComponentActionExist = function (actionName) {
  let componentActionHandler = getComponentActionHandler()
  if (componentActionHandler) {
    if (typeof componentActionHandler[actionName] == 'function') {
      return true
    }
  }
  return false
}

/**
 * 获取控件接口管理类
 *
 * @widgetId 控件编号
 */
let getWidgetActionHandler = function (widgetId) {
  let proxyWidgetId = widgetContext.get(widgetId, 'ProxyWidgetId')
  let widgetType
  if (undefined == proxyWidgetId || null == proxyWidgetId) {
    widgetType = widgetContext.getType(widgetId)
  } else {
    widgetType = widgetContext.getType(proxyWidgetId)
  }
  let seriesType = scopeManager.getWindowScope().getSeries()
  let widgetActionHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.' +
      widgetType +
      '.action.' +
      widgetType +
      'Action',
    {
      type: seriesType
    }
  )
  return widgetActionHandler
}

/**
 * 获取组件接口管理类
 */
let getComponentActionHandler = function () {
  let seriesType = scopeManager.getWindowScope().getSeries()
  let componentActionHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.JGComponent.action.JGComponentAction',
    {
      type: seriesType
    }
  )
  return componentActionHandler
}

/**
 * 调用控件接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let executeWidgetAction = function (widgetId, actionName) {
  let scope = scopeManager.getChildWindowScope()
  let scopeId = scope ? scope.getInstanceId() : scopeManager.getCurrentScopeId()
  return scopeManager
    .createScopeHandler({
      scopeId: scopeId,
      handler: function () {
        var widgetType = widgetContext.getType(widgetId)
        var hasPermission = true
        var permission = sb.getService(
          'vjs.framework.extension.platform.services.view.permission.Permission'
        )
        if (permission) {
          hasPermission = permission.hasPermission(widgetId, actionName)
        }
        if (hasPermission) {
          if (
            isWidgetActionExist(widgetId, actionName) ||
            isWidgetActionExist(
              widgetId,
              'setChildProperty'
            ) /*给JGDiv中的vui控件设置属性*/
          ) {
            var proxyWidgetId = getProxyWidgetId(widgetId)
            if (proxyWidgetId) {
              var proxyWidgetType = widgetContext.get(widgetId, 'WidgetType')
              if (proxyWidgetType) {
                var widgetActionHandler = getWidgetActionHandler(proxyWidgetId)
                var params = [proxyWidgetId, widgetId]
                if (arguments.length > 2) {
                  for (var i = 2; i < arguments.length; i++) {
                    params.push(arguments[i])
                  }
                }
                return widgetActionHandler[proxyWidgetType][actionName].apply(
                  this,
                  params
                )
              } else {
                proxyWidgetType = widgetContext.get(proxyWidgetId, 'widgetType')
                var widgetActionHandler = getWidgetActionHandler(proxyWidgetId)
                var params = [actionName, proxyWidgetId, widgetId]
                if (arguments.length > 2) {
                  for (var i = 2; i < arguments.length; i++) {
                    params.push(arguments[i])
                  }
                }
                return widgetActionHandler['setChildProperty'].apply(
                  this,
                  params
                )
              }
            } else {
              var widgetActionHandler = getWidgetActionHandler(widgetId)
              var params = [widgetId]
              if (arguments.length > 2) {
                for (var i = 2; i < arguments.length; i++) {
                  params.push(arguments[i])
                }
              }
              return widgetActionHandler[actionName].apply(this, params)
            }
          } else {
            var widget = widgetContext.get(widgetId, 'widgetObj')
            if (undefined == widget || null == widget) return null
            var func = widget[actionName]
            if (
              undefined != func &&
              null != func &&
              typeof func == 'function'
            ) {
              var params = []
              if (arguments.length > 2) {
                for (var i = 2; i < arguments.length; i++) {
                  params.push(arguments[i])
                }
              }
              return func.apply(widget, params)
            } else {
              return null
            }
          }
        } else {
          if (window && window.console)
            window.console.warn(
              '[WidgetAction.executeWidgetAction]调用控件[' +
                widgetId +
                ']接口[' +
                actionName +
                ']失败！原因：没有权限'
            )
        }
      }
    })
    .apply(this, arguments)
}

/**
 * 执行子控件接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let executeSubWidgetAction = function (widgetId, actionName) {
  let widgetRelationList = widgetRelation.get(widgetId, false)
  for (let i = 0; i < widgetRelationList.length; i++) {
    let subWidgetId = widgetRelationList[i]
    if (isWidgetActionExist(subWidgetId, actionName)) {
      let params = [subWidgetId, actionName]
      if (arguments.length > 2) {
        for (let j = 2; j < arguments.length; j++) {
          params.push(arguments[j])
        }
      }
      executeWidgetAction.apply(this, params)
    }
  }
}

/**
 * 调用组件接口
 *
 * @actionName 控件接口名
 */
let executeComponentAction = function (actionName) {
  if (isComponentActionExist(actionName)) {
    let componentActionHandler = getComponentActionHandler()
    let params = []
    if (arguments.length > 1) {
      for (let i = 1; i < arguments.length; i++) {
        params.push(arguments[i])
      }
    }
    return componentActionHandler[actionName].apply(this, params)
  } else {
    return null
  }
}

let getProxyWidgetId = function (widgetId: string) {
  let proxyWidgetId = widgetContext.get(widgetId, 'ProxyWidgetId')
  if (undefined != proxyWidgetId && null != proxyWidgetId) return proxyWidgetId
  else return null
}

export {
  executeComponentAction,
  executeSubWidgetAction,
  executeWidgetAction,
  getComponentActionHandler,
  getProxyWidgetId,
  getService,
  getWidgetActionHandler,
  isComponentActionExist,
  isWidgetActionExist
}
