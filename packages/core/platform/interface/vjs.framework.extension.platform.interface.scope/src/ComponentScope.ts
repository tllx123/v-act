import Scope from './Scope'

/**
 * @namespace ComponentScope
 * @class ComponentScope
 * @extends Scope
 * @desc 构件域<br/>
 * vjs名称:vjs.framework.extension.platform.interface.scope<br/>
 * 该定义无法直接创建,请通过域管理器创建({@link ScopeManager#createComponentScope|ScopeManager})
 * @author xiedh
 */
class ComponentScope extends Scope {
  Keys = {
    componentCode: 'componentCode'
  }

  constructor(instanceId: string, componentCode: string) {
    super(instanceId)
    this.properties[this.Keys.componentCode] = componentCode
  }

  /**
   * 设置属性值
   * @param {String} key 属性名称
   * @param {Any} val 属性值
   */
  set(key: string, val: any) {
    /*if(this.Keys.hasOwnProperty(key)){
            throw Error("[ComponentScope.set]"+key+"为内部属性，无法设置，请更改属性名称！");
        }*/
    this.properties[key] = val
  }

  /**
   *  获取构件编号
   * @return String
   */
  getComponentCode() {
    return this.get(this.Keys.componentCode)
  }
}

export default ComponentScope
