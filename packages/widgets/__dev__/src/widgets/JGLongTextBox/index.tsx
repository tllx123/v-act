import { JGLongTextBox } from '@v-act/jglongtextbox'
import { JGComponent } from '@v-act/jgcomponent'
const Longtextbox = () => {
  return (
    <JGComponent>
      <JGLongTextBox labeltext="超出省略号超出省略号" />
      <JGLongTextBox top={70} disabled />
      <JGLongTextBox placeholder="请填写" top={130} />

      <JGLongTextBox
        placeholder="请填写"
        height={200}
        width={400}
        top={210}
        isMust
      />
    </JGComponent>
  )
}

export default Longtextbox
