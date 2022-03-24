import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params: any) {
  // @ts-ignore
  AbstractOperation.call(this, params)
  // @ts-ignore
  let record = this.getParams().currentRecord
  record.setChangedData(null)
}

Operation.prototype = {
  operationType: 'Current',

  initModule: function (sb: any) {
    // @ts-ignore
    var initFunc = AbstractOperation.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    } // @ts-ignore
    var prototype = Object.create(AbstractOperation.prototype)
    prototype.constructor = Operation
    sb.util.object.extend(prototype, Operation.prototype)
    Operation.prototype = prototype
  },

  _isBefore: function (o: any) {
    return o.getOperationPosition() > this.getOperationPosition()
  },

  _combineCurrent: function (operation: any) {
    if (this._isBefore(operation)) {
      this.markDestroy()
    } else {
      operation.markDestroy()
    }
  },

  _combineLoad: function (operation: any) {
    if (this._isBefore(operation)) {
      let params = operation.getParams()
      let isAppend = params.isAppend
      if (!isAppend) {
        //如果以覆盖方式加载
        this.markDestroy()
      }
    }
  },

  _combineDelete: function (operation: any) {
    utils.destroyCurrent(this, operation)
  }
}

export default Operation
