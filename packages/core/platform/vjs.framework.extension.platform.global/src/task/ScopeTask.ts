import * as TaskManager from './task/TaskManager'

let ScopeManager

let ScopeTask = function (scopeId, isAutoExe, handler, props) {
  this.scopeId = scopeId
  this.autoExe = isAutoExe
  this.handler = handler
  this.props = props
  if (!this._registedHandler) {
    ScopeManager.on(ScopeManager.EVENTS.DESTROY, function () {
      let scopeId = this.getCurrentScopeId()
      TaskManager.removeByFilter({ scopeId: scopeId })
    })
    ScopeTask.prototype._registedHandler = true
  }
}

ScopeTask.prototype = {
  initModule: function (sb) {
    if (sb) {
      ScopeManager = sb.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
    }
  },

  _registedHandler: false,
  /**
   *执行任务
   * @return Object
   */
  execute: function () {
    if (typeof this.handler == 'function') {
      try {
        ScopeManager.openScope(this.scopeId)
        return this.handler.apply(this, arguments)
      } finally {
        ScopeManager.closeScope()
      }
    }
  },
  /**
   *获取任务属性
   * @return Object
   */
  getProperties: function () {
    return this.props
  },

  /**
   *是否自动执行
   * @return Boolean
   */
  isAutoExe: function () {
    return this.autoExe
  },
  /**
   * 设置任务id
   * @param {String} 任务id
   */
  setTaskId: function (taskId) {
    this.id = taskId
  },

  /**
   *获取任务id
   * @return String
   */
  getTaskId: function () {
    return this.id
  },
  /**
   * 根据属性值判断任务是否匹配
   * @param {Object} properties
   */
  isMatch: function (properties) {
    let scopeId = properties.scopeId
    return this.scopeId == scopeId
  }
}

return ScopeTask

export {
  addRuleSetInputs,
  getRuleSetInputs,
  exists,
  getRuleSetInput,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded,
  addComponentRouteInfo,
  getRouteConfig,
  addComponentVariantDefines,
  getComponentVariantDefine,
  addComponentOptionDefines,
  getComponentOptionDefine,
  destroy,
  componentIsLoaded,
  markForComponentLoaded,
  componentIsInited,
  markForComponentInited,
  setComponentType,
  getComponentType,
  init,
  existMapping,
  getMapping,
  init,
  loadIcons
}
