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
  /**
   * 列数
   */
  numCols?: string
  /**
   * 标题宽度（表单布局）
   */
  titleWidth?: string
  /**
   * 分组标题
   */
  groupTitle?: string
  /**
   * 背景色
   */
  backColor?: string
  /**
   * 默认展开(查询面板)
   */
  defaultExpand?: string
  /**
   * 查询按钮标题（查询面板）
   */
  queryButtonText?: string
  /**
   * 列数(查询面板)
   */
  columnCount?: string
  /**
   * 标题宽度(查询面板)
   */
  itemLabelWidth?: string
  /**
   * 快速检索（查询面板）
   */
  searchBoxEnabled?: string
  /**
   * 工具栏设置（查询面板）
   */
  toolbarSetting?: string
  /**
   * 内容排列(编组)
   */
  contentAlignment?: string
  /**
   * 水平位置（编组）
   */
  horizontalAlign?: string
  /**
   * 垂直位置（编组）
   */
  verticalAlign?: string
}

export default Property
