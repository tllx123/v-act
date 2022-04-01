import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Delete'

  constructor(params: any) {
    super(params)
  }

  _combineLoad(operation: any) {
    utils.destroyWhenLoad(this, operation)
  }

  _combineDelete(operation: any) {
    utils.combine(this, operation)
  }

  _combineInsert(operation: any) {
    utils.destroy(operation, this)
  }

  _combineUpdate(operation: any) {
    utils.destroy(operation, this)
  }

  _combineCurrent(operation: any) {
    utils.destroyCurrent(operation, this)
  }

  _combineSelect(operation: any) {
    utils.opSelectWhenDelete(operation, this)
  }
}

export default Operation
