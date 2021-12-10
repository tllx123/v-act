import ReactEnum from './ReactEnum'

/**
 * 控件属性
 */
interface Property {
  /**
   * 控件编码
   */
  code: string
  /**
   * 控件宽度
   */
  multiWidth?: string | ReactEnum
  /**
   * 控件高度
   */
  multiHeight?: string | ReactEnum
  /**
   * 标题
   */
  labelText?: string
  /**
   * 上边距
   */
  top?: string

  /**
   * 左边距
   */
  left?: string

  /**
   * 泊靠
   */
  dock?: string
  /**
   * 提示文字
   */
  hint?: string
  /**
   * 使能
   */
  enabled?: string
  /**
   * 只读
   */
  readOnly?: string
  /**
   * 显示
   */
  visible?: string
  /**
   * 必填
   */
  isMust?: string
  /**
   * 提醒文字
   */
  placeholder?: string
  /**
   * 标题宽度
   */
  labelWidth?: string
  /**
   * 是否显示标题
   */
  labelVisible?: string
  /**
   * 页签头位置
   */
  alignment?: string
  /**
   * 滚动条位置
   */
  scrollbarDir?: string
  /**
   * 页签显示风格
   */
  tabAppearance?: string
}

export default Property
