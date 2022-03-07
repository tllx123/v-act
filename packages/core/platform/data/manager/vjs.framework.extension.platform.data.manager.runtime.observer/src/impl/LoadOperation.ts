import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Load',

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

  _combineLoad: function (operation, isBehind) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (!isAppend) {
      this.markDestroy()
    } /*else{
            this.getParams().resultSet.combine(params.resultSet);
            operation.markDestroy();
        }*/
  },

  _combineInsert: function (operation) {
    utils.destroyWhenLoad(operation, this)
  },

  _combineUpdate: function (operation) {
    utils.destroyWhenLoad(operation, this)
  },

  _combineDelete: function (operation) {
    utils.destroyWhenLoad(operation, this)
  },
  _combineCurrent: function (operation) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (
      !isAppend &&
      operation.getOperationPosition() < this.getOperationPosition()
    ) {
      operation.markDestroy()
    }
  },
  _combineSelect: function (operation) {
    utils.destroyWhenLoad(operation, this)
  }
}

return Operation

export {
  _callAsyncObservers,
  addObserver,
  addOperation,
  destroy,
  fire,
  getBindedDatasourceNames
}
