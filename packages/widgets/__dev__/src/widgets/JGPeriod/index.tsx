import { JGComponent } from '@v-act/jgcomponent'
import { JGPeriod } from '@v-act/jgperiod'

const TextBox = () => {
  return (
    <JGComponent>
      <JGPeriod
        top="159px"
        left="615px"
        labelText="期次"
        multiHeight="26px"
        multiWidth="235px"
      ></JGPeriod>
    </JGComponent>
  )
}

export default TextBox
