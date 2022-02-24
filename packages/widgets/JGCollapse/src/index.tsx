import {
  Control,
  JGCollapsePanelProperty,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import {
  JGCollapse,
  JGCollapsePanel,
  JGCollapsePanelProps,
  JGCollapseProps
} from './JGCollapse'

const JsonJGCollapse = function (props: {
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
  const pros = control.properties
  const props = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px')
  }
  const controls = control.controls
  const children: JSX.Element[] = []
  if (controls.length > 0) {
    controls.forEach((con) => {
      const properties: JGCollapsePanelProperty = con.properties
      children.push(
        <JGCollapsePanel key={properties.code} title={properties.title}>
          {render(con.controls)}
        </JGCollapsePanel>
      )
    })
  }
  return <JGCollapse {...props}>{children}</JGCollapse>
}

export {
  convert,
  JGCollapse,
  JGCollapsePanel,
  type JGCollapsePanelProps,
  type JGCollapseProps,
  JsonJGCollapse
}
