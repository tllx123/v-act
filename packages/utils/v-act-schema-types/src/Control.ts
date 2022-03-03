import DataBinding from './DataBinding'
import Event from './Event'
import Property from './Property'

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
   *
   * 子控件
   */
  controls: Array<Control>

  /**
   * 工具栏(查询面板)
   */
  headerControls?: Control[]

  /**
   * 数据绑定
   */
  dataBindings?: DataBinding[]

  /**
   * 事件信息
   */
  events?: Event[]

  /**
   * 组件值
   */
  val?: any

  /**
   * 表名
   */
  tableName?: string | null

  /**
   * 列名
   */
  columnName?: string | null
}

export default Control
