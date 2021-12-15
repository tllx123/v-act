import { JGComponent } from '@v-act/jgcomponent'
import { JGLabel } from '@v-act/jglabel'
import {
  Align,
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
        left="150px"
        top="200px"
      >
        <JGQueryConditionPanelToolbar
          setting={[
            { key: 'JGLabel5', align: Align.Right },
            { key: 'JGLabel6', align: Align.Right },
            { key: 'JGLabel7', align: Align.Right },
            { key: 'JGLabel8', align: Align.Right }
          ]}
        >
          <JGLabel key="JGLabel1" height="32px" width="37px">
            标签1
          </JGLabel>
          <JGLabel key="JGLabel2" height="32px" width="37px">
            标签2
          </JGLabel>
          <JGLabel key="JGLabel3" height="32px" width="37px">
            标签3
          </JGLabel>
          <JGLabel key="JGLabel4" height="32px" width="37px">
            标签4
          </JGLabel>
          <JGLabel key="JGLabel5" height="32px" width="37px">
            标签5
          </JGLabel>
          <JGLabel key="JGLabel6" height="32px" width="37px">
            标签6
          </JGLabel>
          <JGLabel key="JGLabel7" height="32px" width="37px">
            标签7
          </JGLabel>
          <JGLabel key="JGLabel8" height="32px" width="37px">
            标签8
          </JGLabel>
        </JGQueryConditionPanelToolbar>
        <JGQueryConditionPanelForm
          queryButtonText="查询"
          searchBoxEnabled={false}
        >
          <JGTextBox
            labelText="账号"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="密码"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="电话"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="邮箱"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="爱好"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
          <JGTextBox
            labelText="爱好"
            labelWidth={150}
            multiHeight="32px"
            multiWidth="229px"
          ></JGTextBox>
        </JGQueryConditionPanelForm>
      </JGQueryConditionPanel>
    </JGComponent>
  )
}

export default QueryConditionPanel
