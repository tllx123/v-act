import { JGComponent } from '@v-act/jgcomponent'
import { JGTabControl, JGTabPage } from '@v-act/jgtabcontrol'
import { JGTextBox } from '@v-act/jgtextbox'

const TextBox = () => {
  return (
    <JGComponent>
      <JGTabControl
        top="50px"
        left="50px"
        tabAppearance="card"
        multiWidth="500px"
        multiHeight="500px"
        selectedIndex={2}
      >
        <JGTabPage code="JGTabPage1" labelText="页签1">
          <JGTextBox
            top="33px"
            left="57px"
            multiHeight="26px"
            multiWidth="188px"
            labelText="账号"
          ></JGTextBox>
          <JGTextBox
            top="65px"
            left="57px"
            multiHeight="26px"
            multiWidth="188px"
            isMust={true}
            placeholder="请输入密码"
            labelText="密码"
          ></JGTextBox>
        </JGTabPage>
        <JGTabPage code="JGTabPage2" labelText="页签2">
          <JGTextBox
            top="97px"
            left="57px"
            multiHeight="26px"
            multiWidth="188px"
            isMust={true}
            placeholder="请输入密码"
            labelText="邮箱"
            visible={false}
          ></JGTextBox>
          <JGTextBox
            top="97px"
            left="57px"
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
            top="129px"
            left="57px"
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
