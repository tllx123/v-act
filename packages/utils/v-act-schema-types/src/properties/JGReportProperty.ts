import Property from '../Property'

interface JGReportProperty extends Property {
  /**
   * 是否显示
   */
  visible?: string
  /**
   * 是否显示工具栏
   */
  isShowToolbar?: string
  /**
   * 只读
   */
  readOnly?: string
}

export default JGReportProperty
