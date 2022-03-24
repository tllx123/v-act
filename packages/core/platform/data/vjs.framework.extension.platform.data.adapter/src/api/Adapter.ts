import * as booleanDataAdpator from '../impl/adapter/BooleanDataAdaptor'
import * as numberDataAdaptor from '../impl/adapter/NumberDataAdaptor'
import * as stringDataAdaptor from '../impl/adapter/StringDataAdaptor'

export function initModule() {}

const adapt = function (params: any) {
  let type = params.type
  let value = params.value
  switch (type) {
    case 'char':
    case 'text':
    case 'date':
    case 'longDate':
    case 'file':
    case 'object':
      return stringDataAdaptor.adapt(params)
    case 'number':
    case 'integer':
      return numberDataAdaptor.adapt(params)
    case 'boolean':
      return booleanDataAdpator.adapt(params)
    default:
      return null
  }
}

export { adapt }
