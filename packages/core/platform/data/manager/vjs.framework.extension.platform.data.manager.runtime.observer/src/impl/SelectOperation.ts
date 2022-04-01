import * as utils from '../util/OperationUtils'
import AbstractOperation from './AbstractOperation'

class Operation extends AbstractOperation {
  operationType = 'Select'
  constructor(params: any) {
    super(params)
  }

  _combineLoad(operation: any) {
    utils.destroyWhenLoad(this, operation)
  }

  _combineDelete(operation: any) {
    utils.opSelectWhenDelete(this, operation)
  }

  _combineSelect(operation: any) {
    let isSel = this.getParams().isSelect
    let opSel = operation.getParams().isSelect
    let rs = this.getParams().resultSet
    let oRs = operation.getParams().resultSet
    if (isSel ^ opSel) {
      let iterator = oRs.iterator()
      while (iterator.hasNext()) {
        let next = iterator.next()
        let selectIter = rs.iterator()
        while (selectIter.hasNext()) {
          let sel = selectIter.next()
          if (sel.getSysId() == next.getSysId()) {
            if (
              this.getRecordPosition(sel) > operation.getRecordPosition(next)
            ) {
              iterator.remove()
            } else {
              selectIter.remove()
            }
            break
          }
        }
      }
      if (oRs.isEmpty()) {
        operation.markDestroy()
      }
      if (rs.isEmpty()) {
        this.markDestroy()
      }
    } else {
      let _this = this
      oRs.iterate(function (rd: any) {
        rs.addRecord(rd)
        _this.setRecordPosition(rd, operation.getRecordPosition(rd))
      })
      operation.markDestroy()
    }
  }
}

export default Operation
