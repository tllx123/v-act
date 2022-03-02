import { Control, WidgetRenderer } from '@v-act/schema-types'
import { getCompVal } from '@v-act/widget-utils'
import JGLongTextBox, { JGLongTextBoxProps } from './JGLongTextBox'

const JsonJGLongTextBox = function (props: { control: Control }) {
  let propsTemp = getCompVal(props.control)
  return convert(propsTemp)
}

const convert = function (propsTemp: Object): JSX.Element {
  const props: JGLongTextBoxProps = propsTemp
  return <JGLongTextBox {...props}></JGLongTextBox>
}

export { JGLongTextBox, JsonJGLongTextBox }
