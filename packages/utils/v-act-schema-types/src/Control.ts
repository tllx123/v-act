import Property from './Property'
import JGQrcodeProperty from './JGQrcodeProperty'
/**
 * 控件定义
 */
interface Control {
  /**
   * 控件类型
   */
  type: string
  /**
   * 属性
   */
  properties: Property

  /**
   * 属性
   */
  jgqrcodeproperties: JGQrcodeProperty

  /**
   *
   * 子控件
   */
  controls: Array<Control>
}

export default Control
