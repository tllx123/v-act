import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
import { JGRadioGroup } from '@v-act/jgradiogroup'

const RdioGroup = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="534px"
        groupTitle="分组标题"
      >
        <JGRadioGroup
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGRadioGroup>
        <JGRadioGroup
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
        ></JGRadioGroup>
      </JGFormLayout>
      <JGRadioGroup
        top="30px"
        multiHeight="50px"
        multiWidth="170px"
        readOnly={true}
        isMust={true}
      ></JGRadioGroup>
    </JGComponent>
  )
}

export default RdioGroup
