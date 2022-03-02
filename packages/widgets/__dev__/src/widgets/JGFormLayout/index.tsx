import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
import { JGTextBox } from '@v-act/jgtextbox'
import 'antd/dist/antd.css'

const TextBox = () => {
  return (
    <JGComponent>
      <JGFormLayout
        left={197}
        top={168}
        multiHeight="content"
        multiWidth="534px"
        groupTitle="分组标题11"
      >
        <JGTextBox
          labelText="文本"
          multiHeight="32px"
          multiWidth="262px"
        ></JGTextBox>
        <JGTextBox
          placeholder="请输入密码"
          labelText="文本"
          multiHeight="32px"
          multiWidth="127px"
        ></JGTextBox>
        <JGTextBox
          placeholder="请输入密码"
          labelText="文本"
          multiHeight="32px"
          multiWidth="127px"
        ></JGTextBox>
        <JGTextBox
          placeholder="请输入邮箱"
          labelText="文本"
          multiHeight="32px"
          multiWidth="127px"
        ></JGTextBox>
        <JGTextBox
          placeholder="请输入手机号"
          labelText="文本"
          multiHeight="32px"
          multiWidth="127px"
        ></JGTextBox>
      </JGFormLayout>
    </JGComponent>
  )
}

export default TextBox
