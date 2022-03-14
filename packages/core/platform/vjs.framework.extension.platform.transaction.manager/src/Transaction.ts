import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as RollbackRequest from './RollbackRequest'
import * as rollbackRequestManager from './RollbackRequestManager'
import * as utils from './Utils'

// 事务状态常量
let STATUS_ACTIVE = 'ACTIVE'
let STATUS_ROLLEDBACK = 'ROLLEDBACK'
let STATUS_NO_TRANSACTION = 'NO_TRANSACTION'
let STATUS_COMMITTED = 'COMMITTED'

function Transaction(transactionId:string) {
  //@ts-ignore
  this.componentCode
  //@ts-ignore
  this.scopeId
  //事务实例id
  //@ts-ignore
  this.transactionId = transactionId
  //事务实例状态
  //@ts-ignore
  this.transactionStatus = STATUS_NO_TRANSACTION
}

Transaction.prototype = {
  doBegin: function (args:any) {
    //事务如果已开启,则无需重新开启
    if (this.transactionStatus != STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error:any) {
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
  doCommit: function (args:any) {
    //事务已开启情况下才需要提交事务
    if (this.transactionStatus == STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error:any) {
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
  doRollback: function (args:any) {
    //事务已开启情况下才需要回滚事务
    if (this.transactionStatus == STATUS_ACTIVE) {
      if (!args) {
        args = {}
        let instance = this
        let errorCB = function (error:any) {
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
  _genParams: function (successStatus:any, args:any) {
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
  setScopeId: function (scopeId:string) {
    this.scopeId = scopeId
  },
  getScopeId: function () {
    return this.scopeId
  },
  setComponentCode: function (componentCode:string) {
    this.componentCode = componentCode
  },
  getComponentCode: function () {
    return this.componentCode
  }
}

export default Transaction
