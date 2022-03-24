import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params: any) {
  // @ts-ignore
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Delete',

  initModule: function (sb: any) {
    // @ts-ignore
    var initFunc = AbstractOperation.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    // @ts-ignore
    var prototype = Object.create(AbstractOperation.prototype)
    prototype.constructor = Operation
    sb.util.object.extend(prototype, Operation.prototype)
    Operation.prototype = prototype
  },

  _combineLoad: function (operation: any) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineDelete: function (operation: any) {
    utils.combine(this, operation)
  },

  _combineInsert: function (operation: any) {
    utils.destroy(operation, this)
  },

  _combineUpdate: function (operation: any) {
    utils.destroy(operation, this)
  },

  _combineCurrent: function (operation: any) {
    utils.destroyCurrent(operation, this)
  },

  _combineSelect: function (operation: any) {
    utils.opSelectWhenDelete(operation, this)
  }
}

export default Operation
