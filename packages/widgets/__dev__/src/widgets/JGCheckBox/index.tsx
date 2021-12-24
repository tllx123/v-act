import { JGCheckBox } from '@v-act/jgcheckbox'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const checkbox = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="800px"
        groupTitle="分组标题"
      >
        <JGCheckBox labeltext="超出省略号超出省略号" />
        <JGCheckBox labeltext="disabled" top={70} disabled />
        <JGCheckBox labeltext="只读" readonly={true} checked top={130} />
        <JGCheckBox height={200} width={400} top={210} labeltext="哇哈哈哈" />
      </JGFormLayout>
    </JGComponent>
  )
}

export default checkbox
