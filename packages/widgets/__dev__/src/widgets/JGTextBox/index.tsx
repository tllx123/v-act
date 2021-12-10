import { JGTextBox } from '@v-act/jgtextbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGTextBox
        top={33}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        labelText="账号"
      ></JGTextBox>
      <JGTextBox
        top={65}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="密码"
      ></JGTextBox>
      <JGTextBox
        top={97}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="邮箱"
        visible={false}
      ></JGTextBox>
      <JGTextBox
        top={97}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入邮箱"
        labelText="邮箱"
        labelVisible={false}
      ></JGTextBox>
      <JGTextBox
        top={129}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入手机号"
        labelText="手机号"
        disabled={true}
      ></JGTextBox>
    </JGComponent>
  )
}

export default TextBox
