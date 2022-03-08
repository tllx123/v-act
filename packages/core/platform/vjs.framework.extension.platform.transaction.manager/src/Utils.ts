import { RPC as rpc } from '@v-act/vjs.framework.extension.system'

let TRANSACTION_OPERATION = 'Transaction'
// 事务ACTION类型常量
let TRANSACTION_BEGIN = 'transaction_begin'
let TRANSACTION_COMMIT = 'transaction_commit'
let TRANSACTION_ROLLBACK = 'transaction_rollback'

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
  begin,
  commit,
  doBegin,
  doCommit,
  doRollback,
  get,
  getAll,
  getByScopeId,
  isBegined,
  isCommited,
  isRollbacked,
  newTransaction,
  put,
  remove,
  rollback,
  rpc
}
