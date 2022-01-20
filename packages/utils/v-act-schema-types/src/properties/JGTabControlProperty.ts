import { Property } from '../'

interface JGTabControlProperty extends Property {
  /**
   * 当前选中页
   */
  selectedIndex?: string
  /**
   * 页签头位置
   */
  alignment?: string
  /**
   * 使能
   */
  enabled?: string
  /**
   * 显示外观
   */
  tabAppearance?: string
}

export default JGTabControlProperty
