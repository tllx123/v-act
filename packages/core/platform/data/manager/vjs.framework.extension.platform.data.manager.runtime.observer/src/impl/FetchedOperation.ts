import * as AbstractOperation from './AbstractOperation'

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Fetched',

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
  _combineFetch: function (operation, isBehind) {
    operation.markDestroy()
    this.markDestroy()
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
