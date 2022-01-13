import Action from './Action'
import Control from './Control'
import Entity from './Entity'
import MasterPage from './MasterPage'
import Property from './Property'

/**
 * 窗体定义
 */
interface Window {
  /**
   * 控件类型
   */
  type: string
  /**
   * 属性
   */
  properties: Property
  /**
   * 子控件
   */
  controls: Array<Control>
  /**
   * 实体
   */
  entities?: Array<Entity>
  /**
   * 原型动作
   */
  prototype?: Action[]
  /**
   * 框架模板
   */
  masterPage?: MasterPage
}

export default Window
