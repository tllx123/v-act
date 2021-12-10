import { JGIntegerBox } from '@v-act/jgintegerbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGIntegerBox
        top="10px"
        labelText="整数"
        inputType="integer"
      ></JGIntegerBox>
    </JGComponent>
  )
}

export default TextBox
