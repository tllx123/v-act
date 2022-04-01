import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Current'

  constructor(params: any) {
    super(params)
    let record = this.getParams().currentRecord
    record.setChangedData(null)
  }

  _isBefore(o: any) {
    return o.getOperationPosition() > this.getOperationPosition()
  }

  _combineCurrent(operation: any) {
    if (this._isBefore(operation)) {
      this.markDestroy()
    } else {
      operation.markDestroy()
    }
  }

  _combineLoad(operation: any) {
    if (this._isBefore(operation)) {
      let params = operation.getParams()
      let isAppend = params.isAppend
      if (!isAppend) {
        //如果以覆盖方式加载
        this.markDestroy()
      }
    }
  }

  _combineDelete(operation: any) {
    utils.destroyCurrent(this, operation)
  }
}

export default Operation
