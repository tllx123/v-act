import { JGButton } from '@v-act/jgbutton'
import { JGComponent } from '@v-act/jgcomponent'
import {
  ContentAlignment,
  HorizontalAlign,
  JGGroupPanel,
  VerticalAlign
} from '@v-act/jggrouppanel'
import { ReactEnum } from '@v-act/schema-types'

const GroupPanel = () => {
  return (
    <JGComponent width="100%" height="100%">
      <JGGroupPanel
        multiHeight={ReactEnum.Space}
        multiWidth={ReactEnum.Space}
        contentAlignment={ContentAlignment.Vertical}
      >
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Left"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Left
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Center"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Center
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Right"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Right
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Left-Center"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Left
            },
            {
              key: 'JGButton2',
              horizontalAlign: HorizontalAlign.Center
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
          <JGButton key="JGButton2" height="32px" width="59px">
            按钮2
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Left-Center-Right"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Left
            },
            {
              key: 'JGButton2',
              horizontalAlign: HorizontalAlign.Center,
              verticalAlign: VerticalAlign.Middle
            },
            {
              key: 'JGButton3',
              horizontalAlign: HorizontalAlign.Right,
              verticalAlign: VerticalAlign.Bottom
            }
          ]}
          multiWidth={ReactEnum.Space}
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
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Center-Right"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Center
            },
            {
              key: 'JGButton2',
              horizontalAlign: HorizontalAlign.Right
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
          <JGButton key="JGButton2" height="32px" width="59px">
            按钮2
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight="100px"
          groupTitle="Left-Right"
          setting={[
            {
              key: 'JGButton1',
              horizontalAlign: HorizontalAlign.Left
            },
            {
              key: 'JGButton2',
              horizontalAlign: HorizontalAlign.Right
            }
          ]}
          multiWidth={ReactEnum.Space}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
          <JGButton key="JGButton2" height="32px" width="59px">
            按钮2
          </JGButton>
        </JGGroupPanel>
      </JGGroupPanel>
    </JGComponent>
  )
}

export default GroupPanel
