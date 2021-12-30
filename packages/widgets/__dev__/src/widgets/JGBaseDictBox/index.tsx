import { JGBaseDictBox } from '@v-act/jgbasedictbox'
import { JGComponent } from '@v-act/jgcomponent'

const BaseDictBox = () => {
  return (
    <JGComponent>
      <JGBaseDictBox
        top={27}
        left={20}
        multiHeight="26px"
        multiWidth="235px"
        labelText="弹出选择"
        labelVisible={true}
        readOnly={true}
      ></JGBaseDictBox>
    </JGComponent>
  )
}

export default BaseDictBox
