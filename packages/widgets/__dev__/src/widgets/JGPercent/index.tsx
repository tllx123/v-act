import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
import { JGPercent } from '@v-act/jgpercent'

const Percent = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="534px"
        groupTitle="分组标题"
      >
        <JGPercent
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
          value={10}
        ></JGPercent>
        <JGPercent
          top="30px"
          multiHeight="32px"
          multiWidth="262px"
          value={20}
        ></JGPercent>
      </JGFormLayout>
      <JGPercent
        width="80%"
        height="80px"
        top="26px"
        left="30px"
        value={100}
      ></JGPercent>
      <JGPercent
        top="126px"
        left="30px"
        value={10}
        fontColor="yellow"
        visible={true}
      ></JGPercent>
    </JGComponent>
  )
}

export default Percent
