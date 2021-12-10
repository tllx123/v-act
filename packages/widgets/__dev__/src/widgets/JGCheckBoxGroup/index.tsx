import { JGCheckBoxGroup } from '@v-act/jgcheckboxgroup'
import { JGComponent } from '@v-act/jgcomponent'

const checkBoxGroup = () => {
  return (
    <JGComponent>
      <JGCheckBoxGroup
        code="JGComboBox1"
        top="38px"
        left="19px"
        height="26px"
        width="200px"
        labelWidth="80px"
        labelText="复选框"
        multiWidth="300px"
      ></JGCheckBoxGroup>
    </JGComponent>
  )
}

export default checkBoxGroup
