import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import JGLongTextBox from './JGLongTextBox'

const JsonJGLongTextBox = function (props: { control: Control }): JSX.Element {
  let propsTemp: Object = useGetCompVal(props.control)
  return <JGLongTextBox {...propsTemp}></JGLongTextBox>
}

export { JGLongTextBox, JsonJGLongTextBox }
