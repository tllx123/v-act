import { JGBaseDictBox } from '@v-act/jgbasedictbox'
import { JGComponent } from '@v-act/jgcomponent'

const BaseDictBox = () => {
  return (
    <JGComponent>
      <JGBaseDictBox
        top={33}
        left={57}
        multiHeight="26px"
        multiWidth="235px"
        labelText="弹出选择"
        labelVisible={true}
      ></JGBaseDictBox>
      <JGBaseDictBox
        top={66}
        left={57}
        multiHeight="88px"
        multiWidth="500px"
        labelText="弹出选择"
        labelVisible={true}
      ></JGBaseDictBox>
    </JGComponent>
  )
}

export default BaseDictBox
