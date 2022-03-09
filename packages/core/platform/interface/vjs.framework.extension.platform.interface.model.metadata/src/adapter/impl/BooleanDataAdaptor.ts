import Field from '../../api/Field'

let sandbox: never
function initModule(sb: never) {
  if (sb) sandbox = sb
}

let regex = /(^\s*)|(\s*$)/g

function _trim(str: string) {
  return str.replace(regex, '')
}

function adapt(
  value: boolean,
  field: Field,
  callback: (fieldCode: string, temp: any, value: string) => void
): boolean
function adapt(
  value: undefined,
  field: Field,
  callback: (fieldCode: string, temp: any, value: string) => void
): undefined
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
  if (
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === null
  ) {
    return value
  } else {
    let temp = _trim(value.toString()).toLowerCase()
    let fieldCode = field.getCode()
    let tempVal: boolean | null = null
    if (temp == 'true' || temp == '1') {
      tempVal = true
    } else if (temp == 'false' || temp == '0') {
      tempVal = false
    } else {
      let log = sandbox.getService('vjs.framework.extension.util.log')
      log.warn(
        '[BooleanDataAdaptor.validate]名字为' +
          fieldCode +
          '的字段值为' +
          value +
          ',不是一个合法的布尔型,自动适配成null值'
      )
      tempVal = null
    }

    callback(fieldCode, tempVal, value)
    return tempVal
  }
}
export { initModule, adapt }
