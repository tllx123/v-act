import * as datasourceInitor from '../impl/initor/DatasourceInitor'
import * as adapter from './Adapter'

export function initModule() {}

const init = function (params) {
  let type = params.type
  let value = params.value
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
      return adapter.adapt(params)
    case 'entity':
      return datasourceInitor.init(params)
    default:
      return null
  }
}

export { adapt, init }
