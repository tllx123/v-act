import { RuleContext as Context } from '@v-act/vjs.framework.extension.platform.interface.route'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import {
  MethodContext,
  RuleOutput
} from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

/**
 * 规则上下文定义
 * @constructor
 * @alias RuleContext
 * @catalog 二次开发/规则
 */
class RuleContext {
  ruleCtx: Context
  constructor(ruleCtx: Context) {
    this.ruleCtx = ruleCtx
  }
  _get() {
    return this.ruleCtx
  }
  /**
   * 获取规则输入配置
   * @param {String} code 配置编号
   * @returns Any
   */
  getInput(code: string) {
    return this.ruleCtx.getInput(code)
  }
  /**
   * 获取V平台对象
   * @returns {@link VObject}
   */
  getVObject() {
    return this.ruleCtx.getVObject()
  }
  /**
   * 获取规则输入配置个数
   * @returns Integer
   */
  getInputSize() {
    return this.ruleCtx.getInputSize()
  }
  /**
   * 实例化规则输出
   * @returns {@link RuleOutput}
   */
  newOutputVo() {
    return new RuleOutput(this.ruleCtx.newOutputVo())
  }
  /**
   * 获取V平台规则输入配置
   * @deprecated
   * @returns {@link Object}
   */
  getVplatformInput() {
    var ruleCfgValue = this.ruleCtx.getRuleCfg()
    var inParams = ruleCfgValue['inParams']
    if (inParams) {
      return jsonUtil.json2obj(inParams)
    }
    return null
  }
  /**
   * 获取方法上下文
   * @returns {@link MethodContext}
   */
  getMethodContext() {
    return new MethodContext(this.ruleCtx.getRouteContext())
  }

  /**
   * 设置规则返回值
   * @deprecated
   * @param {String} key 标识值
   * @param {Any} val 返回值
   */
  setResult(key: string, val: any) {
    var rs = this.ruleCtx.getAllBusinessRuleResult() || {}
    rs[key] = val
    this.ruleCtx.setBusinessRuleResult(rs)
  }
  /**
   * 获取循环对象，目前仅支持数据源实例
   * @param {String} code 循环变量编码
   * @return {Datasource} 数据源实例
   * */
  getForEachObj(code: string) {
    var routeContext = this.ruleCtx.getRouteContext()
    var ds = routeContext.getForEachVarDataSource(code)
    if (ds) {
      ds = ds._genDatasourceByDs(ds)
    }
    return ds
  }
  /**
   * 获取循环变量
   * @param {String} code 循环变量编码
   * */
  getForEachVar(code: string) {
    var routeContext = this.ruleCtx.getRouteContext()
    var record = routeContext.getForEachVarValue(code)
    if (record) {
      record = ds._genRecord(record)
    }
    return record
  }
  /**
   * 生成异步回调
   * @param {Function} 回调函数
   * @return {Function}
   * */
  genAsynCallback(func: (param: any) => void) {
    if (typeof func != 'function') {
      return func
    }
    return this.ruleCtx.genAsynCallback(func)
  }
  /**
   * 触发规则回调
   * */
  fireCallback() {
    this.ruleCtx.fireRuleCallback()
  }
}
export default RuleContext
