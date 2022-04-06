import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

//主入口(必须有)
let main = function (...args: any[]) {
  // 获取参数
  let isCurrentScope = args.length > 0 ? args[0] : true
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
        '[PrdBizWindowInstance.main]获取框架窗体信息异常，获取不到窗体信息！'
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
      '[PrdBizWindowInstance.main]获取框架窗体信息异常，获取不到窗体信息！'
    )
  }
  if (!isCurrentScope) {
    let parentScopeId = scopeManager.getParentScopeId(currentWindowScopeId)
    if (scopeManager.isWindowScope(parentScopeId)) {
      currentWindowScopeId = parentScopeId
    } else {
      // 获取父级窗体域
      let parentWindowScope2 = scopeManager.getParentWindowScope(parentScopeId)
      currentWindowScopeId = parentWindowScope2.getInstanceId()
    }
  }
  // 执行获取业务窗体实体信息
  let _func = scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
    handler: function () {
      let isExists = datasourceManager.exists({
        datasourceName: 'BizWindowInstance'
      })
      if (!isExists) {
        return ''
      }
      // 获取窗体所有的实体信息
      let datasources = datasourceManager.getAll()
      // 循环解析实体
      for (let i = 0; i < datasources.length; i++) {
        // 获取实体信息
        let datasouce = datasources[i]
        // 获取实体字段信息
        let metadata = datasouce.getMetadata()
        // 获取实体编码
        let datasourceName = metadata.getDatasourceName()
        if ('BizWindowInstance' == datasourceName) {
          // 获取当前记录
          let record = datasouce.getCurrentRecord()
          if (null != record) {
            // 单据实例
            let instanceComponentCode = record.get('instanceComponentCode')
            let instanceCode = record.get('instanceCode')
            if (
              null != instanceComponentCode &&
              null != instanceComponentCode
            ) {
              // 返回单据实例
              return instanceComponentCode + '.' + instanceCode
            }
          }
          return ''
        }
      }
    }
  })
  return _func()
}
export { main }
