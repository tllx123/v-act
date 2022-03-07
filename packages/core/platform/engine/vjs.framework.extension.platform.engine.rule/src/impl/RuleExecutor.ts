import {
  ExpressionContext as ExpContext,
  ExpressionEngine as expEngine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'

import * as ruleFactory from './impl/RuleFactory'

let RuleExecutor = function (ruleContext) {
  this.ruleContext = ruleContext
  ruleContext.setRouteCallback(
    (function (executor) {
      return function () {
        executor.endTime = new Date().getTime()
        executor._fire(RuleExecutor.prototype.EVENTS.END)
      }
    })(this)
  )
  this.handlerMap = {}
  this.beginTime = 0
  this.endTime = 0
}

RuleExecutor.prototype = {
  initModule: function (s) {},
  /**
   * 注册事件
   */
  on: function (eventName, handler) {
    let handlers = this.handlerMap[eventName]
    if (!handlers) {
      handlers = []
      this.handlerMap[eventName] = handlers
    }
    handlers.push(handler)
  },
  /**
   * 触发事件
   */
  _fire: function (eventName) {
    let handlers = this.handlerMap[eventName]
    if (handlers && handlers.length > 0) {
      for (let i = 0, l = handlers.length; i < l; i++) {
        let h = handlers[i]
        h.apply(this, [])
      }
    }
  },
  /**
   * 执行规则
   */
  execute: function () {
    let ruleCfg = this.ruleContext.getRuleCfg()
    let rule = ruleFactory.create(ruleCfg.ruleCode)
    let mainFunc = rule.main,
      retValue
    this._fire(RuleExecutor.prototype.EVENTS.BEGIN)
    let tmpUUID = uuidUtil.generate()
    //监控标志 用于标识路由
    this.ruleContext._monitorSign = 'RULE_' + tmpUUID
    eventManager.fire({
      event: eventManager.Events.BeforeRuleExe,
      args: [this.ruleContext]
    })
    this.beginTime = new Date().getTime()
    if (this._evalCondition()) {
      try {
        retValue = mainFunc.call(this, this.ruleContext)
        retValue = typeof retValue == 'undefined' ? true : retValue
        this.ruleContext.setRuleStatus(retValue)
        if (this.ruleContext.isRouteExecuteAuto()) {
          this.ruleContext.fireRouteCallback()
        }
      } catch (e) {
        let ruleCfg = this.getRuleContext().getRuleCfg()
        throw factory.create({
          error: e,
          type: factory.TYPES.UnExpected,
          message:
            '[RuleExecutor.execute]规则【' +
            ruleCfg.ruleCode +
            '】执行失败，请检查内部逻辑。' +
            e.message
        })
      }
    } else {
      //如果条件不成功，则执行后续规则
      this.ruleContext.setRuleStatus(true)
      this.ruleContext.fireRouteCallback()
    }
    return retValue
  },

  _evalCondition: function () {
    let ruleCfg = this.ruleContext.getRuleCfg()
    // 获取规则执行条件
    let expression = ruleCfg.condition
    // 规则执行条件默认为可执行
    let condition = true
    try {
      // 只对设置执行条件的规则进行条件验证，条件成立才执行
      if (expression) {
        let context = new ExpContext()
        context.setRouteContext(this.ruleContext.getRouteContext())
        condition = expEngine.execute({
          expression: expression,
          context: context
        })
      }
    } catch (re) {
      let ruleCfg = this.getRuleContext().getRuleCfg()
      throw factory.create({
        error: re,
        type: factory.TYPES.UnExpected,
        message:
          '[RuleExecutor.execute]规则【' +
          ruleCfg.ruleCode +
          '】执行条件【' +
          expression +
          '】异常，请检查设置是否正确。' +
          re.message
      })
    }
    return condition
  },

  EVENTS: {
    //开始执行规则
    BEGIN: 'begin',
    //规则执行结束
    END: 'end'
  },
  /**
   * 获取规则执行时间
   * @return 毫秒数
   */
  getExeTime: function () {
    return this.endTime - this.beginTime
  },
  /**
   * 获取规则上下文
   */
  getRuleContext: function () {
    return this.ruleContext
  }
}

return RuleExecutor

export { execute, executeRouteRule, executeWithRouteCallback }
