import Control from './Control'
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
}

export default Window
