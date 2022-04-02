import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'

//主入口(必须有)
let main = function (...args: any[]) {
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
        '[PrdSetBizFormStateInfo.main]触发流程框架动作数据变化异常，获取不到窗体信息！'
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
  // 获取框架信息
  let type = getCurrentFrameWindowType(currentWindowScopeId)
  // 有值说明当前所在的窗体就是框架窗体，返回当前框架窗体类型
  if (type) {
    return type
  }

  // 获取业务单的父窗体信息
  let parentWindowScopeId = scopeManager.getParentScopeId(currentWindowScopeId)
  if (!parentWindowScopeId) {
    return ''
  }
  let parentWindowScope = scopeManager.getScope(parentWindowScopeId)
  parentWindowScopeId = parentWindowScope.getInstanceId()
  // 获取框架信息
  type = getCurrentFrameWindowType(parentWindowScopeId)
  return type
}

function getCurrentFrameWindowType(currentScopeId: string) {
  let processFrmeWindow = scopeManager.createScopeHandler({
    scopeId: currentScopeId,
    handler: function () {
      // 获取是否是流程框架窗体标识，判断是否是流程框架窗体
      let isProcessFrmeWindow = windowParam.getInput({
        code: 'isProcessFrmeWindow'
      })
      return isProcessFrmeWindow
    }
  })

  let isProcessFrmeWindow = processFrmeWindow()
  // 获取到流程框架窗体的信息
  if (isProcessFrmeWindow === true) {
    return 'workflow_frame'
  }

  //
  let bizFrameWindow = scopeManager.createScopeHandler({
    scopeId: currentScopeId,
    handler: function () {
      // 获取窗体所有的实体信息
      let frameMenu = datasourceManager.lookup({
        datasourceName: 'FrameMenu'
      })
      if (frameMenu) {
        return true
      }
    }
  })

  let isBizFrameWindow = bizFrameWindow()
  if (isBizFrameWindow === true) {
    return 'biz_frame'
  }
  return ''
}
export { main }
