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
      <JGGroupPanel multiHeight={ReactEnum.Space} multiWidth={ReactEnum.Space}>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Top"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Top
            }
          ]}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Middle"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Middle
            }
          ]}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Bottom"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Bottom
            }
          ]}
        >
          <JGButton key="JGButton1" height="32px" width="59px">
            按钮1
          </JGButton>
        </JGGroupPanel>
        <JGGroupPanel
          top="0px"
          left="0px"
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Top-Middle"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Top
            },
            {
              key: 'JGButton2',
              verticalAlign: VerticalAlign.Middle
            }
          ]}
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
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Middle-Bottom"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Middle
            },
            {
              key: 'JGButton2',
              verticalAlign: VerticalAlign.Bottom
            }
          ]}
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
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Top-Bottom"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Top
            },
            {
              key: 'JGButton2',
              verticalAlign: VerticalAlign.Bottom
            }
          ]}
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
          multiHeight={ReactEnum.Space}
          multiWidth="200px"
          groupTitle="Top-Middle-Bottom"
          contentAlignment={ContentAlignment.Vertical}
          setting={[
            {
              key: 'JGButton1',
              verticalAlign: VerticalAlign.Top
            },
            {
              key: 'JGButton2',
              verticalAlign: VerticalAlign.Middle,
              horizontalAlign: HorizontalAlign.Center
            },
            {
              key: 'JGButton3',
              verticalAlign: VerticalAlign.Bottom,
              horizontalAlign: HorizontalAlign.Right
            }
          ]}
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
      </JGGroupPanel>
    </JGComponent>
  )
}

export default GroupPanel
