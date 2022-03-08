import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as operation } from '@v-act/vjs.framework.extension.system'

export function initModule(sb) {}

const save = function (params) {
  let dataSchemas = params.dataSchemas,
    treeStructs = params.treeStructs,
    success = params.success,
    transactionId = params.transactionId
  let scope = scopeManager.getScope()
  operation.invokeOperation({
    param: {
      saveDatas: dataSchemas,
      saveMode: 'normal',
      treeStructMapArray: treeStructs
    },
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode == undefined ? null : scope.getWindowCode(),
    operationName: 'Save',
    transactionId: transactionId,
    isAsync: false,
    afterResponse: success
  })
}

export { query, querySenior, save }
