import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Load'
  constructor(params: any) {
    super(params)
  }

  _combineLoad(operation: any, isBehind: any) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (!isAppend) {
      this.markDestroy()
    } /*else{
            this.getParams().resultSet.combine(params.resultSet);
            operation.markDestroy();
        }*/
  }

  _combineInsert(operation: any) {
    utils.destroyWhenLoad(operation, this)
  }

  _combineUpdate(operation: any) {
    utils.destroyWhenLoad(operation, this)
  }

  _combineDelete(operation: any) {
    utils.destroyWhenLoad(operation, this)
  }
  _combineCurrent(operation: any) {
    let params = operation.getParams()
    let isAppend = params.isAppend
    if (
      !isAppend &&
      operation.getOperationPosition() < this.getOperationPosition()
    ) {
      operation.markDestroy()
    }
  }
  _combineSelect(operation: any) {
    utils.destroyWhenLoad(operation, this)
  }
}

export default Operation
