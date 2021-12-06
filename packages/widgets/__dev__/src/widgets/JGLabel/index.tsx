import { JGComponent } from '@v-act/jgcomponent'
import { JGLabel } from '@v-act/jglabel'

const Button = () => {
  return (
    <JGComponent>
      <JGLabel top="49px" left="101px" height="24px" width="68px">
        标签
      </JGLabel>

      <JGLabel top="80px" left="101px" height="24px" width="68px">
        这里是一串很长很长的字符串
      </JGLabel>

      <JGLabel top="110px" left="101px" height="100px" width="100px">
        这里是一串很长很长的字符串
      </JGLabel>
    </JGComponent>
  )
}

export default Button
