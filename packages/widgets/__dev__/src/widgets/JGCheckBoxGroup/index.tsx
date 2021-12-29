import { JGCheckBoxGroup } from '@v-act/jgcheckboxgroup'
import { JGComponent } from '@v-act/jgcomponent'

const checkBoxGroup = () => {
  return (
    <JGComponent>
      <JGCheckBoxGroup
        code="JGComboBox1"
        top="73px"
        left="59px"
        height="26px"
        width="150px"
        labelText="多选组"
        multiWidth="474px"
        multiHeight="26px"
      ></JGCheckBoxGroup>
    </JGComponent>
  )
}

export default checkBoxGroup
