import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

/**
 * @namespace Scope
 * @class Scope
 * @desc 域定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.scope<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.scope.Scope<br/>
 * @author xiedh
 */
class Scope {
  instanceId: string = ''
  properties: { [propName: string]: any } = {}
  listeners: { [eventName: string]: Array<(...args: any[]) => void> } = {}
  handlers: {
    [id: string]: { once: boolean; handler: (...args: any[]) => void }
  } = {}
  //设置ProKeys属性，用来保存组件容器id
  ProKeys: { [propName: string]: string } = {
    ContainerId: '_$ContainerId'
  }
  destoryed: boolean = false

  constructor(instanceId: string | null) {
    this.instanceId = instanceId || uuid.generate()
  }

  /**
   * 获取实例id
   * @return String
   */
  getInstanceId() {
    return this.instanceId
  }

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set(key: string, val: any) {
    this.properties[key] = val
  }

  /**
   * 获取属性值
   * @param {String} key 属性名称
   * @return Any
   */
  get(key: string) {
    return this.properties[key]
  }
  /**
   * 设置组件容器的id
   *
   */
  setProKeys(key: string, val: string) {
    this.ProKeys[key] = val
  }
  /**
   * 获取组件容器的id
   *
   */
  getProKeys(key: string) {
    return this.ProKeys[key]
  }

  /**
   * 是否包含指定属性值
   * @param {String} key 属性名称
   * @return Boolean
   */
  has(key: string) {
    return this.properties.hasOwnProperty(key)
  }
  /**
   * 移除指定属性
   * @param {String} key 属性名称
   */
  remove(key: string) {
    if (this.has(key)) {
      delete this.properties[key]
    }
  }
  /**
   * 获取所有属性值
   * @return Object
   */
  getProperties() {
    let pros: { [proName: string]: any } = {}
    for (let attr in this.properties) {
      if (this.properties.hasOwnProperty(attr)) {
        pros[attr] = this.properties[attr]
      }
    }
    return pros
  }

  /**
   * 注册事件回调
   * @param {@link ScopeManager#EVENTS|EVENTS} 事件名称
   * @param {Function} 事件回调
   */
  on(eventName: string, handler: () => void) {
    if (this.listeners.hasOwnProperty(eventName)) {
      this.listeners[eventName].push(handler)
    } else {
      let handlers = [handler]
      this.listeners[eventName] = handlers
    }
  }

  un(eventName: string, handler: () => void) {
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
  }

  /**
   * 触发事件回调
   * @param {@link ScopeManager#EVENTS|EVENTS} eventName 事件名称
   */
  fire(eventName: string, ...args: any[]) {
    let handlers = this.listeners[eventName]
    if (handlers) {
      let args: Array<any> = Array.prototype.slice.call(arguments, 1)
      for (let i = 0, len = handlers.length; i < len; i++) {
        let handler = handlers[i]
        handler.apply(this, args)
      }
    }
  }
  /**
   * 注册实例域逻辑
   * @params {Object} params 参数信息
   * {
   * 		once : Boolean 是否只执行一次（执行一次后销毁）
   * 		handler:Function
   * }
   */
  registerHandler(params: {
    once: boolean
    handler: (...args: any[]) => void
  }) {
    let id = uuid.generate()
    this.handlers[id] = {
      once: params.once,
      handler: params.handler
    }
    return id
  }

  exeHandler(id: string, args: Array<any>) {
    let cfg = this.handlers[id]
    if (cfg) {
      let handler = cfg.handler
      handler.apply(this, args)
      if (cfg.once) {
        try {
          delete this.handlers[id]
        } catch (e) {}
      }
    }
  }

  _markDestroyed() {
    this.destoryed = true
  }

  _isDestroyed() {
    return this.destoryed
  }
}

export default Scope
