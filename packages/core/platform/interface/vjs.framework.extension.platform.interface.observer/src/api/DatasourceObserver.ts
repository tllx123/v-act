import * as ObserverData from './api/ObserverData'
import * as Observer from './api/Observer'
import { Datasource as Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

let undefined

/**
 * @class DatasourceObserver
 * @extends Observer
 * @constructors
 * @param {String} dsName 数据源名称
 * @param {String} widgetCode 控件编号
 * @param {Object} pros 属性信息
 * @desc 数据源观察者<br/>
 *  vjs名称：vjs.framework.extension.platform.interface.observer<br/>
 *  vjs服务名称：vjs.framework.extension.platform.interface.observer.DatasourceObserver<br/>
 */
let DatasourceObserver = function (dsName, widgetCode, pros) {
  this.loadHandler = null
  this.insertHandler = null
  this.updateHandler = null
  this.removeHandler = null
  this.currentHandler = null
  this.selectHandler = null
  this.fetchHandler = null
  this.fetchedHandler = null
  Observer.call(this, dsName, widgetCode, pros)
}

DatasourceObserver.prototype = {
  initModule: function (sb) {
    var initFunc = Observer.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(Observer.prototype)
    prototype.constructor = DatasourceObserver
    sb.util.object.extend(prototype, DatasourceObserver.prototype)
    DatasourceObserver.prototype = prototype
  },
  /**
   * 设置加载回调
   * @param {Function} handler 加载回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"resultSet": {@link ResultSet} 记录结果集,
   * 		"isAppend": Boolean 是否已附加方式加载,
   * 		"dataAmount":Integer 总记录数（后台记录数，非前端实体记录数）,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setLoadHandler: function (handler) {
    this.loadHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置新增回调
   * @param {Function} handler 新增回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"resultSet": {@link ResultSet} 记录结果集,
   * 		"datasource": {@link Datasource} 前端实体,
   * 		"position": {@link Datasource#Position|Position} 新增位置
   * }
   */
  setInsertHandler: function (handler) {
    this.insertHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置更新回调
   * @param {Function} handler 更新回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"resultSet": {@link ResultSet} 更新后记录结果集,,
   * 		"oldResultSet": {@link ResultSet} 更新前记录结果集,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setUpdateHandler: function (handler) {
    this.updateHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置删除回调
   * @param {Function} handler 删除回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"resultSet": {@link ResultSet} 删除记录结果集,,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setRemoveHandler: function (handler) {
    this.removeHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置当前行切换回调
   * @param {Function} handler 当前行切换回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"currentRecord": {@link Record} 当前行记录,
   * 		"preCurrentRecord": {@link Record} 切换前当前行记录,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setCurrentRecordHandler: function (handler) {
    this.currentHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置选择行回调
   * @param {Function} handler 选择行回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"resultSet": {@link ResultSet} 记录结果集,
   * 		"isSelect": Boolean 是否选中,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setSelectRecordHandler: function (handler) {
    this.selectHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置获取数据前回调
   * @param {Function} handler 获取数据前回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setFetchHandler: function (handler) {
    this.fetchHandler = this.getScopeHandler(handler)
  },
  /**
   * 设置获取数据后回调
   * @param {Function} handler 获取数据前回调
   * handler参数：{
   * 		"eventName": {@link Datasource#Events|Events} 事件名称,
   * 		"datasource": {@link Datasource} 前端实体
   * }
   */
  setFetchedHandler: function (handler) {
    this.fetchedHandler = this.getScopeHandler(handler)
  },
  /**
   * @private
   * 触发回调
   * @param {Object} params
   * {
   * 		"eventName": {Datasource.Events} 数据源事件
   * 		"resultSet": {ResultSet} 结果集
   * }
   */
  fire: function (params) {
    let eventName = params.eventName
    switch (eventName) {
      case Datasource.Events.LOAD:
        this._fireHandler(this.loadHandler, params)
        break
      case Datasource.Events.INSERT:
        this._fireHandler(this.insertHandler, params)
        break
      case Datasource.Events.UPDATE:
        this._fireHandler(this.updateHandler, params)
        break
      case Datasource.Events.DELETE:
        this._fireHandler(this.removeHandler, params)
        break
      case Datasource.Events.CURRENT:
        this._fireHandler(this.currentHandler, params)
        break
      case Datasource.Events.SELECT:
        this._fireHandler(this.selectHandler, params)
        break
      case Datasource.Events.FETCH:
        this._fireHandler(this.fetchHandler, params)
        break
      case Datasource.Events.FETCHED:
        this._fireHandler(this.fetchedHandler, params)
        break
    }
  },
  /**
   * @private
   * 触发控件回调
   * @param {Object} handler
   * @param {Object} params
   */
  _fireHandler: function (handler, params) {
    if (typeof handler == 'function') {
      handler.call(this, params)
    }
  }
}

return DatasourceObserver
