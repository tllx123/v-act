import Control from './Control'
import Entity from './Entity'
import Property from './Property'

/**
 * 窗体定义
 */
interface Window {
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
}

export default Window
