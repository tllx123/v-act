import { JGCheckBoxGroup } from '@v-act/jgcheckboxgroup'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'

const checkBoxGroup = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="534px"
        groupTitle="分组标题"
      >
        <JGCheckBoxGroup
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGCheckBoxGroup>
        <JGCheckBoxGroup
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGCheckBoxGroup>
      </JGFormLayout>
      <JGCheckBoxGroup
        code="JGComboBox1"
        top="38px"
        left="19px"
        height="26px"
        width="150px"
        labelText="多选组"
        multiWidth="300px"
        multiHeight="80px"
      ></JGCheckBoxGroup>
    </JGComponent>
  )
}

export default checkBoxGroup
