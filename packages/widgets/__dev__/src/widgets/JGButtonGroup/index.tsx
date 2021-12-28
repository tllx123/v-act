import { JGButtonGroup } from '@v-act/jgbuttongroup'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const buttongroup = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="800px"
        groupTitle="分组标题"
      >
        <JGButtonGroup />
        <JGButtonGroup />
        <JGButtonGroup />
      </JGFormLayout>
    </JGComponent>
  )
}

export default buttongroup
