import { JGButton } from '@v-act/jgbutton'
import { JGComponent } from '@v-act/jgcomponent'
import { ContentAlignment, JGGroupPanel } from '@v-act/jggrouppanel'
import { ReactEnum } from '@v-act/schema-types'

//泊靠Top（内容靠左）
const GroupPanel = () => {
  return (
    <JGComponent width="100%" height="100%">
      <JGGroupPanel
        top="0px"
        left="0px"
        multiHeight="38px"
        contentAlignment={ContentAlignment.Horizontal}
        multiWidth={ReactEnum.Space}
      >
        <JGButton key="JGButton1" height="32px" width="59px">
          按钮1
        </JGButton>
      </JGGroupPanel>
    </JGComponent>
  )
}

export default GroupPanel
