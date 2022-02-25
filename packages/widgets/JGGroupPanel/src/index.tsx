import React from 'react'

import {
  Control,
  JGGroupPanelProperty,
  ReactEnum,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  isAbsoluteVal,
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

const JsonJGGroupPanel = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control, props.render)
}

const convert = function (
  control: Control,
  render: WidgetRenderer
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
      } else {
        if (isPercent(childProps.multiWidth)) {
          setting.width = childProps.multiWidth
          childProps.multiWidth = ReactEnum.Space.toString()
        } else if (isAbsoluteVal(childProps.multiWidth)) {
          setting.width = childProps.multiWidth
        } else if (childProps.multiWidth == ReactEnum.Space.toString()) {
          setting.width = '100%'
        }
        if (isPercent(childProps.multiHeight)) {
          setting.height = childProps.multiHeight
          childProps.multiHeight = ReactEnum.Space.toString()
        } else if (isAbsoluteVal(childProps.multiHeight)) {
          setting.height = childProps.multiHeight
        } else if (childProps.multiHeight == ReactEnum.Space.toString()) {
          setting.height = '100%'
        }
        if (isVerticalLayout) {
          //垂直排列，所有子控件宽度空间自适应
          childProps.multiWidth = ReactEnum.Space.toString()
          setting.width = '100%'
        }
        if (isHorizontalLayout) {
          //水平排列，所有子控件高度空间自适应
          childProps.multiHeight = ReactEnum.Space.toString()
          setting.height = '100%'
        }
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
  JsonJGGroupPanel,
  VerticalAlign
}
