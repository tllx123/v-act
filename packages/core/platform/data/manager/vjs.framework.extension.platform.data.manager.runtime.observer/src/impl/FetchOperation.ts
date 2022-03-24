import * as AbstractOperation from './AbstractOperation'

let Operation = function (params: any) {
  // @ts-ignore
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Fetch',

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
  _combineFetched: function (operation: any, isBehind: boolean) {
    this.markDestroy()
    operation.markDestroy()
  }
}

export default Operation
