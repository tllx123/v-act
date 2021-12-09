import { JGFloatBox } from '@v-act/jgfloatbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGFloatBox top="10px" labelText="小数"></JGFloatBox>
    </JGComponent>
  )
}

export default TextBox
