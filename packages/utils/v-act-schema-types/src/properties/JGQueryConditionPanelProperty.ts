import { Property } from '../'

interface JGQueryConditionPanelProperty extends Property {
  /**
   * 启用工具栏
   */
  showToolbar?: string
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
}

export default JGQueryConditionPanelProperty
