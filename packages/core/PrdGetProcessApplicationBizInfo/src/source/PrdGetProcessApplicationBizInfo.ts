import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { Datasource as Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'

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
        '[PrdGetProcessApplicationBizInfo.main]获取流程应用业务单业务信息异常，获取不到窗体信息！'
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
      '[PrdGetProcessApplicationBizInfo.main]获取流程应用业务单业务信息异常，获取不到窗体信息！'
    )
  }

  let isApplicationStar
  let applicationCode
  let bizComponentId
  // 获取是否是流程应用启用
  debugger
  scopeManager.createScopeHandler({
    scopeId: currentWindowScopeId,
    handler: function () {
      // 获取流程应用编码
      applicationCode = windowParam.getInput({
        code: 'ApplicationCode'
      })
      // 获取业务表单信息
      bizComponentId = windowParam.getInput({
        code: 'BizComponentId'
      })
      if (applicationCode && bizComponentId) {
        isApplicationStar = true
      }
    }
  })()
  if (isApplicationStar === true) {
    let codes = bizComponentId.split('.')
    let bizComponentCode
    let bizWindowCode
    if (codes.length == 2) {
      bizComponentCode = codes[0]
      bizWindowCode = codes[1]
    }

    // 业务单的窗体域ID
    let bizWindowScopeId
    // 获取子域
    let childrenScopes = scopeManager.getChildrenScopes(currentWindowScopeId)
    if (!childrenScopes) {
      throw new Error(
        '[PrdGetProcessApplicationBizInfo.main]获取流程应用业务单业务信息异常，当前窗体无子窗体信息！'
      )
    }
    // 根据当前窗体的实例ID获取子窗体的实例ID
    for (let i = 0; i < childrenScopes.length; i++) {
      let childrenScope = childrenScopes[i]
      let instanceId = childrenScope.getInstanceId()
      let isWndowScope = scopeManager.isWindowScope(instanceId)
      if (isWndowScope == true) {
        bizWindowScopeId = instanceId
        break
      }
    }
    if (!bizWindowScopeId) {
      throw new Error(
        '[PrdGetProcessApplicationBizInfo.main]获取流程应用业务单业务信息异常，当前窗体获取不到子窗体信息！'
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
    let snapshotData = _func()
  } else {
    return
  }
  let routeContext = param.getRouteContext()
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  // 获取信息实体
  let applicationBizInfo = formulaUtil.execute({
    expression: 'BR_VAR_PARENT.applicationBizInfo',
    context: context
  })
  let records = []
  if (applicationBizInfo) {
    let record = applicationBizInfo.createRecord()
    record.set('bizComponentCode', bizComponentCode)
    record.set('bizWindowCode', bizWindowCode)
    record.set('applicationCode', applicationCode)
    record.set('snapshotData', snapshotData)
  }
  records.push(record)
  applicationBizInfo.insertRecords({
    records: records,
    position: Datasource.Position.AFTER
  })
}

export { initModule, main }
