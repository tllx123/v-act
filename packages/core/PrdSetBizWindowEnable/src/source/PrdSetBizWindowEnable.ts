import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

const initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  if (!args || args.length == 0) {
    throw new Error(
      '[PrdSetBizWindowEnable.main]设置业务单使能属性异常，PrdSetBizWindowEnable函数需要传入参数！'
    )
  }

  // 获取当前域信息ID
  let currentScopeId = scopeManager.getCurrentScopeId()
  // 当前窗体实例Id
  let currentWindowScopeId
  // 是否窗体域
  let isWindowScope = true
  // 若是ComponentScope，获取窗体域。这种是后台前端方法调用的情况
  if (scopeManager.isComponentScope(currentScopeId)) {
    // 获取窗体域信息
    let parentWindowScope = scopeManager.getParentWindowScope()
    if (!parentWindowScope) {
      throw new Error(
        '[PrdSetBizWindowEnable.main]设置业务单使能属性异常，获取不到窗体信息！'
      )
    }
    // 获取窗体实例Id
    currentWindowScopeId = parentWindowScope.getInstanceId()
    // 赋值非窗体域
    isWindowScope = false
  }
  // 若当前是WindowScope，直接获取窗体域信息。这种是直接在窗体中调用的情况
  if (scopeManager.isWindowScope(currentScopeId)) {
    // 获取窗体实例Id
    currentWindowScopeId = currentScopeId
  }
  let scope = scopeManager.getScope(currentWindowScopeId)
  let windowCode = scope.getWindowCode()

  // 设置使能属性
  let setEnable = function () {
    let currentWindowInputParams = windowParam.getInputs()
    if (!currentWindowInputParams) {
      return
    }
    let isWorkflowFrame = false
    let instance_componentCode = currentWindowInputParams.instance_componentCode
    // 非业务单据实例,不允许设置,直接返回
    if (!instance_componentCode) {
      // 若非业务单据先判断是否是流程框架中打开的单据
      let currentParentWindowScopeId =
        scopeManager.getParentScopeId(currentWindowScopeId)
      if (currentParentWindowScopeId) {
        // 判断是否是框架窗体
        isWorkflowFrame = scopeManager.createScopeHandler({
          scopeId: currentParentWindowScopeId,
          handler: function () {
            var isExist = windowParam.getInput({
              code: 'isProcessFrmeWindow'
            })
            return isExist
          }
        })()
      }
      // 即不是单据实例打开，也不是流程框架打开，直接返回
      if (isWorkflowFrame === false) {
        return
      }
    }
    /** 流程框架打开不考虑权限情况 **/
    // 单据打开情况
    if (instance_componentCode) {
      // 获取业务单权限信息
      let isBizWindowPrivilege = currentWindowInputParams.biz_window_privilege
      // 若是无权限，不可设置，直接返回
      if (isBizWindowPrivilege === false) {
        return
      }
    }

    // 获取入参
    let isEnable = args[0]
    if (isEnable === true) {
      // 设置不只读,允许设置后，在窗体可对控件使能只读等进行控制，resetable要传true
      widgetAction.executeComponentAction(
        'setReadOnly',
        windowCode,
        false,
        true
      )
    } else {
      // 设置只读,允许设置后，在窗体可对控件使能只读等进行控制，resetable要传true
      widgetAction.executeComponentAction('setReadOnly', windowCode, true, true)
    }
  }

  // 若是非窗体域，需开域执行
  if (isWindowScope == false) {
    let _func = scopeManager.createScopeHandler({
      scopeId: currentWindowScopeId,
      handler: function () {
        setEnable()
      }
    })
    _func()
  } else {
    setEnable()
  }
}

export { initModule, main }
