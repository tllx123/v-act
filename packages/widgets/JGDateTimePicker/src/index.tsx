import { Control } from '@v-act/schema-types'
import { useGetCompVal } from '@v-act/widget-utils'
import { useContext } from '@v-act/widget-context'
import JGDateTimePicker from './JGDateTimePicker'
import {
  getTableName,
  getColumnName,
  getFieldValue,
  setFieldValue
} from '@v-act/widget-utils'
const JsonJGDateTimePicker = function (props: { control: Control }) {
  let control = props.control
  const context = useContext()
  const tableName = getTableName(control)
  const columnName = getColumnName(control)
  let propsTemp = useGetCompVal(control)
  ;(propsTemp.value =
    tableName && columnName
      ? getFieldValue(tableName, columnName, context)
        ? getFieldValue(tableName, columnName, context)
        : new Date()
      : undefined),
    (propsTemp.dateDisplay = control.properties.dateDisplay)
  propsTemp.onChanged = (val: any) => {
    if (tableName && columnName) {
      setFieldValue(tableName, columnName, context, val)
    }
  }
  console.log('propsTemp.value')
  console.log(propsTemp.value)

  return <JGDateTimePicker {...propsTemp}></JGDateTimePicker>
}
export { JGDateTimePicker, JsonJGDateTimePicker }
