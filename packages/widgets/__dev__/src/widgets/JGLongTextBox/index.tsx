import { JGLongTextBox } from '@v-act/jglongtextbox'
import { JGComponent } from '@v-act/jgcomponent'
const Longtextbox = () => {
  return (
    <JGComponent>
      <JGLongTextBox labeltext="超出省略号超出省略号" />
      <JGLongTextBox top={70} disabled labeltext="disabled" />
      <JGLongTextBox placeholder="请填写" top={130} />

      <JGLongTextBox
        placeholder="请填写"
        height={200}
        width={400}
        top={210}
        isMust
      />

      <JGLongTextBox top={500} readonly labeltext="只读" />
    </JGComponent>
  )
}

export default Longtextbox
