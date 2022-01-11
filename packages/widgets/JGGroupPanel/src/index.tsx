import { Control, JGGroupPanelProperty, ReactEnum } from '@v-act/schema-types'
import {
  isPercent,
  toCssAxisVal,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import {
  ContentAlignment,
  HorizontalAlign,
  JGGroupPanel,
  JGGroupPanelProps,
  Setting,
  VerticalAlign
} from './JGGroupPanel'

const convert = function (
  control: Control,
  render: (controls: Array<Control>) => JSX.Element[] | null
): JSX.Element {
  const pros = control.properties as JGGroupPanelProperty
  const settings: Setting[] = []
  const props: JGGroupPanelProps = {
    top: toCssAxisVal(pros.top, '0px'),
    left: toCssAxisVal(pros.left, '0px'),
    multiWidth: valueofWidth(pros.multiWidth, ReactEnum.Space),
    multiHeight: valueofHeight(pros.multiHeight, ReactEnum.Space),
    numCols: toNumber(pros.numCols, 3),
    groupTitle: pros.groupTitle || '',
    contentAlignment:
      pros.contentAlignment == 'Vertical'
        ? ContentAlignment.Vertical
        : pros.contentAlignment == 'Horizontal'
        ? ContentAlignment.Horizontal
        : ContentAlignment.Table,
    setting: settings
  }
  const isTableLayout = pros.contentAlignment == 'Table'
  const isVerticalLayout = pros.contentAlignment == 'Vertical'
  const isHorizontalLayout = pros.contentAlignment == 'Horizontal'
  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con, index) => {
      const childProps = con.properties
      const setting: Setting = {
        //key: childProps.code,
        index: index,
        horizontalAlign:
          childProps.horizontalAlign == 'Center'
            ? HorizontalAlign.Center
            : childProps.horizontalAlign == 'Right'
            ? HorizontalAlign.Right
            : HorizontalAlign.Left,
        verticalAlign:
          childProps.verticalAlign == 'Middle'
            ? VerticalAlign.Middle
            : childProps.verticalAlign == 'Bottom'
            ? VerticalAlign.Bottom
            : VerticalAlign.Top
      }
      if (isTableLayout) {
        //网格中，所有控件宽度按空间自适应
        childProps.multiWidth = ReactEnum.Space.toString()
      }
      if (isVerticalLayout) {
        //垂直排列，所有子控件宽度空间自适应
        childProps.multiWidth = ReactEnum.Space.toString()
      }
      if (isHorizontalLayout) {
        //水平排列，所有子控件高度空间自适应
        childProps.multiHeight = ReactEnum.Space.toString()
      }
      if (isPercent(childProps.multiWidth)) {
        setting.percentWidth = childProps.multiWidth
        childProps.multiWidth = ReactEnum.Space.toString()
      }
      if (isPercent(childProps.multiHeight)) {
        setting.percentHeight = childProps.multiHeight
        childProps.multiHeight = ReactEnum.Space.toString()
      }

      settings.push(setting)
    })
  }
  return <JGGroupPanel {...props}>{render(controls)}</JGGroupPanel>
}

export default JGGroupPanel

export {
  ContentAlignment,
  convert,
  HorizontalAlign,
  JGGroupPanel,
  VerticalAlign
}
