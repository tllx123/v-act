import Property from './Property'

/**
 * 控件定义
 */
interface Control {
  /**
   * 属性
   */
  properties: Property
  /**
   * 子控件
   */
  controls: Array<Control>
}

export default Control
