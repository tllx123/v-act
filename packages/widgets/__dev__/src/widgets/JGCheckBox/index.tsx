import { JGCheckBox } from '@v-act/jgcheckbox'
import { JGComponent } from '@v-act/jgcomponent'
const checkbox = () => {
  return (
    <JGComponent>
      <JGCheckBox labeltext="超出省略号超出省略号" />
      <JGCheckBox labeltext="disabled" top={70} disabled />
      <JGCheckBox labeltext="只读" readonly={true} checked top={130} />

      <JGCheckBox height={200} width={400} top={210} labeltext="哇哈哈哈" />

      <JGCheckBox
        labeltext="加了padding"
        height={200}
        width={400}
        top={400}
        padding="20px 20px 20px 20px"
      />
    </JGComponent>
  )
}

export default checkbox
