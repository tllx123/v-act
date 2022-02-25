import {
  Control,
  ReactEnum,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import { toNumber, valueofHeight, valueofWidth } from '@v-act/widget-utils'

import { JGFormLayout, JGFormLayoutProps, Setting } from './JGFormLayout'

const JsonJGFormLayout = function (props: {
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
  const settings: Setting[] = []
  const props: JGFormLayoutProps = {
    top: toNumber(pros.top),
    left: toNumber(pros.left),
    numCols: toNumber(pros.numCols, 3),
    groupTitle: pros.groupTitle || '',
    titleWidth: pros.titleWidth ? pros.titleWidth : ReactEnum.Content,
    multiWidth: valueofWidth(pros.multiWidth, '235px'),
    multiHeight: valueofHeight(pros.multiHeight, ReactEnum.Content),
    setting: settings
  }
  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con, index) => {
      const childProps = con.properties
      const setting: Setting = {
        index: index,
        colSpan: childProps.colSpan ? parseInt(childProps.colSpan) : 1,
        endRow: childProps.endRow == 'True' ? true : false
      }
      settings.push(setting)
    })
  }
  return (
    <JGFormLayout {...props}>
      {control.controls ? render(control.controls) : null}
    </JGFormLayout>
  )
}

export default JGFormLayout

export { convert, JGFormLayout, JsonJGFormLayout }
