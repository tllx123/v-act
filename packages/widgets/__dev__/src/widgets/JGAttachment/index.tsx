import { JGAttachment } from '@v-act/jgattachment'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGAttachment top="10px" labelText="文件"></JGAttachment>
    </JGComponent>
  )
}

export default TextBox
