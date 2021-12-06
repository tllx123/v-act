import { JGButton } from '@v-act/jgbutton'
import { JGComponent } from '@v-act/jgcomponent'

const Button = () => {
  return (
    <JGComponent>
      <JGButton top="33px" left="57px" height="26px" width="59px">
        按钮1
      </JGButton>
      <JGButton top="65px" left="57px" height="26px" width="188px">
        这里是一串很长很长的字符串
      </JGButton>
    </JGComponent>
  )
}

export default Button
