import { JGButton } from '@v-act/jgbutton'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
import { ContentAlignment, JGGroupPanel } from '@v-act/jggrouppanel'
import { JGTextBox } from '@v-act/jgtextbox'
import { ReactEnum } from '@v-act/schema-types'

//泊靠Top（内容1靠左，内容2靠上）
const GroupPanel = () => {
  return (
    <JGComponent width="100%" height="100%">
      <JGGroupPanel
        contentAlignment={ContentAlignment.Vertical}
        multiHeight={ReactEnum.Space}
        multiWidth={ReactEnum.Space}
      >
        <JGGroupPanel multiHeight="34px" multiWidth={ReactEnum.Space}>
          <JGFormLayout multiHeight="34px" multiWidth={ReactEnum.Space}>
            <JGTextBox
              multiHeight="34px"
              multiWidth="188px"
              labelText="文本"
            ></JGTextBox>
            <JGTextBox
              multiHeight="34px"
              multiWidth="188px"
              labelText="文本"
            ></JGTextBox>
            <JGTextBox
              multiHeight="34px"
              multiWidth="188px"
              labelText="文本"
            ></JGTextBox>
          </JGFormLayout>
        </JGGroupPanel>
        <JGGroupPanel
          multiHeight={ReactEnum.Space}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="100%" width="235px">
            树
          </JGButton>
          <JGGroupPanel
            contentAlignment={ContentAlignment.Vertical}
            multiHeight={ReactEnum.Content}
            multiWidth={ReactEnum.Space}
          >
            <JGButton key="JGButton2" height="150px" width="100%">
              列表
            </JGButton>
          </JGGroupPanel>
        </JGGroupPanel>
      </JGGroupPanel>
    </JGComponent>
  )
}

export default GroupPanel
