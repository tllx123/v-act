import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

import * as Observer from './Observer'

/**
 * @class CurrentRecordObserver
 * @extends Observer
 * @constructs
 * @param {String} dsName 数据源名称
 * @param {String} widgetCode 控件编号
 * @param {Object} pros 属性信息
 * @param {Array<String>} fieldCodes 字段编号
 * @desc 当前行记录观察者<br/>
 * vjs名称：vjs.framework.extension.platform.interface.observer<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.observer.CurrentRecordObserver<br/>
 */
let CurrentRecordObserver = function (dsName, widgetCode, pros, fieldCodes) {
  this.fieldCodes = fieldCodes
  this.setValueHandler = null
  this.clearValueHandler = null
  Observer.call(this, dsName, widgetCode, pros)
}

CurrentRecordObserver.prototype = {
  initModule: function (sb) {
    var initFunc = Observer.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(Observer.prototype)
    prototype.constructor = CurrentRecordObserver
    sb.util.object.extend(prototype, CurrentRecordObserver.prototype)
    CurrentRecordObserver.prototype = prototype
  },
  /**
   * 设置控件值回调
   * @param {Function} handler 设置控件值回调
   * handler参数列表：1、Record
   */
  setWidgetValueHandler: function (handler) {
    this.setValueHandler = this.getScopeHandler(handler)
  },
  /**
   * 清空控件值回调
   * @param {Function} handler 清空控件值回调
   */
  clearWidgetValueHandler: function (handler) {
    this.clearValueHandler = this.getScopeHandler(handler)
  },

  /**
   * @private
   * 触发回调
   * @param {Object} params
   * {
   * 		"eventName": {@link Datasource#Events|Events} 数据源事件
   * 		"resultSet": {ResultSet} 结果集
   * }
   */
  fire: function (params) {
    let eventName = params.eventName
    switch (eventName) {
      case Datasource.Events.LOAD:
        this.loadAction(params)
        break
      case Datasource.Events.UPDATE:
        this.updateAction(params)
        break
      case Datasource.Events.DELETE:
        this._fireHandler(this.clearValueHandler)
        break
      case Datasource.Events.CURRENT:
        this._fireHandler(this.setValueHandler, params.currentRecord)
        break
    }
  },

  loadAction: function (params) {
    let isAppend = params.isAppend
    if (!isAppend) {
      //如果以覆盖的方式加载数据,则需要清空当前控件的值
      this._fireHandler(this.clearValueHandler)
    }
  },

  updateAction: function (params) {
    let rs = params.resultSet
    let iterator = rs.iterator()
    let ds = params.datasource
    while (iterator.hasNext()) {
      let rd = iterator.next()
      if (ds.isCurrentRecord({ record: rd }) && this.hasChanged(rd)) {
        this._fireHandler(this.setValueHandler, rd)
        break
      }
    }
  },

  _fireHandler: function (handler, params) {
    if (typeof handler == 'function') {
      handler.call(this, params)
    }
  },

  hasChanged: function (record) {
    let changedData = record.getChangedData()
    if (changedData) {
      if (!this.fieldCodes) return true //没有指定关注字段,则关注整行
      for (let i = 0, len = this.fieldCodes.length; i < len; i++) {
        if (changedData.hasOwnProperty(this.fieldCodes[i])) {
          return true
        }
      }
    }
    return false
  }
}

export default CurrentRecordObserver
