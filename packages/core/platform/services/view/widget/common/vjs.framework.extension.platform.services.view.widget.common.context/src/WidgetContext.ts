import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'

let COMPONENT_TYPE = 'Component'
let WIDGET_CONTEXT_TYPE = 'widgetType'
let WIDGET_CONTEXT_CODE = 'widgetCode'
let WIDGET_CONTEXT_RAWTYPE = 'rawType'
let WIDGET_CONTEXT_STORETYPE = 'storeType'
let WIDGET_CONTEXT_RUNTIMEOBJECT = 'runtimeWidgetObj'
let WIDGET_CONTEXT_PROPERTY = 'widgetProperty'
let WIDGET_CONTEXT_RELATION = 'widgetRelation'
let WIDGET_CONTEXT_EXTWIDGETIDRELA = 'extWidgetIdRela'
let WIDGET_CONTEXT_EXTWIDGETTYPERELA = 'extWigetTypeRela'
let WIDGET_CONTEXT_BUSINESSREF = 'extWidgetBusinessRef'

// 控件内容池
let contextPool = {}

/*var _unRegistered = true;

var _destroy = function(){
    if(_unRegistered){//去除销毁逻辑，防止其他地方销毁窗体资源时无法获取控件实例
        scopeManager.on(scopeManager.EVENTS.DESTROY,function(){
            var scopeId = this.getCurrentScopeId();
            contextPool[scopeId] = null;
            delete contextPool[scopeId];
        });
        _unRegistered = false;
    }
}*/

/**
 * 获取控件上下文信息
 *
 * @param {String} widgetId 控件编号
 * @param {String} contextKey 上下文标识
 * @return {String} 控件上下文信息属性值
 */
let get = function (widgetId: string, contextKey: string) {
  //		var scope = scopeManager.getWindowScope();
  let scope = scopeManager.getChildWindowScope()
  if (scope) {
    return scope.getWidget(widgetId, contextKey)
  }
  //_destroy();
  let scopeId = scopeManager.getCurrentScopeId()
  let poolInScope = contextPool[scopeId]
  if (!poolInScope) {
    return null
  }
  let widgetContext = poolInScope[widgetId]
  if (!widgetContext) {
    return null
  }
  let contextValue = widgetContext[contextKey]
  if (undefined == contextValue || null == contextValue) {
    return null
  } else {
    return contextValue
  }
}

/**
 * 设置控件上下文信息
 *
 * @param {String} widgetId 控件编号
 * @param {String} contextKey 上下文标识
 * @param {String} contextValue 上下文内容
 */
let put = function (
  widgetId: string,
  contextKey: string,
  contextValue: string
) {
  //		var scope = scopeManager.getWindowScope();
  let scope = scopeManager.getChildWindowScope()
  if (scope) {
    scope.setWidget(widgetId, contextKey, contextValue)
  } else {
    //_destroy();
    let scopeId = scopeManager.getCurrentScopeId()
    let poolInScope = contextPool[scopeId]
    if (!poolInScope) {
      contextPool[scopeId] = poolInScope = {}
    }
    let widgetContext = poolInScope[widgetId]
    if (!widgetContext) {
      poolInScope[widgetId] = widgetContext = {}
    }
    widgetContext[contextKey] = contextValue
  }
}

/**
 * 批量设置控件上下文信息
 *
 * @param {String} widgetId 控件编号
 * @param {Object} context 控件上下文
 */
let putAll = function (widgetId: string, context: any) {
  //_destroy();
  for (let contextKey in context) {
    put(widgetId, contextKey, context[contextKey])
  }
}

/**
 * 获取控件上下文信息
 *
 * @param {String} widgetId 控件编号
 * @return {Object} 控件上下文
 */
let getAll = function (widgetId: string) {
  //		var scope = scopeManager.getWindowScope();
  let scope = scopeManager.getChildWindowScope()
  if (scope) {
    return scope.getWidget(widgetId)
  }
  //_destroy();
  let scopeId = scopeManager.getCurrentScopeId()
  let poolInScope = contextPool[scopeId]
  if (!poolInScope) {
    return null
  }
  let widgetContext = poolInScope[widgetId]
  if (!widgetContext) {
    return null
  } else {
    return widgetContext
  }
}

/**
 * 判断控件是否存在
 *
 * @param widgetId {String} 控件编号
 */
let isWidgetExist = function (widgetId: string) {
  //_destroy();
  return get(widgetId, 'Code') ? true : false
}

/**
 * 获取控件类型
 *
 * @param widgetId {String} 控件编号
 */
let getType = function (widgetId: string) {
  //_destroy();
  return get(widgetId, WIDGET_CONTEXT_TYPE)
}

/**
 * 获取控件存储类型
 *
 * @param widgetId {String} 控件编号
 */
let getStoreType = function (widgetId: string) {
  //_destroy();
  //return get(widgetId, WIDGET_CONTEXT_STORETYPE) 新增时会清空实体记录
  return 'set'
}

let getWidgetList = function () {
  //_destroy();
  return widgetRelation.getWidgetList()
}

const destroy = function (scopeId: string) {
  contextPool[scopeId] = null
  delete contextPool[scopeId]
}

export {
  COMPONENT_TYPE,
  destroy,
  get,
  getAll,
  getStoreType,
  getType,
  getWidgetList,
  isWidgetExist,
  put,
  putAll,
  WIDGET_CONTEXT_BUSINESSREF,
  WIDGET_CONTEXT_CODE,
  WIDGET_CONTEXT_EXTWIDGETIDRELA,
  WIDGET_CONTEXT_EXTWIDGETTYPERELA,
  WIDGET_CONTEXT_PROPERTY,
  WIDGET_CONTEXT_RAWTYPE,
  WIDGET_CONTEXT_RELATION,
  WIDGET_CONTEXT_RUNTIMEOBJECT,
  WIDGET_CONTEXT_STORETYPE,
  WIDGET_CONTEXT_TYPE
}
