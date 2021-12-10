import { JGLongDateTimePicker } from '@v-act/jglongdatetimepicker'
import { JGComponent } from '@v-act/jgcomponent'
const longdatetimepicker = () => {
  return (
    <JGComponent>
      <JGLongDateTimePicker labeltext="超出省略号超出省略号" />
      <JGLongDateTimePicker labeltext="disabled" top={70} disabled />
      <JGLongDateTimePicker
        labeltext="只读"
        readonly={true}
        checked
        top={130}
      />

      <JGLongDateTimePicker
        height={200}
        width={400}
        top={300}
        isMust
        readonly
        labeltext="必填只读"
      />

      <JGLongDateTimePicker
        labeltext="加了padding"
        height={200}
        width={400}
        top={400}
        padding="20px 20px 20px 20px"
      />
    </JGComponent>
  )
}

export default longdatetimepicker
