import * as stringDataAdaptor from './impl/StringDataAdaptor'
import * as numberDataAdaptor from './impl/NumberDataAdaptor'
import * as booleanDataAdpator from './impl/BooleanDataAdaptor'

exports.initModule = function () {}

const getDataValidator = function (fieldType: unknown) {
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
