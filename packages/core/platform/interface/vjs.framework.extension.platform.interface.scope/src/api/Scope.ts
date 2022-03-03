let uuid

/**
 * @namespace Scope
 * @class Scope
 * @desc 域定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.scope<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.scope.Scope<br/>
 * @author xiedh
 */
let Scope = function (instanceId) {
  this.instanceId = instanceId || uuid.generate()
  this.properties = {}
  this.listeners = {}
  this.handlers = {}
  //设置ProKeys属性，用来保存组件容器id
  this.ProKeys = {
    ContainerId: '_$ContainerId'
  }
}

Scope.prototype = {
  //设置ProKeys属性，用来保存组件容器id
  //		var ProKeys ={
  //				ContainerId:"_$ContainerId"
  //			},

  initModule: function (sBox) {
    if (sBox) uuid = sBox.getService('vjs.framework.extension.util.UUID')
  },

  /**
   * 获取实例id
   * @return String
   */
  getInstanceId: function () {
    return this.instanceId
  },

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set: function (key, val) {
    this.properties[key] = val
  },

  /**
   * 获取属性值
   * @param {String} key 属性名称
   * @return Any
   */
  get: function (key) {
    return this.properties[key]
  },
  /**
   * 设置组件容器的id
   *
   */
  setProKeys: function (key, val) {
    this.ProKeys[key] = val
  },
  /**
   * 获取组件容器的id
   *
   */
  getProKeys: function (key) {
    return this.ProKeys[key]
  },

  /**
   * 是否包含指定属性值
   * @param {String} key 属性名称
   * @return Boolean
   */
  has: function (key) {
    return this.properties.hasOwnProperty(key)
  },
  /**
   * 移除指定属性
   * @param {String} key 属性名称
   */
  remove: function (key) {
    if (this.has(key)) {
      delete this.properties[key]
    }
  },
  /**
   * 获取所有属性值
   * @return Object
   */
  getProperties: function () {
    let pros = {}
    for (let attr in this.properties) {
      if (this.properties.hasOwnProperty(attr)) {
        pros[attr] = this.properties[attr]
      }
    }
    return pros
  },

  /**
   * 注册事件回调
   * @param {@link ScopeManager#EVENTS|EVENTS} 事件名称
   * @param {Function} 事件回调
   */
  on: function (eventName, handler) {
    if (this.listeners.hasOwnProperty(eventName)) {
      this.listeners[eventName].push(handler)
    } else {
      let handlers = [handler]
      this.listeners[eventName] = handlers
    }
  },

  un: function (eventName, handler) {
    if (this.listeners.hasOwnProperty(eventName)) {
      let events = this.listeners
      for (let i = 0, len = this.listeners[eventName].length; i < len; i++) {
        if (handler === this.listeners[eventName][i]) {
          this.listeners[eventName].splice(i, 1)
          return true
        }
      }
    }
    return false
  },

  /**
   * 触发事件回调
   * @param {@link ScopeManager#EVENTS|EVENTS} eventName 事件名称
   */
  fire: function (eventName) {
    let handlers = this.listeners[eventName]
    if (handlers) {
      let args = Array.prototype.slice.call(arguments, 1)
      for (let i = 0, len = handlers.length; i < len; i++) {
        let handler = handlers[i]
        handler.apply(this, args)
      }
    }
  },
  /**
   * 注册实例域逻辑
   * @params {Object} params 参数信息
   * {
   * 		once : Boolean 是否只执行一次（执行一次后销毁）
   * 		handler:Function
   * }
   */
  registerHandler: function (params) {
    let id = uuid.generate()
    this.handlers[id] = {
      once: params.once,
      handler: params.handler
    }
    return id
  },

  exeHandler: function (id, args) {
    let cfg = this.handlers[id]
    if (cfg) {
      let handler = cfg.handler
      handler.apply(this, args)
      if (cfg.once) {
        this.handlers[id] = null
        try {
          delete this.handlers[id]
        } catch (e) {}
      }
    }
  },

  _markDestroyed: function () {
    this.destoryed = true
  },

  _isDestroyed: function () {
    return this.destoryed
  }
}

return Scope
