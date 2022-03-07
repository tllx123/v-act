import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Insert',

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

  /**
   * 合并删除
   * 当
   */
  _combineDelete: function (operation) {
    utils.destroy(this, operation)
  },

  _combineLoad: function (operation) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineUpdate: function (operation) {
    utils.opUpdateWhenInsert(this, operation)
  },

  _combineInsert: function (operation) {
    utils.combine(this, operation)
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
