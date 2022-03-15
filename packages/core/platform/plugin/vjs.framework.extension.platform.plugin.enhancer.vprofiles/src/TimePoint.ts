export default class TimePoint {
  time: Date
  type: string
  key: string
  series
  componentCode: string
  componentName: string
  windowCode: string
  windowName: string
  funCode: string
  funName: string
  ruleCode: string
  ruleName: string
  ruleInstanceCode: string
  rpcCode: string
  parentKey: string
  scopeId: string
  parentScopeId: string

  constructor(params: Record<string, any>) {
    this.time = new Date()
    this.type = params.type
    this.key = params.key
    this.series = params.series
    this.componentCode = params.componentCode
    this.componentName = params.componentName
    this.windowCode = params.windowCode
    this.windowName = params.windowName
    this.funCode = params.funCode
    this.funName = params.funName
    this.ruleCode = params.ruleCode
    this.ruleName = params.ruleName
    this.ruleInstanceCode = params.ruleInstanceCode
    this.rpcCode = params.rpcCode
    this.parentKey = params.parentKey
    this.scopeId = params.scopeId
    this.parentScopeId = params.parentScopeId
  }

  getComponentCode() {
    return this.componentCode
  }

  setComponentCode(componentCode: string) {
    this.componentCode = componentCode
  }

  getComponentName() {
    return this.componentName
  }

  setComponentName(componentName: string) {
    this.componentName = componentName
  }

  getWindowCode() {
    return this.windowCode
  }

  setWindowCode(windowCode: string) {
    this.windowCode = windowCode
  }

  getWindowName() {
    return this.windowName
  }

  setWindowtName(windowName: string) {
    this.windowName = windowName
  }

  getFunCode() {
    return this.funCode
  }

  setFunCode(funCode: string) {
    this.funCode = funCode
  }

  getFunName() {
    return this.funName
  }

  setFuntName(funName: string) {
    this.funName = funName
  }

  getRuleCode() {
    return this.ruleCode
  }

  setRuleCode(ruleCode: string) {
    this.ruleCode = ruleCode
  }

  getRuleName() {
    return this.ruleName
  }

  setRuletName(ruleName: string) {
    this.ruleName = ruleName
  }

  getRuleInstanceCode() {
    return this.ruleInstanceCode
  }

  setRuletInstanceCode(ruleInstanceCode: string) {
    this.ruleInstanceCode = ruleInstanceCode
  }

  getRPCCode() {
    return this.rpcCode
  }

  setRPCCode(rpcCode: string) {
    this.rpcCode = rpcCode
  }

  getTime() {
    return this.time
  }

  getType() {
    return this.type
  }

  getKey() {
    return this.key
  }

  getSeries() {
    return this.series
  }

  getParentKey() {
    return this.parentKey
  }

  setParentKey(parentKey: string) {
    this.parentKey = parentKey
  }

  getScopeId() {
    return this.scopeId
  }

  setScopeId(scopeId: string) {
    this.scopeId = scopeId
  }

  getParentScopeId() {
    return this.parentScopeId
  }

  getTypeCode() {
    let series = this.series
    let typeCode = ''
    switch (series) {
      case 1:
        typeCode = 'type-method'
        break
      case 2:
        typeCode = 'type-rule'
        break
      case 4:
        typeCode = 'type-win'
        break
      case 5:
        typeCode = 'type-widget'
        break
      default:
        typeCode = 'type-net'
        break
    }
    return typeCode
  }

  getTipDom(data: any, time: any) {
    let dom = ''
    let type = time.type
    let componentCode = time.getComponentCode()
    switch (type) {
      case 1:
      case -1:
        var funCode = time.getFunCode()
        var winCode = time.getWindowCode()
        var ruleCode = time.getRuleCode()
        var ruleName = time.getRuleName()
        var ruleInstanceCode = time.getRuleInstanceCode()
        var count = data.to - data.from
        dom =
          '<dl class="item-summary">' +
          '<dt>' +
          ruleName +
          '(' +
          ruleInstanceCode +
          ') 执行耗时信息</dt>' +
          (ruleName ? '<dd>规则名称：' + ruleName + '</dd>' : '') +
          '<dd>所属构件：' +
          componentCode +
          '</dd>' +
          (winCode ? '<dd>所属窗体：' + winCode + '</dd>' : '') +
          '<dd>所属方法：' +
          funCode +
          '</dd>' +
          '<dd>耗时：<span><i class="rect-method"></i>' +
          count +
          'ms</span></dd>' +
          (ruleCode == 'ExecuteRuleSet' || ruleCode == 'OpenComponentReturnData'
            ? '<dd style="text-align:center;">双击查看详情</dd>'
            : '') +
          '</dl>' +
          '<i class="icon-arrow"></i>'
        break
      case 2:
      case -2:
        var funCode = time.getFunCode()
        var winCode = time.getWindowCode()
        var count = data.to - data.from
        dom =
          '<dl class="item-summary">' +
          '<dt>方法：' +
          funCode +
          ' 执行耗时信息</dt>' +
          '<dd>所属构件：' +
          componentCode +
          '</dd>' +
          (winCode ? '<dd>所属窗体：' + winCode + '</dd>' : '') +
          '<dd>耗时：<span><i class="rect-method"></i>' +
          count +
          'ms</span></dd>' +
          '</dl>' +
          '<i class="icon-arrow"></i>'
        break
      case 3:
      case -3:
      case 4:
      case -4:
      case 5:
      case -5:
        var name = ''
        if (type == 3) name = '加载'
        else if (type == 4) name = '渲染'
        else name = '初始化'
        var winCode = time.getWindowCode()
        var count = data.to - data.from
        dom =
          '<dl class="item-summary">' +
          '<dt>窗体：' +
          winCode +
          ' ' +
          name +
          '耗时信息</dt>' +
          '<dd>所属构件：' +
          componentCode +
          '</dd>' +
          '<dd>耗时：<span><i class="rect-method"></i>' +
          count +
          'ms</span></dd>' +
          '</dl>' +
          '<i class="icon-arrow"></i>'
        break
      case 6:
      case -6:
        var count = data.to - data.from
        dom =
          '<dl class="item-summary">' +
          '<dt>构件：' +
          componentCode +
          ' 加载耗时信息</dt>' +
          '<dd>耗时：<span><i class="rect-method"></i>' +
          count +
          'ms</span></dd>' +
          '</dl>' +
          '<i class="icon-arrow"></i>'
        break
      case 7:
      case -7:
        var funCode = time.getFunCode()
        var winCode = time.getWindowCode()
        var rpcCode = time.getRPCCode()
        var count = data.to - data.from
        dom =
          '<dl class="item-summary">' +
          '<dt>请求：' +
          rpcCode +
          ' 执行耗时信息</dt>' +
          '<dd>所属构件：' +
          componentCode +
          '</dd>' +
          (winCode ? '<dd>所属窗体：' + winCode + '</dd>' : '') +
          '<dd>耗时：<span><i class="rect-method"></i>' +
          count +
          'ms</span></dd>' +
          '</dl>' +
          '<i class="icon-arrow"></i>'
        break
    }
    return dom
  }

  static Types = {
    BeforeRuleExe: -1,
    AfterRuleExe: 1,

    BeforeRouteExe: -2,
    AfterRouteExe: 2,

    BeforeWindowLoad: -3,
    AfterWindowLoad: 3,

    BeforeWindowRender: -4,
    AfterWindowRender: 4,

    BeforeWindowInit: -5,
    AfterWindowInit: 5,

    BeforeComponentInit: -6,
    AfterComponentInit: 6,

    BeforeRPC: -7,
    AfterRPC: 7
  }

  static Series = {
    Route: 1,
    Rule: 2,
    Network: 3,
    Window: 4,
    Component: 5
  }
}
