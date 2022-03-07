import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import * as ObserverData from './ObserverData'

/**
 * @class Observer
 * @desc 前端数据观察者<br/>
 * vjs名称：vjs.framework.extension.platform.interface.observer<br/>
 */
let Observer = function (dsName, widgetCode, pros) {
  this.instanceId = null
  this.datasourceName = dsName
  this.widgetCode = widgetCode
  this.pros = pros
  this.async = true //是否是异步观察者
  this.observers = {}
}

Observer.prototype = {
  initModule: function (sb) {
    Observer.prototype.Events = Datasource.Events
  },
  /**
   * 设置是否异步观察者
   * */
  setAsync: function (isAsync) {
    if (typeof isAsync == 'boolean' && !isAsync) {
      this.async = false
    } else {
      this.async = true
    }
  },

  /**
   * 观察者是否是异步
   * */
  isAsync: function () {
    return this.async
  },

  /**
   * 添加回调
   * @param {Object} params
   * {
   * 		"actions": Array<Observer.Events> 事件
   * 		"handler": {Function} 回调
   *
   * }
   */
  add: function (params) {
    let actions = params.actions,
      handler = params.handler
    for (let i = 0, len = actions.length; i < len; i++) {
      this.observers[actions[i]] = handler
    }
  },

  /**
   * 触发回调
   * @param {Object} params
   * {
   * 		"action": {Observer.Events} 数据源事件
   * 		"resultSet": {ResultSet} 结果集
   * }
   */
  fire: function (params) {
    let action = params.action
    let data = new ObserverData(action, params.resultSet)
    let handler = this.observers[action]
    if (handler) {
      handler.call(this, data)
    }
  },
  getScopeHandler: function (handler) {
    let result = scopeManager.createScopeHandler({
      handler: handler,
      callObject: this
    })
    return result
  },
  /**
   * 获取数据源名称
   * @return String
   */
  getDatasourceName: function () {
    return this.datasourceName
  },
  /**
   * 获取控件编号
   * @return String
   */
  getWidgetCode: function () {
    return this.widgetCode
  },
  /**
   * 设置实例id
   * @param {Object} id
   */
  setInstanceId: function (id) {
    this.instanceId = id
  },
  /**
   *  获取实例id
   * @param {Object} id
   */
  getInstanceId: function () {
    return this.instanceId
  }
}

return Observer
