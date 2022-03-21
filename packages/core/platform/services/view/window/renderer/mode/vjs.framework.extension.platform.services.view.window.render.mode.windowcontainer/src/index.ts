import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function render(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var windowInputParams = params.inputs
  var inParams = params.inParams
  var ruleContext = params.ruleContext
  var businessRuleResult = params.businessRuleResult
  //初始化后，传新的窗体域id给规则
  var inited = params.inited

  /*获取是否异步属性*/
  var tmpIsAsyn = inParams.isAsyn == undefined ? false : inParams.isAsyn
  // 在组件容器中打开
  var containerControlCode = inParams['windowContainer']
  openWindowContainer(
    ruleContext,
    businessRuleResult,
    containerControlCode,
    componentCode,
    windowCode,
    windowInputParams,
    title,
    tmpIsAsyn,
    inited
  )
}

/**
 * 打开窗体组件容器
 */
var openWindowContainer = function (
  ruleContext,
  businessRuleResult,
  containerControlCode,
  componentCode,
  windowCode,
  windowInputParams,
  title,
  tmpIsAsyn,
  inited
) {
  var tmpActionHandler = null

  if (
    containerControlCode &&
    widgetContext.isWidgetExist(containerControlCode)
  ) {
    // 组件容器不为空并且对应控件存在则按照正常的方式
    tmpActionHandler = actionHandler
  }

  if (tmpActionHandler == null) {
    var windowScope = scopeManager.getWindowScope()
    var windowVueInstance = windowScope.get('windowVueInstance')
    if (windowVueInstance) {
      windowVueInstance.renderToJGMComponentContainer({
        widgetCode: containerControlCode,
        componentCode: componentCode,
        windowCode: windowCode,
        inputs: windowInputParams,
        title: title
      })
      return
    }
    throw new Error(
      '目标组件容器控件，请检查是否移除了此控件。编号:' + containerControlCode,
      undefined,
      undefined,
      exceptionFactory.TYPES.Config
    )
  }

  // 2015-11-25 卡住规则链不往下执行
  if (tmpIsAsyn == false) ruleContext.markRouteExecuteUnAuto()

  // 标注打开方式为container
  windowInputParams['variable']['formulaOpenMode'] = 'container'
  // 将标签页的ID传入，以提供给退出事件进行关闭
  windowInputParams['variable']['closeTabId'] = windowCode
  var windowInstanceCode = null
  var callBackFunc = function (windowInstanceCode) {
    if (typeof inited == 'function') {
      //由调用方自行设置规则返回值，避免多次规则链被多次释放导致后续逻辑执行多次
      inited(windowInstanceCode)
    } else {
      var businessRuleResult_new = {}
      businessRuleResult_new['windowInstanceCode'] = windowInstanceCode
      if (ruleContext.setBusinessRuleResult)
        ruleContext.setBusinessRuleResult(businessRuleResult_new)
      ruleContext.fireRuleCallback()
      if (tmpIsAsyn == false) {
        ruleContext.fireRouteCallback()
      }
    }
  }
  var containerId = tmpActionHandler.executeWidgetAction(
    containerControlCode,
    'getContainerIdByInfo',
    {
      componentCode: componentCode,
      windowCode: windowCode,
      title: title,
      otherInfo: ''
    }
  )
  if (containerId) {
    //组件容器中设置为始终隐藏页签时，每次打开组件时，都进行重新加载刷新处理，并且把其它隐藏的多余组件页面都清掉
    //处理逻辑过程：增加判断，当组件容器设置为始终隐藏tab页签时，新打开一个组件时都进行add操作来刷新处理（控件中，当遇到隐藏tab进行增加时,是先进行清空已打开的，然后再进行add）
    //因为可能有数据更新了，要先刷新,刷新后再激活
    var windowInputParams = {}
    windowInputParams['componentCode'] = componentCode
    var scopeIdBack = tmpActionHandler.executeWidgetAction(
      containerControlCode,
      'activeByComponentId',
      componentCode,
      windowCode,
      title,
      '',
      windowInputParams,
      {
        containerId: containerId
      }
    )
    callBackFunc(scopeIdBack)
  } else {
    var routeContext = ruleContext.getRouteContext()
    var dtd = $.Deferred()
    var completeCB = function () {
      dtd.resolve()
    }
    routeContext.addCompleteDeferred(dtd)
    var errorFunc = (function (ruleCtx) {
      return function (e) {
        ruleCtx.handleException(genException(ruleCtx, e))
      }
    })(ruleContext)
    tmpActionHandler.executeWidgetAction(
      containerControlCode,
      'add',
      {
        componentCode: componentCode,
        id: windowCode,
        isComponent: true,
        title: title,
        otherInfo: '',
        componentVariable: windowInputParams,
        //dengb：不需要传
        //"url" : viewModel.getCmpModule().getModuleUrl(windowCode, windowInputParams),
        selected: true,
        errorFunc: errorFunc,
        callback: callBackFunc,
        completed: completeCB
      },
      0
    )
  }
}
var genException = function (ruleContext, e) {
  if (e) {
    if (factory.isException(e)) {
      return e
    }
    if (e instanceof Error) {
      var ruleCfg = ruleContext.getRuleCfg()
      var exceptionType = factory.TYPES.System
      if (factory.isAcceptType(e.ExceptionType)) {
        exceptionType = e.ExceptionType
      }
      var scope = scopeManager.getScope()
      var componentCode = scope.getComponentCode()
      var windowCode = scopeManager.isWindowScope(scope.getInstanceId())
        ? scope.getWindowCode()
        : null
      return factory.create({
        error: e,
        exceptionDatas: [
          { name: '构件编码', code: 'componentCode', value: componentCode },
          { name: '窗体编码', code: 'windowCode', value: windowCode },
          {
            name: '规则实例名称',
            code: 'ruleInstanceName',
            value: ruleCfg.instanceName
          },
          {
            name: '规则实例编码',
            code: 'ruleInstanceCode',
            value: ruleCfg.instanceCode
          },
          { name: '规则编码', code: 'ruleCode', value: ruleCfg.ruleCode },
          { name: '规则名称', code: 'ruleName', value: ruleCfg.ruleName },
          { name: '规则配置', code: 'ruleConfig', value: ruleCfg }
        ],
        type: exceptionType,
        message:
          '规则【' + ruleCfg.ruleCode + '】执行失败，错误原因：' + e.message
      })
    }
  }
  return e
}
