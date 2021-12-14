import Property from './Property'

/**
 * 控件属性
 */

type RenderType = 'canvas' | 'svg' | undefined

interface JGQrcodeProperty extends Property {
  /**
   * 二维码内容
   */

  QRContent: string

  /**
   * 渲染方式
   */

  RenderType?: RenderType

  /**
   * 是否显示二维码文本
   */

  IsText?: string
  /**
   * 二维码背景颜色
   */

  BackColor?: string

  /**
   * 纠错等级
   */
  CorrectLevel?: 'L' | 'M' | 'Q' | 'H' | undefined

  /**
   * 前景色
   */

  ForeColor?: string
}

export default JGQrcodeProperty
