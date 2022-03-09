import Field from '../../api/Field'

function adapt(
  value: null,
  field: Field,
  callback: (fieldCode: string, temp: any, value: string) => void
): null
function adapt(
  value: any,
  field: Field,
  callback: (fieldCode: string, temp: any, value: string) => void
) {
  if (typeof value === null) {
    return value
  } else {
    let temp = value.toString()
    callback(field.getCode(), temp, value)
    return temp
  }
}

export { adapt }
