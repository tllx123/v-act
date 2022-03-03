import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { Pay as pay } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let context
let undefined
let undefined
let undefined
exports.initModule = function (sBox) {}

//规则主入口(必须有)
let main = function (ruleContext) {
  context = new ExpressionContext()
  let routeRuntime = ruleContext.getRouteContext()
  context.setRouteContext(routeRuntime)
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let cfg = jsonUtil.json2obj(inParams)
  //必填字段
  let payNum = cfg.payNum //支付金额
  let payType = cfg.payType //支付类型  微信 wx  支付宝 alipay
  let subject = stringIsBlank(cfg.subject)
    ? ''
    : engine.execute({ expression: cfg.subject, context: context }) //商品标题
  let body = stringIsBlank(cfg.body)
    ? ''
    : engine.execute({ expression: cfg.body, context: context }) //描述信息
  //自定义字段  非必填
  let orderCode = stringIsBlank(cfg.orderCode)
    ? ''
    : engine.execute({ expression: cfg.orderCode, context: context }) //订单唯一号
  let projId = stringIsBlank(cfg.projId)
    ? ''
    : engine.execute({ expression: cfg.projId, context: context }) //项目ID
  let bizId = stringIsBlank(cfg.bizId)
    ? ''
    : engine.execute({ expression: cfg.bizId, context: context }) //业务ID
  let stage = stringIsBlank(cfg.stage)
    ? ''
    : engine.execute({ expression: cfg.stage, context: context }) //阶段号

  let liveMode = cfg.liveMode == 'true' ? 'true' : 'false' //true  真实支付场景  否则为模拟支付场景
  payNum = engine.execute({ expression: payNum, context: context })
  if (isNaN(payNum)) {
    dialogUtil.propmtDialog('表达式执行结果不合法，请检查表达式！', null, false)
    return false
  }
  if (payNum <= 0) {
    dialogUtil.propmtDialog('支付金额不能小于0！', null, false)
    return
  }

  payType = engine.execute({ expression: payType, context: context })
  if (isNaN(payType) && !typeof payType == 'string') {
    dialogUtil.propmtDialog('表达式执行结果不合法，请检查表达式！', null, false)
    return false
  }
  let extendInfoArray = cfg.extendInfo.datas.values
  let extendInfo = {}
  for (let i = 0; i < extendInfoArray.length; i = i + 1) {
    let code = extendInfoArray[i].code
    let value = extendInfoArray[i].value
    value = stringIsBlank(value)
      ? ''
      : engine.execute({ expression: value, context: context })
    extendInfo[code] = value
  }

  //封装
  let params = {
    channel: payType,
    amount: payNum,
    subject: subject,
    body: body,
    liveMode: liveMode,
    orderCode: orderCode,
    projId: projId,
    bizId: bizId,
    stage: stage,
    extendInfo: JSON.stringify(extendInfo)
  }

  //rs的返回值说明见：https://www.pingxx.com/api#charges-支付
  let success = function (rs) {
    rs.isSuccess = true
    rs.errorMsg = ''
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult(rs)
    }
    ruleContext.fireRouteCallback()
  }

  let fail = function (errorMsg) {
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult({
        isSuccess: false,
        errorMsg: errorMsg //错误信息
      })
    }
    ruleContext.fireRouteCallback()
  }

  if (typeof payNum == 'number') {
    payNum = payNum.toString()
  }
  pay.pay(params, success, fail)
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 判断字符串是否为空
 */
function stringIsBlank(str) {
  if (str == undefined || str == null || str == '') {
    return true
  } else {
    if (str.trim() == '') {
      return true
    } else {
      return false
    }
  }
}

export { main }
