import * as AbstractOperation from './impl/AbstractOperation'
import * as utils from './util/OperationUtils'

let undefined

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Delete',

  initModule: function (sb) {
    var initFunc = AbstractOperation.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractOperation.prototype)
    prototype.constructor = Operation
    sb.util.object.extend(prototype, Operation.prototype)
    Operation.prototype = prototype
  },

  _combineLoad: function (operation) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineDelete: function (operation) {
    utils.combine(this, operation)
  },

  _combineInsert: function (operation) {
    utils.destroy(operation, this)
  },

  _combineUpdate: function (operation) {
    utils.destroy(operation, this)
  },

  _combineCurrent: function (operation) {
    utils.destroyCurrent(operation, this)
  },

  _combineSelect: function (operation) {
    utils.opSelectWhenDelete(operation, this)
  }
}

return Operation

export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation
}
