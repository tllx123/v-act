import {
  JGLongDateTimePicker,
  JsonJGLongDateTimePicker
} from '@v-act/jglongdatetimepicker'
import { JGComponent } from '@v-act/jgcomponent'
const longdatetimepicker = () => {
  return (
    <JGComponent>
      {JsonJGLongDateTimePicker({
        control: {
          type: 'JGLongDateTimePicker',
          properties: {
            alias: '',
            code: 'JGLongDateTimePicker2',
            height: '32',
            labelText: '最大最小日期',
            left: '150',
            maxDate: '2022-01-18',
            minDate: '2022-01-13',
            multiHeight: '32px',
            multiWidth: '235px',
            tabIndex: '1',
            top: '204'
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
                  value: 'JGLongDateTimePicker2'
                }
              ]
            }
          ]
        }
      })}
    </JGComponent>
  )
}

export default longdatetimepicker
