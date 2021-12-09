import { JGTabControl, JGTabPage } from '@v-act/jgtabcontrol'
import { JGTextBox } from '@v-act/jgtextbox'
import { JGComponent } from '@v-act/jgcomponent'

const TextBox = () => {
  return (
    <JGComponent>
      <JGTabControl top={50} left={50} multiWidth="500px" multiHeight="500px">
        <JGTabPage code="JGTabPage1" labelText="页签1">
          <JGTextBox
            top={33}
            left={57}
            multiHeight="26px"
            multiWidth="59px"
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
        </JGTabPage>
        <JGTabPage code="JGTabPage2" labelText="页签2">
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
        </JGTabPage>
        <JGTabPage code="JGTabPage3" labelText="页签3">
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
        </JGTabPage>
      </JGTabControl>
    </JGComponent>
  )
}

export default TextBox
