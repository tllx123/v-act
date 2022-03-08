import ParamConfig from './ParamConfig'
import { TransactionInfo, RuleInstances } from './types'

const _get = function (obj: RouteConfig, attr: string, code: string) {
  //@ts-ignore
  let array = obj[attr]
  if (array) {
    for (let i = 0, c; (c = array[i]); i++) {
      if (c.getCode() == code) {
        return c
      }
    }
  }
  return null
}

/**
 * @namespace RouteConfig
 * @class RouteConfig
 * @author xiedh
 * @desc 活动集配置定义信息<br/>
 * 该定义无法直接创建，请使用活动集配置定义工厂创建({@link RouteConfigFactory#unSerialize|RouteConfigFactory})
 */
class RouteConfig {
  routeCode: string
  handler: (...args: any[]) => void
  outputs: Array<ParamConfig> | null
  inputs: Array<ParamConfig> | null
  variables: Array<ParamConfig> | null
  __transcationInfo__: TransactionInfo
  ruleInstances: RuleInstances
  transactionType: string
  constructor(
    routeCode: string,
    handler: (...args: any[]) => void,
    inputs: Array<ParamConfig> | null,
    outputs: Array<ParamConfig> | null,
    variables: Array<ParamConfig> | null,
    transactionInfo: TransactionInfo,
    ruleInstances: RuleInstances,
    transactionType: string
  ) {
    this.routeCode = routeCode
    this.handler = handler
    this.outputs = outputs
    this.inputs = inputs
    this.variables = variables
    this.__transcationInfo__ = transactionInfo
    this.ruleInstances = ruleInstances
    this.transactionType = transactionType
  }

  /**
   *设置活动集编号
   * @param {String} 活动集编号
   */
  setCode(routeCode: string) {
    this.routeCode = routeCode
  }

  /**
   *获取活动集编号
   * @return String
   */
  getCode() {
    return this.routeCode
  }

  /**
   * 设置活动集执行句柄
   * @param {Function} 活动集执行句柄
   */
  setHandler(handler: (...args: any[]) => void) {
    this.handler = handler
  }

  /**
   * 获取活动集执行句柄
   * @return Function
   */
  getHandler() {
    return this.handler
  }

  /**
   *设置活动集输入参数定义
   * @param {Array<{@link ParamConfig}>} inputs 输入参数
   */
  setInputs(inputs: Array<ParamConfig>) {
    this.inputs = inputs
  }

  /**
   * 获取活动集所有输入参数定义
   * @return Array<{@link ParamConfig}>
   */
  getInputs() {
    return this.inputs
  }

  /**
   *获取活动集指定输入参数配置
   * @param {String} code 输入参数编号
   * @return {@link ParamConfig}
   */
  getInput(code: string) {
    return _get(this, 'inputs', code)
  }

  /**
   * 设置活动集输出参数定义
   * @param {Array<{@link ParamConfig}>} 输出参数
   */
  setOutputs(outputs: Array<ParamConfig>) {
    this.outputs = outputs
  }

  /**
   * 获取活动集所有输出参数
   * @return Array<{@link ParamConfig}>
   */
  getOutputs() {
    return this.outputs
  }

  /**
   * 获取活动集指定输出参数定义
   * @param {String} code 输出参数编号
   * @return {@link ParamConfig}
   */
  getOutput(code: string) {
    return _get(this, 'outputs', code)
  }

  /**
   *设置活动集变量定义
   * @param {Array<{@link ParamConfig}>} 活动集变量定义
   */
  setVars(vars: Array<ParamConfig>) {
    this.variables = vars
  }

  /**
   *获取活动集所有变量配置
   *  @return Array<{@link ParamConfig}>
   */
  getVars() {
    return this.variables
  }

  /**
   * 获取活动集指定变量配置
   * @param {String} code 变量编号
   * @return {@link ParamConfig}
   */
  getVar(code: string) {
    return _get(this, 'variables', code)
  }

  /**
   * 设置活动集事务信息
   * @param {Object} 事务信息
   * {
   * 		规则实例id: { 规则实例id
   * 			preInstanceIds : Array<String> 前置规则实例ids，
   * 			transactionType : String 事务类型
   * 		}
   * 	}
   */
  setTranscationInfo(transactionInfo: TransactionInfo) {
    this.__transcationInfo__ = transactionInfo
  }

  /**
   * 获取活动集事务信息
   * @return Object
   */
  getTranscationInfo() {
    return this.__transcationInfo__
  }

  /**
   *设置规则实例信息
   * @param {Object} ruleInstances 规则实例信息
   * {
   * 		规则实例编号:{
   * 			"ruleName": String 规则名称,
   *		    "condition": String 规则执行条件,
   *			"inParams": String 规则配置,
   *			"ruleCode": String 规则编号,
   *			"enable": Boolean 是否启用,
   *			"needLog": Boolean 是否记录日志,
   *			"instanceCode": String 规则实例编号,
   *			"transactionType": String 事务类型
   * 		}
   * }
   */
  setRuleInstances(ruleInstances: RuleInstances) {
    this.ruleInstances = ruleInstances
  }

  /**
   * 获取所有规则实例信息
   * @return Object
   */
  getRuleInstances() {
    return this.ruleInstances
  }

  /**
   * 根据规则编号获取规则实例信息
   * @param Object
   */
  getRuleInstance(instanceCode: string) {
    let ruleInstance = null
    if (this.ruleInstances) {
      ruleInstance = this.ruleInstances[instanceCode]
    }
    return ruleInstance
  }
  /**
   * 获取活动集类型
   */
  getTransactionType() {
    return this.transactionType
  }
}

export default RouteConfig
