import { JGFloatBox } from '@v-act/jgfloatbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGFloatBox top="10px" labelText="整数" inputType="integer"></JGFloatBox>
    </JGComponent>
  )
}

export default TextBox
