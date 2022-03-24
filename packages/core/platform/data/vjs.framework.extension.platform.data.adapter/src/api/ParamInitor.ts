import * as datasourceInitor from '../impl/initor/DatasourceInitor'
import * as adapter from './Adapter'

const init = function (param: any) {
  let type = param.getType()
  switch (type) {
    case 'char':
    case 'text':
    case 'date':
    case 'longDate':
    case 'file':
    case 'object':
    case 'number':
    case 'integer':
    case 'boolean':
      var args = { type: type, value: param.initValue }
      return adapter.adapt(args)
    case 'entity':
      return datasourceInitor.init(param)
    default:
      return null
  }
}

export { init }
