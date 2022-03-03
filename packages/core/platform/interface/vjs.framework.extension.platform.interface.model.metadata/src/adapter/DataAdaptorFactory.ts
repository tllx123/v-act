import * as stringDataAdaptor from './adapter/impl/StringDataAdaptor'
import * as numberDataAdaptor from './adapter/impl/NumberDataAdaptor'
import * as booleanDataAdpator from './adapter/impl/BooleanDataAdaptor'

let undefined

exports.initModule = function () {}

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
