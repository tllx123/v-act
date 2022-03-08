import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

import * as Transaction from './Transaction'
import * as transactionInstancePool from './TransactionInstancePool'

let collectionUtil
let registered = false

export function initModule(sb) {
  collectionUtil = sb.util.collections
}

const remove = function (transactionId) {
  transactionInstancePool.remove(transactionId)
}

const newTransaction = function () {
  /*if(!registered){
        scopeManager.on(scopeManager.EVENTS.EVENTS,function(){
            var scopeId = this.getCurrentScopeId();
            var instances = transactionInstancePool.getByScopeId(scopeId);
            collectionUtil.each(instances,function(instance){
                if(instance.isBegined()){
                    var rq = new RollbackRequest({"steps":[0,2000,3000,5000],"instance":instance,"isAsync":true});
                    rollbackRequestManager.add(rq);
                }
            });
        });
        $(window).unload(function(){
            var instances = transactionInstancePool.getAll();
            collectionUtil.each(instances,function(instance){
                if(instance.isBegined()){
                    var rq = new RollbackRequest({"steps":[0],"instance":instance,"isAsync":false});
                    rollbackRequestManager.add(rq);
                }
            });
        });
        registered = true;
    }*/
  let transactionId = uuid.generate()
  let transaction = new Transaction(transactionId)
  let scope = scopeManager.getScope()
  transaction.setScopeId(scope.getInstanceId())
  transaction.setComponentCode(scope.getComponentCode())
  transactionInstancePool.put(transactionId, transaction)
  return transactionId
}

const doBegin = function (transactionId, args) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    transaction.doBegin(args)
  }
}

const doCommit = function (transactionId, args) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    transaction.doCommit(args)
  }
}

const doRollback = function (transactionId, args) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    transaction.doRollback(args)
  }
}

const isBegined = function (transactionId) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    return transaction.isBegined()
  }
  return false
}

const isCommited = function (transactionId) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    return transaction.isCommited()
  }
  return false
}

const isRollbacked = function (transactionId) {
  let transaction = transactionInstancePool.get(transactionId)
  if (transaction) {
    return transaction.isRollbacked()
  }
  return false
}

export {
  add,
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
  remove
}
