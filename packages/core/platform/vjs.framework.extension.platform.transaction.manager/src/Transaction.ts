import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { RPC as operation } from '@v-act/vjs.framework.extension.system'
import * as utils from './Utils'
import * as RollbackRequest from './RollbackRequest'
import * as rollbackRequestManager from './RollbackRequestManager'

// 事务状态常量
let STATUS_ACTIVE = 'ACTIVE'
let STATUS_ROLLEDBACK = 'ROLLEDBACK'
let STATUS_NO_TRANSACTION = 'NO_TRANSACTION'
let STATUS_COMMITTED = 'COMMITTED'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
function Transaction(transactionId) {
  this.componentCode
  this.scopeId
  //事务实例id
  this.transactionId = transactionId
  //事务实例状态
  this.transactionStatus = STATUS_NO_TRANSACTION
}

Transaction.prototype = {
  initModule: function (sb) {},
  doBegin: function (args) {
    //事务如果已开启,则无需重新开启
    if (this.transactionStatus != STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error) {
          log.error(
            '[Transaction._doTransAction]开启事件失败！,transactionId:' +
              instance.transactionId +
              ',错误原因：' +
              error.message
          )
          throw error
        }
        args.fail = errorCB
      }
      let params = this._genParams(STATUS_ACTIVE, args)
      utils.begin(params)
    }
  },
  doCommit: function (args) {
    //事务已开启情况下才需要提交事务
    if (this.transactionStatus == STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error) {
          log.error(
            '[Transaction._doTransAction]提交事件失败！,transactionId:' +
              instance.transactionId +
              ',错误原因：' +
              error.message
          )
          throw error
        }
        args.fail = errorCB
      }
      let params = this._genParams(STATUS_COMMITTED, args)
      utils.commit(params)
    }
  },
  doRollback: function (args) {
    //事务已开启情况下才需要回滚事务
    if (this.transactionStatus == STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error) {
          log.error(
            '[Transaction._doTransAction]回滚事件失败！将尝试进行回滚！,transactionId:' +
              instance.transactionId +
              ',错误原因：' +
              error.message
          )
          let rq = new RollbackRequest({
            steps: [2000, 3000, 5000],
            instance: instance,
            isAsync: true
          })
          rollbackRequestManager.add(rq)
          throw error
        }
        args.fail = errorCB
      }
      let params = this._genParams(STATUS_ROLLEDBACK, args)
      utils.rollback(params)
    }
  },
  _genParams: function (successStatus, args) {
    let scope = scopeManager.getWindowScope()
    let componentCode = scope.getComponentCode()
    let successFunc = args.success
    let params = args || {}
    params.componentCode = componentCode
    params.transactionId = this.transactionId
    params.success = (function (transaction, status, func) {
      //请求成功后更改状态
      return function () {
        transaction.transactionStatus = status
        if (func) {
          func()
        }
      }
    })(this, successStatus, successFunc)
    return params
  },
  isBegined: function () {
    return this.transactionStatus == STATUS_ACTIVE
  },
  isCommited: function () {
    return this.transactionStatus == STATUS_COMMITTED
  },
  isRollbacked: function () {
    return this.transactionStatus == STATUS_ROLLEDBACK
  },
  markRollback: function () {
    this.transactionStatus = STATUS_ROLLEDBACK
  },
  getTransactionId: function () {
    return this.transactionId
  },
  getTransactionStatus: function () {
    return this.transactionStatus
  },
  setScopeId: function (scopeId) {
    this.scopeId = scopeId
  },
  getScopeId: function () {
    return this.scopeId
  },
  setComponentCode: function (componentCode) {
    this.componentCode = componentCode
  },
  getComponentCode: function () {
    return this.componentCode
  }
}

module.exports = Transaction

export { add }
