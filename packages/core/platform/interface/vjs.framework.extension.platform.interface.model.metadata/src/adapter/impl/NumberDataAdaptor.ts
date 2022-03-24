import Field from '../../api/Field'

let sandbox: any

function initModule(sb: never) {
  if (sb) sandbox = sb
}

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
  } else if (isNaN(value) || value == '') {
    let temp = value
    let fieldCode = field.getCode()
    let log = sandbox.getService('vjs.framework.extension.util.log')
    log.warn(
      '[DataValidator.__fixFieldValueDecimal__]' +
        '名字为' +
        fieldCode +
        '的字段值为' +
        value +
        ',不是一个合法的数值型,自动适配成null值'
    )
    temp = null
  } else {
    let temp = value
    let precision = field.getPrecision()
    temp = parseFloat(temp)
    let n = Math.pow(10, precision)
    temp = Math.round(temp * n) / n
  }
}

export { initModule, adapt }
