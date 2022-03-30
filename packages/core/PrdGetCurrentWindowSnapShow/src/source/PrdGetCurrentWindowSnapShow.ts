import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'

const initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
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
        '[PrdGetCurrentWindowSnapShow.main]获取当前业务窗体快照信息异常，获取不到窗体信息！'
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
      '[PrdGetCurrentWindowSnapShow.main]获取当前业务窗体快照信息异常，获取不到窗体信息！'
    )
  }
  // 执行获取业务窗体实体信息
  let _func = scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
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

export { initModule, main }
