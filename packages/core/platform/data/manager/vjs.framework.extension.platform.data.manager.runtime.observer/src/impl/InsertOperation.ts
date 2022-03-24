import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params: any) {
  // @ts-ignore
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Insert',

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

  /**
   * 合并删除
   * 当
   */
  _combineDelete: function (operation: any) {
    utils.destroy(this, operation)
  },

  _combineLoad: function (operation: any) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineUpdate: function (operation: any) {
    utils.opUpdateWhenInsert(this, operation)
  },

  _combineInsert: function (operation: any) {
    utils.combine(this, operation)
  }
}

export default Operation
