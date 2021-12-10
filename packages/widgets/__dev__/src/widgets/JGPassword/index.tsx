import { JGPassword } from '@v-act/jgpassword'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGPassword top="10px" labelText="密码"></JGPassword>
    </JGComponent>
  )
}

export default TextBox
