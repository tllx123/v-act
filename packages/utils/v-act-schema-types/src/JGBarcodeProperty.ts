import Property from './Property'

/**
 * 控件属性
 */

interface JGBarcodeProperty extends Property {
  /**
   * 条码类型
   */

  format: string

  /**
   * 是否显示文字
   */

  IsShowText?: boolean

  /**
   * 条形码内容
   */

  BarContent?: string
  /**
   * 条形码颜色
   */
  ForeColor?: string
  /**
   * 条形码背景色
   */
  BackColor?: string
}

export default JGBarcodeProperty
