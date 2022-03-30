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
  if (args.length != 3) {
    throw new Error(
      '[PrdSetBizFormEnableByWindowInstanceCode.main]设置业务单使能属性异常，输入参数为空！'
    )
  }
  // 获取入参
  let isEnable = args[0]
  let isFrame = args[1]
  let instanceCode = args[2]
  // 设置只读方法
  let _setReadOnlyFunc = function (instanceCode, windowCode) {
    let _exec = scopeManager.createScopeHandler({
      scopeId: instanceCode,
      handler: function () {
        if (isEnable == true) {
          // 设置不只读
          widgetAction.executeComponentAction('setReadOnly', windowCode, false)
        } else {
          // 设置只读
          widgetAction.executeComponentAction('setReadOnly', windowCode, true)
        }
      }
    })
    _exec()
  }
  // 获取业务框架
  let _getWFFrame = function (parentInstanceCode) {
    let childScopes = scopeManager.getChildrenScopes(parentInstanceCode)
    if (childScopes != null) {
      for (let i = 0; i < childScopes.length; i++) {
        let childScope = childScopes[i]
        let instanceCode = childScope.getInstanceId()
        if (scopeManager.isWindowScope(instanceCode)) {
          let isWFFrame = scopeManager.createScopeHandler({
            scopeId: instanceCode,
            handler: function () {
              var isFMExist = datasourceManager.exists({
                datasourceName: 'FrameMenu'
              })
              var isPMExist = datasourceManager.exists({
                datasourceName: 'ProcessMenu'
              })
              if (isFMExist == true || isPMExist == true) {
                return true
              } else {
                return false
              }
            }
          })()
          // 判断是否业务框架
          if (isWFFrame == true) {
            return instanceCode
          } else {
            _getWFFrame(instanceCode)
          }
        }
      }
    }
  }
  if (isFrame == true) {
    // 获取业务框架
    let frameInstanceCode = _getWFFrame(instanceCode)
    if (frameInstanceCode != null) {
      let childScopes = scopeManager.getChildrenScopes(frameInstanceCode)
      if (childScopes != null) {
        for (let i = 0; i < childScopes.length; i++) {
          let childScope = childScopes[i]
          let instanceCode = childScope.getInstanceId()
          if (scopeManager.isWindowScope(instanceCode)) {
            // 控制单据体
            let windowCode = scopeManager.getScope(instanceCode).getWindowCode()
            _setReadOnlyFunc(instanceCode, windowCode)
          }
        }
      }
    }
  } else {
    if (scopeManager.isWindowScope(instanceCode)) {
      let windowCode = scopeManager.getScope(instanceCode).getWindowCode()
      _setReadOnlyFunc(instanceCode, windowCode)
    }
  }
}

export { initModule, main }
