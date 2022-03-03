import { RPC as rpc } from '@v-act/vjs.framework.extension.system'

let undefined
let TRANSACTION_OPERATION = 'Transaction'
// 事务ACTION类型常量
let TRANSACTION_BEGIN = 'transaction_begin'
let TRANSACTION_COMMIT = 'transaction_commit'
let TRANSACTION_ROLLBACK = 'transaction_rollback'

exports.initModule = function (sb) {}

const undefined

const commit = function (params) {
  params.transactionType = TRANSACTION_COMMIT
  return this.rpc(params)
}

const begin = function (params) {
  params.transactionType = TRANSACTION_BEGIN
  return this.rpc(params)
}

const rollback = function (params) {
  params.transactionType = TRANSACTION_ROLLBACK
  return this.rpc(params)
}

export {
  add,
  put,
  get,
  remove,
  getByScopeId,
  getAll,
  remove,
  newTransaction,
  doBegin,
  doCommit,
  doRollback,
  isBegined,
  isCommited,
  isRollbacked,
  rpc,
  commit,
  begin,
  rollback
}
