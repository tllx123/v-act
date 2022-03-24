import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params: any) {
  // @ts-ignore
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Load',

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

  _combineLoad: function (operation: any, isBehind: any) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (!isAppend) {
      this.markDestroy()
    } /*else{
            this.getParams().resultSet.combine(params.resultSet);
            operation.markDestroy();
        }*/
  },

  _combineInsert: function (operation: any) {
    utils.destroyWhenLoad(operation, this)
  },

  _combineUpdate: function (operation: any) {
    utils.destroyWhenLoad(operation, this)
  },

  _combineDelete: function (operation: any) {
    utils.destroyWhenLoad(operation, this)
  },
  _combineCurrent: function (operation: any) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (
      !isAppend &&
      operation.getOperationPosition() < this.getOperationPosition()
    ) {
      operation.markDestroy()
    }
  },
  _combineSelect: function (operation: any) {
    utils.destroyWhenLoad(operation, this)
  }
}

export default Operation
