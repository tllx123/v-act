import {
  Control,
  WidgetRenderContext,
  WidgetRenderer
} from '@v-act/schema-types'
import {
  getColumnName,
  getTableName,
  toBoolean,
  toNumber,
  valueofHeight,
  valueofWidth
} from '@v-act/widget-utils'

import JGComponentContainer, {
  JGComponentContainerProps
} from './JGComponentContainer'

const JsonJGComponentContainer = function (props: {
  control: Control
  render: WidgetRenderer
  componentCode: string
  context: WidgetRenderContext
}) {
  return convert(props.control)
}

const convert = function (control: Control): JSX.Element {
  console.log(control.properties.labelText)
  console.log('control')
  console.log(control)

  const pros = control.properties

  const props: JGComponentContainerProps = {
    top: toNumber(pros.top) + 'px',
    left: toNumber(pros.left) + 'px',
    width: valueofWidth(pros.multiWidth, '235px'),
    height: valueofHeight(pros.multiHeight, '26px'),
    bodercolor: pros.boderColor,
    visible: toBoolean(pros.visible, true),
    tableName: getTableName(control),
    columnName: getColumnName(control),
    control: control
  }
  return <JGComponentContainer {...props}></JGComponentContainer>
}

export { convert, JGComponentContainer, JsonJGComponentContainer }
