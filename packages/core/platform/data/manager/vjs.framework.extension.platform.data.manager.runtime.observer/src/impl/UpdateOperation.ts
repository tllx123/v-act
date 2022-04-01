import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'
import { ObjectUtil as objUtils } from '@v-act/vjs.framework.extension.util.object'
class Operation extends AbstractOperation {
  operationType = 'Update'
  constructor(params: any) {
    super(params)
  }
  _combineResuleSet(rs: any, rs1: any) {
    let iter = rs.iterator()
    let iter1 = rs1.iterator()
    while (iter.hasNext()) {
      let next = iter.next()
      let founded = false
      while (iter1.hasNext()) {
        let next1 = iter1.next()
        if (next.getSysId() == next1.getSysId()) {
          let pre = next.getChangedData()
          let changes = next1.getChangedData()
          objUtils.extend(pre, changes)
          iter1.remove()
          break
        }
      }
    }
    rs.combine(rs1)
  }

  _combineUpdate(operation: any) {
    let rs = operation.getParams().resultSet,
      _this = this
    rs.iterate(function (rd: any) {
      _this.setRecordPosition(rd, operation.getRecordPosition(rd))
    })
    this._combineResuleSet(this.getParams().resultSet, rs)
    this._combineResuleSet(
      this.getParams().oldResultSet,
      operation.getParams().oldResultSet
    )
    operation.markDestroy()
  }

  _combineLoad(operation: any) {
    utils.destroyWhenLoad(this, operation)
  }

  _combineDelete(operation: any) {
    utils.destroyBefore(this, operation)
  }

  _combineInsert(operation: any) {
    utils.opUpdateWhenInsert(operation, this)
  }
}

export default Operation
