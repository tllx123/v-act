import ReactEnum from './ReactEnum'

interface dataHeader {
  code: string
  name: string
}

interface dataTreeHeader {
  title: string
  dataIndex: string
  key: string
}

/**
 * 控件属性
 */
interface Property {
  /**
   * 控件编码
   */
  alias?: string

  /**
   * 控件编码
   */
  code: string
  /**
   * 控件原始高度
   */
  height?: string
  /**
   * 控件原始宽度
   */
  width?: string
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
   * 水平位置（编组）
   */
  horizontalAlign?: string
  /**
   * 垂直位置（编组）
   */
  verticalAlign?: string
  /**
   * 列表数据
   */
  gridData?: any
  /**
   * 列表头数据
   */
  dataHeader?: Array<dataHeader>
  /**
   * 树表头数据
   */
  dataTreeHeader?: Array<dataTreeHeader>

  /**
   *边框颜色
   */
  boderColor?: string

  /**
   * 结束行
   */
  endRow?: string

  /**
   * 宽度
   */
  colSpan?: string

  /**
   * 数据来源
   */
  dropDownSource?: string

  /**
   * 是否显示边框
   */
  showBorder?: string

  /**
   * 是否hover展开菜单
   */
  expandWhenHover?: string

  isMore?: string

  /**
   * 图表设计
   */
  graphSettings?: string

  /**
   * 界面顺序号
   */
  tabIndex?: string

  /**
   * 是否必填
   */
  ismust?: string

  /**
   * 最大日期
   */
  maxDate?: string

  /**
   * 最小日期
   */
  minDate?: string

  /**
   * 日期模式
   */
  dateDisplay?: string
  /**
   * 行高
   */
  rowHeight?: string

  /**
   * 显示工具栏
   */
  showToolbar?: string
}

export default Property
