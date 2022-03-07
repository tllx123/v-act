import * as booleanDataAdpator from './adapter/impl/BooleanDataAdaptor'
import * as numberDataAdaptor from './adapter/impl/NumberDataAdaptor'
import * as stringDataAdaptor from './adapter/impl/StringDataAdaptor'

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
