import { JGComponent } from '@v-act/jgcomponent'
import { JGImageCutter } from '@v-act/jgimagecutter'

const imageCutter = () => {
  return (
    <JGComponent>
      <JGImageCutter
        top={16}
        left={52}
        width={300}
        height={300}
      ></JGImageCutter>
    </JGComponent>
  )
}

export default imageCutter
