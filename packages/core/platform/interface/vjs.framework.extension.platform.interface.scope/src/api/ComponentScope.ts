import * as Scope from './api/Scope'

let undefined

let ComponentScope = function (instanceId, componentCode) {
  Scope.call(this, instanceId)
  this.properties[this.Keys.componentCode] = componentCode
}

/**
 * @namespace ComponentScope
 * @class ComponentScope
 * @extends Scope
 * @desc 构件域<br/>
 * vjs名称:vjs.framework.extension.platform.interface.scope<br/>
 * 该定义无法直接创建,请通过域管理器创建({@link ScopeManager#createComponentScope|ScopeManager})
 * @author xiedh
 */
ComponentScope.prototype = {
  Keys: {
    componentCode: 'componentCode'
  },

  initModule: function (sb) {
    var initFunc = Scope.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(Scope.prototype)
    prototype.constructor = ComponentScope
    sb.util.object.extend(prototype, ComponentScope.prototype)
    ComponentScope.prototype = prototype
  },

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set: function (key, val) {
    /*if(this.Keys.hasOwnProperty(key)){
            throw Error("[ComponentScope.set]"+key+"为内部属性，无法设置，请更改属性名称！");
        }*/
    this.properties[key] = val
  },

  /**
   *  获取构件编号
   * @return String
   */
  getComponentCode: function () {
    return this.get(this.Keys.componentCode)
  }
}

return ComponentScope
