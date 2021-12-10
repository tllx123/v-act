import { JGDateTimePicker } from '@v-act/jgdatetimepicker'
import { JGComponent } from '@v-act/jgcomponent'
const timepicker = () => {
  return (
    <JGComponent>
      <JGDateTimePicker labeltext="超出省略号超出省略号" />
      <JGDateTimePicker labeltext="disabled" top={70} disabled />
      <JGDateTimePicker labeltext="只读" readonly={true} checked top={130} />

      <JGDateTimePicker
        height={200}
        width={400}
        top={300}
        isMust
        readonly
        labeltext="必填只读"
      />

      <JGDateTimePicker
        labeltext="加了padding"
        height={200}
        width={400}
        top={400}
        padding="20px 20px 20px 20px"
      />
    </JGComponent>
  )
}

export default timepicker
