import { log as log } from 'packages/core/WebFunc_PrdGetProcessApplicationBizInfo/src/source/node_modules/packages/core/WebFunc_PrdGetBizFrameCurrentRecord/src/source/node_modules/@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
const initModule = function (sb) {}

/**
 * 主入口
 * @param dataSourceName 数据源名称
 * @param treeStructMap 树结构配置信息
 * @param loadLevel 动态加载层次
 */
let main = function (param) {
  let args = param.getArgs()
  let processInstanceId = args.length > 0 ? args[0] : null
  if (null == processInstanceId || '' == processInstanceId) {
    log.error('[WorkFlowGetProcessInstanceData.main]流程实例ID为空，请检查配置')
    return null
  }

  let expression = 'WorkFlowGetProcessInstanceData("' + processInstanceId + '")'

  let scope = scopeManager.getScope()
  let currentWindowCode = scope.getWindowCode()

  let result = operation.evalExpression({
    windowCode: currentWindowCode,
    expression: expression
  })
  if (result && result.success == true) {
    return result.data.result
  } else {
    throw new Error(
      '[WorkFlowGetProcessInstanceData.main]获取流程实例数据失败，result=' +
        result
    )
  }
  return result
}

export { initModule, main }
