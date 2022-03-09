import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params) {
  AbstractOperation.call(this, params)
  let record = this.getParams().currentRecord
  record.setChangedData(null)
}

Operation.prototype = {
  operationType: 'Current',

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

  _isBefore: function (o) {
    return o.getOperationPosition() > this.getOperationPosition()
  },

  _combineCurrent: function (operation) {
    if (this._isBefore(operation)) {
      this.markDestroy()
    } else {
      operation.markDestroy()
    }
  },

  _combineLoad: function (operation) {
    if (this._isBefore(operation)) {
      let params = operation.getParams()
      let isAppend = params.isAppend
      if (!isAppend) {
        //如果以覆盖方式加载
        this.markDestroy()
      }
    }
  },

  _combineDelete: function (operation) {
    utils.destroyCurrent(this, operation)
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
