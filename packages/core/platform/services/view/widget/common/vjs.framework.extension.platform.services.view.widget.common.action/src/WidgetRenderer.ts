import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'
import * as widgetAction from './WidgetAction'

let sb
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sandbox) {
  sb = sandbox
}

/**
 * 判断控件是否存在指定的渲染接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let isWidgetRenderActionExist = function (widgetId, actionName) {
  let widgetRenderActionHandler = getWidgetRenderActionHandler(widgetId)
  if (typeof widgetRenderActionHandler[actionName] == 'function') {
    return true
  }
  return false
}

/**
 * 判断组件是否存在指定的渲染接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let isComponentRenderActionExist = function (actionName) {
  let componentRenderActionHandler = getComponentRenderActionHandler()
  if (typeof componentRenderActionHandler[actionName] == 'function') {
    return true
  }
  return false
}

/**
 * 获取控件渲染接口管理类
 *
 * @widgetId 控件编号
 */
let getWidgetRenderActionHandler = function (widgetId) {
  let widgetType = widgetContext.getType(widgetId)
  let seriesType = scopeManager.getWindowScope().getSeries()
  let widgetRenderActionHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.' + widgetType + '.render.' + widgetType,
    {
      type: seriesType
    }
  )
  return widgetRenderActionHandler
}

/**
 * 获取组件渲染接口管理类
 */
let getComponentRenderActionHandler = function () {
  let seriesType = scopeManager.getWindowScope().getSeries()
  let componentRenderActionHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.JGComponent.render.JGComponent',
    {
      type: seriesType
    }
  )
  return componentRenderActionHandler
}

/**
 * 调用控件渲染接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let executeWidgetRenderAction = function (widgetId, actionName) {
  let widgetType = widgetContext.getType(widgetId)
  let hasPermission = true
  let permission = sb.getService(
    'vjs.framework.extension.platform.services.view.permission.Permission'
  )
  if (permission) {
    hasPermission = permission.hasPermission(widgetId)
  }
  if (hasPermission) {
    if (isWidgetRenderActionExist(widgetId, actionName)) {
      let proxyWidgetId = widgetAction.getProxyWidgetId(widgetId)
      if (proxyWidgetId) {
        let proxyWidgetType = widgetContext.get(widgetId, 'WidgetType')
        let widgetRenderActionHandler =
          getWidgetRenderActionHandler(proxyWidgetId)
        let params = [proxyWidgetId, widgetId]
        if (arguments.length > 2) {
          for (let i = 2; i < arguments.length; i++) {
            params.push(arguments[i])
          }
        }
        return widgetRenderActionHandler[proxyWidgetType][actionName].apply(
          this,
          params
        )
      } else {
        let widgetRenderActionHandler = getWidgetRenderActionHandler(widgetId)
        let params = [widgetId]
        if (arguments.length > 2) {
          for (let i = 2; i < arguments.length; i++) {
            params.push(arguments[i])
          }
        }
        return widgetRenderActionHandler[actionName].apply(this, params)
      }
    } else {
      return null
    }
  } else {
    window.console.warn(
      '[WidgetRenderer.executeWidgetRenderAction]调用控件[' +
        widgetId +
        ']接口[' +
        actionName +
        ']失败！原因：没有权限'
    )
  }
}

/**
 * 执行子控件渲染接口
 *
 * @widgetId 控件编号
 * @actionName 控件接口名
 */
let executeSubWidgetRenderAction = function (widgetId, actionName) {
  let widgetRelationList = widgetRelation.get(widgetId, false)
  for (let i = 0; i < widgetRelationList.length; i++) {
    let subWidgetId = widgetRelationList[i]
    if (isWidgetActionExist(subWidgetId, actionName)) {
      let params = [widgetId, actionName]
      if (arguments.length > 2) {
        for (let i = 2; i < arguments.length; i++) {
          params.push(arguments[j])
        }
      }
      return executeWidgetRenderAction.apply(this, params)
    }
  }
}

/**
 * 调用组件渲染接口
 *
 * @actionName 控件接口名
 */
let executeComponentRenderAction = function (actionName) {
  if (isComponentRenderActionExist(actionName)) {
    let componentRenderActionHandler = getComponentRenderActionHandler()
    let params = []
    if (arguments.length > 1) {
      for (let i = 1; i < arguments.length; i++) {
        params.push(arguments[i])
      }
    }
    return componentRenderActionHandler[actionName].apply(this, params)
  } else {
    return null
  }
}

export {
  getService,
  isWidgetActionExist,
  isComponentActionExist,
  getWidgetActionHandler,
  getComponentActionHandler,
  executeWidgetAction,
  executeSubWidgetAction,
  executeComponentAction,
  getProxyWidgetId,
  get,
  set,
  hasProperty,
  isWidgetRenderActionExist,
  isComponentRenderActionExist,
  getWidgetRenderActionHandler,
  getComponentRenderActionHandler,
  executeWidgetRenderAction,
  executeSubWidgetRenderAction,
  executeComponentRenderAction
}
