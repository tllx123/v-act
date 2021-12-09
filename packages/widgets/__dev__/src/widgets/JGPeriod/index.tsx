import { JGPeriod } from '@v-act/jgperiod'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGPeriod top="20px" labelText="期次"></JGPeriod>
    </JGComponent>
  )
}

export default TextBox
