import { JGTextBox } from '@v-act/jgtextbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGTextBox
        top="33px"
        left="57px"
        height="26px"
        width="59px"
        labelText="账号"
      ></JGTextBox>
      <JGTextBox
        top="65px"
        left="57px"
        height="26px"
        width="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="密码"
      ></JGTextBox>
      <JGTextBox
        top="97px"
        left="57px"
        height="26px"
        width="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="邮箱"
        visible={false}
      ></JGTextBox>
      <JGTextBox
        top="97px"
        left="57px"
        height="26px"
        width="188px"
        isMust={true}
        placeholder="请输入邮箱"
        labelText="邮箱"
        labelVisible={false}
      ></JGTextBox>
    </JGComponent>
  )
}

export default TextBox
