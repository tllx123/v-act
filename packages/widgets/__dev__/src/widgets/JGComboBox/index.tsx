import { JGComboBox } from '@v-act/jgcombobox'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'

const ComboBox = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="534px"
        groupTitle="分组标题"
      >
        <JGComboBox
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGComboBox>
        <JGComboBox
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGComboBox>
      </JGFormLayout>
      <JGComboBox
        code="JGComboBox2"
        top="30px"
        left="60px"
        height="50px"
        width="350px"
      ></JGComboBox>
    </JGComponent>
  )
}

export default ComboBox
