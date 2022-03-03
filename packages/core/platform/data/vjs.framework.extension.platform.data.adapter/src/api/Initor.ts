import * as adapter from './api/Adapter'
import * as datasourceInitor from './impl/initor/DatasourceInitor'

let undefined

exports.initModule = function () {}

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
