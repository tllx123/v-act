import { JGComponent } from '@v-act/jgcomponent'
import { JGDropdownMenu } from '@v-act/jgdropdownmenu'

const TextBox = () => {
  return (
    <JGComponent>
      <JGDropdownMenu top="10px" children={true} left="10px"></JGDropdownMenu>
    </JGComponent>
  )
}

export default TextBox
