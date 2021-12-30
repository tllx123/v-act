import { JGComponent } from '@v-act/jgcomponent'
import { JGRadioGroup } from '@v-act/jgradiogroup'

const RdioGroup = () => {
  return (
    <JGComponent>
      <JGRadioGroup
        top="107px"
        left="59px"
        multiWidth="474px"
        multiHeight="26px"
        readOnly={true}
        isMust={true}
      ></JGRadioGroup>
    </JGComponent>
  )
}

export default RdioGroup
