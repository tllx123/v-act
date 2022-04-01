import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Insert'
  constructor(params: any) {
    super(params)
  }

  /**
   * 合并删除
   * 当
   */
  _combineDelete(operation: any) {
    utils.destroy(this, operation)
  }

  _combineLoad(operation: any) {
    utils.destroyWhenLoad(this, operation)
  }

  _combineUpdate(operation: any) {
    utils.opUpdateWhenInsert(this, operation)
  }

  _combineInsert(operation: any) {
    utils.combine(this, operation)
  }
}

export default Operation
