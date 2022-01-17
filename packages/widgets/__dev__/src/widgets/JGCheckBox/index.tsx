import { JGCheckBox, convert } from '@v-act/jgcheckbox'
import { JGComponent } from '@v-act/jgcomponent'

const checkbox = () => {
  return (
    <JGComponent>
      {convert({
        type: 'JGCheckBox',
        properties: {
          alias: '',
          code: 'JGCheckBox6',
          height: '50',
          labelText: '提醒文字',
          left: '456',
          isMust: 'true',
          multiHeight: '50px',
          multiWidth: '300px',
          placeholder: '提醒文字',
          top: '127',
          readOnly: 'True'
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
