/**
 *@class Operation
 * @desc 请求操作<br/>
 * 前端对后台发起一次请求时({@link Request}),可以包含有多次操作({@link Operation})。<br/>
 * vjs名称：vjs.framework.extension.platform.interface.rpc.operation<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.rpc.operation.Operation<br/>
 */
export default class Operation {
  params: Record<string, any> = {}
  componentCode: string = ''
  windowCode: string = ''
  transactionId: string = ''
  requestData: Record<string, any> = {}
  operation: string = ''
  beforeRequest: Function = () => {}
  afterResponse: Function = () => {}
  exceptionHanlder: Function = () => {}
  sourceWindow: string = ''
  constructor() {}

  /**
   *  添加参数信息
   * @param {String} key 参数名称
   * @param {Any} val 参数值
   */
  addParam(key: string, val: any) {
    this.params[key] = val
  }

  /**
   *  批量添加参数信息
   * @param {Object} params 参数信息
   */
  addParams(params: Record<string, any>) {
    if (!params) return
    for (let key in params) {
      this.addParam(key, params[key])
    }
  }

  /**
   * 获取所有参数信息
   * @return Object
   */
  getParams() {
    return this.params
  }

  /**
   *  设置操作类型：与后台配置对应
   * @param {String} operation 操作类型
   */
  setOperation(operation: string) {
    this.operation = operation
  }

  /**
   * 获取操作类型
   * @return String
   */
  getOperation() {
    return this.operation
  }

  /**
   *  设置请求发起前动作
   * @param {Function} func
   */
  setBeforeRequest(func: Function) {
    this.beforeRequest = func
  }

  /**
   * 获取请求发起前动作
   * @return Function
   */
  getBeforeRequest() {
    return this.beforeRequest
  }

  /**
   *  设置请求后回调
   * @param {Function} func
   */
  setAfterResponse(func: Function) {
    this.afterResponse = func
  }

  /**
   * 执行请求后回调
   */
  callAfterResponse() {
    if (typeof this.afterResponse == 'function') {
      this.afterResponse.apply(this, arguments)
    }
  }

  /**
   *  设置构件编号
   * @param {String} componentCode 构件编号
   */
  setComponentCode(componentCode: string) {
    this.componentCode = componentCode
  }

  /**
   *  获取构件编号
   * @return String
   */
  getComponentCode() {
    return this.componentCode
  }

  /**
   *  设置窗体编号
   * @param {String} windowCode 窗体编号
   */
  setWindowCode(windowCode: string) {
    this.windowCode = windowCode
  }

  /**
   * 获取窗体编号
   *＠return String
   */
  getWindowCode() {
    return this.windowCode
  }

  /**
   *  设置事务实例Id
   * @param {String} transactionId 事务实例Id
   */
  setTransactionId(transactionId: string) {
    this.transactionId = transactionId
  }

  /**
   * 获取事务实例Id
   * @return String
   */
  getTransactionId() {
    return this.transactionId
  }

  /**
   * 设置来源窗体
   * @param {String} sourceWindow 来源窗体（格式：构件编码.窗体编码）
   * */
  setSourceWindow(sourceWindow: string) {
    this.sourceWindow = sourceWindow
  }

  /**
   * 获取来源窗体
   * */
  getSourceWindow() {
    return this.sourceWindow
  }
}
