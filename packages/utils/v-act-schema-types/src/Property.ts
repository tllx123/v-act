import { Property } from 'csstype'
import ReactEnum from './ReactEnum'
import Dock from './Dock'
import Width from './Width'
import Height from './Height'

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
  multiWidth?: Width
  /**
   * 控件高度
   */
  multiHeight?: Height
  /**
   * 标题
   */
  labelText?: string
  /**
   * 上边距
   */
  top?: Property.Top

  /**
   * 左边距
   */
  left?: Property.Left

  /**
   * 泊靠
   */
  dock?: Dock
}

export default Property
