import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

//主入口(必须有)
let main = function (...args: any[]) {
  // 获取业务单ID
  let componentId = args.length > 0 ? args[0] : null
  // 获取当前域信息ID
  let currentScopeId = scopeManager.getCurrentScopeId()
  // 当前窗体实例Id
  let currentWindowScopeId
  // 若是ComponentScope，获取窗体域。这种是后台前端方法调用的情况
  if (scopeManager.isComponentScope(currentScopeId)) {
    // 获取窗体域信息
    let parentWindowScope = scopeManager.getParentWindowScope()
    if (!parentWindowScope) {
      throw new Error(
        '[PrdGetBizWindowSnapShowInfo.main]获取业务窗体快照信息异常，获取不到窗体信息！'
      )
    }
    // 获取窗体实例Id
    currentWindowScopeId = parentWindowScope.getInstanceId()
  }
  // 若当前是WindowScope，直接获取窗体域信息。这种是直接在窗体中调用的情况
  if (scopeManager.isWindowScope(currentScopeId)) {
    // 获取窗体实例Id
    currentWindowScopeId = currentScopeId
  }
  if (!currentWindowScopeId) {
    throw new Error(
      '[PrdGetBizWindowSnapShowInfo.main]获取业务窗体快照信息异常，获取不到窗体信息！'
    )
  }
  // 获取子域
  let childrenScopes = scopeManager.getChildrenScopes(currentWindowScopeId)
  if (!childrenScopes) {
    throw new Error(
      '[PrdGetBizWindowSnapShowInfo.main]获取业务窗体快照信息异常，当前窗体无子窗体信息！'
    )
  }
  // 根据当前窗体的实例ID获取子窗体的实例ID
  let bizWindowScopeId
  for (let i = 0; i < childrenScopes.length; i++) {
    let childrenScope = childrenScopes[i]
    let instanceId = childrenScope.getInstanceId()
    let isWndowScope = scopeManager.isWindowScope(instanceId)
    if (isWndowScope == true) {
      if (null == componentId || '' == componentId) {
        bizWindowScopeId = instanceId
        break
      } else {
        let componentCode = childrenScope.getComponentCode()
        let windowCode = childrenScope.getWindowCode()
        // 当前获取构件窗体
        let bizComponentId = componentCode + '.' + windowCode
        if (componentId == bizComponentId) {
          bizWindowScopeId = instanceId
          break
        }
      }
    }
  }
  if (!bizWindowScopeId) {
    throw new Error(
      '[PrdGetBizWindowSnapShowInfo.main]获取业务窗体快照信息异常，当前窗体获取不到子窗体信息！'
    )
  }
  // 执行获取业务窗体实体信息
  let _func = scopeManager.createScopeHandler({
    scopeId: bizWindowScopeId,
    handler: function () {
      // 获取窗体所有的实体信息
      let datasources = datasourceManager.getAll()
      if (datasources) {
        let entitiesObj = {}
        // 循环解析实体
        for (let i = 0; i < datasources.length; i++) {
          // 获取实体信息
          let datasouce = datasources[i]
          // 获取实体字段信息
          let metadata = datasouce.getMetadata()
          // 获取实体编码
          let datasourceName = metadata.getDatasourceName()
          // 序列化
          let tempDBObj = datasouce.serialize()
          // 存放到集合中
          entitiesObj[datasourceName] = tempDBObj
        }
        // 转json
        let retVar = jsonUtil.obj2json(entitiesObj)
        return retVar
      }
    }
  })
  return _func()
}
export { main }
