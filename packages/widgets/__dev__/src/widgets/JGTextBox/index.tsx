import { JGTextBox } from '@v-act/jgtextbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGTextBox top="33px" left="57px" height="26px" width="59px">
        按钮1
      </JGTextBox>
      <JGTextBox top="65px" left="57px" height="26px" width="188px"></JGTextBox>
    </JGComponent>
  )
}

export default TextBox
