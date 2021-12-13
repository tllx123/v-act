import { JGNavigator } from '@v-act/jgnavigator'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGNavigator top="10px" children={true} left="10px"></JGNavigator>
    </JGComponent>
  )
}

export default TextBox
