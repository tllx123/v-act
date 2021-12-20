import { JGButton } from '@v-act/jgbutton'
import { JGComponent } from '@v-act/jgcomponent'
import {
  ContentAlignment,
  HorizontalAlign,
  JGGroupPanel,
  VerticalAlign
} from '@v-act/jggrouppanel'

const GroupPanel = () => {
  return (
    <JGComponent>
      <JGGroupPanel
        top="0px"
        left="0px"
        multiHeight="450px"
        contentAlignment={ContentAlignment.Vertical}
        setting={[
          {
            key: 'JGButton1',
            horizontalAlign: HorizontalAlign.Center,
            verticalAlign: VerticalAlign.Bottom
          },
          {
            key: 'JGButton2',
            horizontalAlign: HorizontalAlign.Left,
            verticalAlign: VerticalAlign.Top
          },
          {
            key: 'JGButton3',
            horizontalAlign: HorizontalAlign.Right,
            verticalAlign: VerticalAlign.Middle
          },
          {
            key: 'JGButton4',
            horizontalAlign: HorizontalAlign.Left,
            verticalAlign: VerticalAlign.Bottom
          }
        ]}
        multiWidth="153px"
        labelText="文件"
      >
        <JGButton key="JGButton1" height="32px" width="59px">
          按钮1
        </JGButton>
        <JGButton key="JGButton2" height="32px" width="59px">
          按钮2
        </JGButton>
        <JGButton key="JGButton3" height="32px" width="59px">
          按钮3
        </JGButton>
        <JGButton key="JGButton4" height="32px" width="59px">
          按钮4
        </JGButton>
      </JGGroupPanel>
      <JGGroupPanel
        top="4px"
        left="154px"
        multiHeight="208px"
        contentAlignment={ContentAlignment.Horizontal}
        setting={[
          {
            key: 'JGButton5',
            horizontalAlign: HorizontalAlign.Left,
            verticalAlign: VerticalAlign.Top
          },
          {
            key: 'JGButton6',
            horizontalAlign: HorizontalAlign.Center,
            verticalAlign: VerticalAlign.Middle
          },
          {
            key: 'JGButton7',
            horizontalAlign: HorizontalAlign.Right,
            verticalAlign: VerticalAlign.Middle
          },
          {
            key: 'JGButton8',
            horizontalAlign: HorizontalAlign.Right,
            verticalAlign: VerticalAlign.Bottom
          }
        ]}
        multiWidth="806px"
      >
        <JGButton key="JGButton5" height="32px" width="59px">
          按钮5
        </JGButton>
        <JGButton key="JGButton6" height="32px" width="59px">
          按钮6
        </JGButton>
        <JGButton key="JGButton7" height="32px" width="59px">
          按钮7
        </JGButton>
        <JGButton key="JGButton8" height="32px" width="59px">
          按钮8
        </JGButton>
      </JGGroupPanel>
      <JGGroupPanel
        top="246px"
        left="158px"
        multiHeight="114px"
        contentAlignment={ContentAlignment.Table}
        setting={[
          {
            key: 'JGButton10',
            colSpan: 2,
            endRow: true
          }
        ]}
        multiWidth="776px"
      >
        <JGButton key="JGButton10" height="32px" width="59px">
          按钮10
        </JGButton>
        <JGButton key="JGButton12" height="32px" width="59px">
          按钮12
        </JGButton>
        <JGButton key="JGButton13" height="32px" width="59px">
          按钮13
        </JGButton>
        <JGButton key="JGButton14" height="32px" width="59px">
          按钮14
        </JGButton>
        <JGButton key="JGButton9" height="32px" width="59px">
          按钮9
        </JGButton>
        <JGButton key="JGButton11" height="32px" width="59px">
          按钮11
        </JGButton>
        <JGButton key="JGButton15" height="32px" width="59px">
          按钮15
        </JGButton>
      </JGGroupPanel>
    </JGComponent>
  )
}

export default GroupPanel
