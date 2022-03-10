import * as utils from '../util/OperationUtils'
import * as AbstractOperation from './AbstractOperation'

let objUtils

let Operation = function (params) {
  AbstractOperation.call(this, params)
}

Operation.prototype = {
  operationType: 'Update',

  initModule: function (sb) {
    var initFunc = AbstractOperation.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractOperation.prototype)
    prototype.constructor = Operation
    objUtils = sb.util.object
    objUtils.extend(prototype, Operation.prototype)
    Operation.prototype = prototype
  },

  _combineResuleSet: function (rs, rs1) {
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
  },

  _combineUpdate: function (operation) {
    let rs = operation.getParams().resultSet,
      _this = this
    rs.iterate(function (rd) {
      _this.setRecordPosition(rd, operation.getRecordPosition(rd))
    })
    this._combineResuleSet(this.getParams().resultSet, rs)
    this._combineResuleSet(
      this.getParams().oldResultSet,
      operation.getParams().oldResultSet
    )
    operation.markDestroy()
  },

  _combineLoad: function (operation) {
    utils.destroyWhenLoad(this, operation)
  },

  _combineDelete: function (operation) {
    utils.destroyBefore(this, operation)
  },

  _combineInsert: function (operation) {
    utils.opUpdateWhenInsert(operation, this)
  }
}

export default Operation
