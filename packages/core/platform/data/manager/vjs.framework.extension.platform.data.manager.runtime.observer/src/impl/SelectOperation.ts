import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Select',

  initModule: function (sb) {
    var initFunc = AbstractOperation.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractOperation.prototype)
    prototype.constructor = Operation
    sb.util.object.extend(prototype, Operation.prototype)
    Operation.prototype = prototype
  },

  _combineLoad: function (operation) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineDelete: function (operation) {
    utils.opSelectWhenDelete(this, operation)
  },

  _combineSelect: function (operation) {
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
      oRs.iterate(function (rd) {
        rs.addRecord(rd)
        _this.setRecordPosition(rd, operation.getRecordPosition(rd))
      })
      operation.markDestroy()
    }
  }
}

return Operation

export {
  _callAsyncObservers,
  addObserver,
  addOperation,
  create,
  destroy,
  fire,
  getBindedDatasourceNames
}
