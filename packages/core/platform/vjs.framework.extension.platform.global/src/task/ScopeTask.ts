import * as TaskManager from './TaskManager'

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let ScopeTask: any = function (
  scopeId: string,
  isAutoExe: boolean,
  handler: any,
  props: any
) {
  //@ts-ignore
  this.scopeId = scopeId
  //@ts-ignore
  this.autoExe = isAutoExe
  //@ts-ignore
  this.handler = handler
  //@ts-ignore
  this.props = props
  //@ts-ignore
  if (!this._registedHandler) {
    ScopeManager.on(ScopeManager.EVENTS.DESTROY, function (scopeId) {
      TaskManager.removeByFilter({ scopeId: scopeId })
    })
    ScopeTask.prototype._registedHandler = true
  }
}

ScopeTask.prototype = {
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
  setTaskId: function (taskId: string) {
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
  isMatch: function (properties: any) {
    let scopeId = properties.scopeId
    return this.scopeId == scopeId
  }
}

export default ScopeTask
