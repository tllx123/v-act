import { JGComponent } from '@v-act/jgcomponent'
import { JGLabel } from '@v-act/jglabel'
import {
  JGQueryConditionPanel,
  JGQueryConditionPanelForm,
  JGQueryConditionPanelToolbar
} from '@v-act/jgqueryconditionpanel'
import { JGTextBox } from '@v-act/jgtextbox'

const QueryConditionPanel = () => {
  return (
    <JGComponent>
      <JGQueryConditionPanel
        multiHeight="206px"
        multiWidth="960px"
        left="3px"
        top="12px"
      >
        <JGQueryConditionPanelToolbar>
          <JGLabel height="32px" width="37px">
            标签
          </JGLabel>
          <JGLabel height="32px" width="37px">
            标签1
          </JGLabel>
          <JGLabel height="32px" width="37px">
            标签2
          </JGLabel>
        </JGQueryConditionPanelToolbar>
        <JGQueryConditionPanelForm queryButtonText="查询">
          <JGTextBox
            labelText="账号"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="密码"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="电话"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="邮箱"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="爱好"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="爱好"
            labelWidth={150}
            labelTextAlign="Right"
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
        </JGQueryConditionPanelForm>
      </JGQueryConditionPanel>
    </JGComponent>
  )
}

export default QueryConditionPanel
