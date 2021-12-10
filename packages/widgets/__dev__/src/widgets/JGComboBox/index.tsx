import { JGComboBox } from '@v-act/jgcombobox'
import { JGComponent } from '@v-act/jgcomponent'

const ComboBox = () => {
  const props1 = {
    code: 'JGComboBox1222222',
    top: '38px',
    left: '60px',
    height: '50px',
    width: '200px',
    labelWidth: '150px',
    labelText: '这是下拉框一',
    multiWidth: '350px',
    value: '10'
  }
  return (
    <JGComponent>
      {/* <JGComboBox code="JGComboBox1" top="38px" left="19px" height="26px" width='200px' labelWidth='50px' labelText="这是下拉框一" multiWidth="80%">
      </JGComboBox> */}
      {/* <JGComboBox {...props1}>
      </JGComboBox> */}
      <JGComboBox
        code="JGComboBox2"
        top="30px"
        left="60px"
        height="50px"
        width="350px"
        labelWidth="150px"
      ></JGComboBox>
    </JGComponent>
  )
}

export default ComboBox
