import { JGCheckBox, convert } from '@v-act/jgcheckbox'
import { JGComponent } from '@v-act/jgcomponent'
import { JGFormLayout } from '@v-act/jgformlayout'
const checkbox = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGCheckBox',
        properties: {
          code: 'JGCheckBox6',
          height: '32',
          labelText: '提醒文字',
          left: '456',
          multiHeight: '32px',
          multiWidth: '235px',
          placeholder: '提醒文字',
          top: '127'
        },
        headerControls: [],
        controls: [],
        dataBindings: [
          {
            dataSource: 'formAllFreeEntity',
            dataMembers: [
              {
                name: '字段名称',
                code: 'ColumnName',
                value: 'JGCheckBox6'
              }
            ]
          }
        ]
      })}
    </JGComponent>
  )
}

export default checkbox
