import * as booleanDataAdpator from './impl/BooleanDataAdaptor'
import * as numberDataAdaptor from './impl/NumberDataAdaptor'
import * as stringDataAdaptor from './impl/StringDataAdaptor'

export function initModule() {}

const getDataValidator = function (fieldType) {
  switch (fieldType) {
    case 'char':
    case 'text':
    case 'date':
    case 'longDate':
    case 'file':
    case 'object':
      return stringDataAdaptor
    case 'number':
    case 'integer':
      return numberDataAdaptor
    case 'boolean':
      return booleanDataAdpator
    default:
      return null
  }
}

export { getDataValidator }
