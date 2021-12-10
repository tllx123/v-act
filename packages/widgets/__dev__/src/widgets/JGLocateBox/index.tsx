import { JGLocateBox } from '@v-act/jglocatebox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGLocateBox
        top={33}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
      ></JGLocateBox>
      <JGLocateBox
        top={65}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="密码"
      ></JGLocateBox>
      <JGLocateBox
        top={97}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入密码"
        labelText="邮箱"
        visible={false}
      ></JGLocateBox>
      <JGLocateBox
        top={97}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入邮箱"
        labelText="邮箱"
        labelVisible={false}
      ></JGLocateBox>
      <JGLocateBox
        top={129}
        left={57}
        multiHeight="26px"
        multiWidth="188px"
        isMust={true}
        placeholder="请输入手机号"
        labelText="手机号"
        disabled={true}
      ></JGLocateBox>
    </JGComponent>
  )
}

export default TextBox
