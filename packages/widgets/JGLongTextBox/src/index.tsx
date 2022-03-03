import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import JGLongTextBox from './JGLongTextBox'

const JsonJGLongTextBox = function (props: { control: Control }) {
  let propsTemp = useGetCompVal(props.control)
  return convert(props.control, propsTemp)
}

const convert = function (control: Control, propsTemp: Object): JSX.Element {
  return <JGLongTextBox {...propsTemp}></JGLongTextBox>
}

export { JGLongTextBox, JsonJGLongTextBox }
