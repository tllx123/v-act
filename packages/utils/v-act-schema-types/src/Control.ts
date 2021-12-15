import Property from './Property'
import JGQrcodeProperty from './JGQrcodeProperty'
import JGBarcodeProperty from './JGBarcodeProperty'
import JGWebBrowserProperty from './JGWebBrowserProperty'
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
   * 二维码属性
   */
  jgqrcodeproperties: JGQrcodeProperty
  /**
   *条形码属性
   */
  JGBarcodeProperty: JGBarcodeProperty

  /**
   *网页属性
   */
  JGWebBrowserProperty: JGWebBrowserProperty
  /**
   *
   * 子控件
   */
  controls: Array<Control>
}

export default Control
