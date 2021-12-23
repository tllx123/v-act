import { JGComponent } from '@v-act/jgcomponent'
import { JGReport } from '@v-act/jgreport'

const Button = () => {
  return (
    <JGComponent>
      <JGReport
        top="100px"
        left="100px"
        multiHeight="500px"
        multiWidth="700px"
      ></JGReport>
    </JGComponent>
  )
}

export default Button
