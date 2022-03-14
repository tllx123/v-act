import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'

let TRANSACTION_OPERATION = 'Transaction'
// 事务ACTION类型常量
let TRANSACTION_BEGIN = 'transaction_begin'
let TRANSACTION_COMMIT = 'transaction_commit'
let TRANSACTION_ROLLBACK = 'transaction_rollback'

const commit = function (params:any) {
  params.transactionType = TRANSACTION_COMMIT
  //@ts-ignore
  return this.rpc(params)
}

const begin = function (params:any) {
  params.transactionType = TRANSACTION_BEGIN
  //@ts-ignore
  return this.rpc(params)
}

const rollback = function (params:any) {
  params.transactionType = TRANSACTION_ROLLBACK
  //@ts-ignore
  return this.rpc(params)
}

export {
  //add,
  begin,
  commit,
  //doBegin,
  //doCommit,
  //doRollback,
  //get,
  //getAll,
  //getByScopeId,
  //isBegined,
  //isCommited,
  //isRollbacked,
  //newTransaction,
  //put,
  //remove,
  rollback,
  rpc
}
