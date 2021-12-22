import { Property } from 'csstype'

import { Height, Width } from '@v-act/schema-types'

import { JGHGroupPanel } from './JGHGroupPanel'
import { JGTableGroupPanel } from './JGTableGroupPanel'
import { JGVGroupPanel } from './JGVGroupPanel'

enum ContentAlignment {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
  Table = 'Table'
}

enum HorizontalAlign {
  Left = 'Left',
  Center = 'Center',
  Right = 'Right'
}

enum VerticalAlign {
  Top = 'Top',
  Middle = 'Middle',
  Bottom = 'Bottom'
}

interface Setting {
  key?: string
  index?: number
  horizontalAlign?: HorizontalAlign
  verticalAlign?: VerticalAlign
  colSpan?: number
  endRow?: boolean
  percentWidth?: string
  percentHeight?: string
}

interface JGGroupPanelProps {
  /**
   * 左边距
   */
  left?: Property.Left
  /**
   * 上边距
   */
  top?: Property.Top
  /**
   * 高度
   */
  multiHeight?: Height
  /**
   * 宽度
   */
  multiWidth?: Width
  /**
   * 分组标题
   */
  groupTitle?: string
  /**
   * 内容排列
   */
  contentAlignment?: ContentAlignment
  /**
   * 列数
   */
  numCols?: number
  /**
   * 布局设置
   */
  setting?: Setting[]
  /**
   * 布局位置
   */
  position?: string

  children?: JSX.Element[] | JSX.Element | null
}

const JGGroupPanel = function (props: JGGroupPanelProps) {
  const contentAlignment = props.contentAlignment || ContentAlignment.Horizontal
  if (contentAlignment === ContentAlignment.Horizontal) {
    return <JGHGroupPanel {...props}>{props.children}</JGHGroupPanel>
  } else if (contentAlignment === ContentAlignment.Vertical) {
    return <JGVGroupPanel {...props}>{props.children}</JGVGroupPanel>
  } else {
    return <JGTableGroupPanel {...props}>{props.children}</JGTableGroupPanel>
  }
}

JGGroupPanel.defaultProps = {
  top: '0px',
  left: '0px',
  multiWidth: '50px',
  multiHeight: '100px',
  contentAlignment: ContentAlignment.Horizontal,
  numCols: 3,
  setting: []
}

export default JGGroupPanel
export {
  ContentAlignment,
  HorizontalAlign,
  JGGroupPanel,
  type JGGroupPanelProps,
  type Setting,
  VerticalAlign
}
