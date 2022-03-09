import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let context

let rulecontext

export function initModule(sandBox) {}

const main = function (ruleContext: RuleContext) {
  let uatSHA1, bizSysId, vucUrl
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)
  let inputParams = inParamObj.inputParams
  let datas = inputParams.datas
  let paramValueMapLst = datas.values
  for (let index = 0; index < paramValueMapLst.length; index++) {
    let key = paramValueMapLst[index].paramKey
    let valueField = paramValueMapLst[index].paramValue

    context = new ExpressionContext()
    let routeRuntime = ruleContext.getRouteContext()
    context.setRouteContext(routeRuntime)

    let value = engine.execute({
      expression: valueField,
      context: context
    })

    if (key == 'uatSHA1') {
      uatSHA1 = value
    } else if (key == 'bizSysId') {
      bizSysId = value
    } else if (key == 'vucUrl') {
      vucUrl = value
    }
  }
  let paramMap = {}
  paramMap['biz_sys_id'] = bizSysId
  paramMap['useraccount_tgc_sha1'] = uatSHA1
  let postJson = jsonUtil.obj2json(paramMap)
  $.ajax({
    type: 'GET',
    url: vucUrl,
    data: { message: postJson },
    async: false,
    dataType: 'jsonp',
    jsonp: 'callback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
    jsonpCallback: 'flightHandler', //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
    success: function (msg) {
      let isExpireLogin = msg.vuc_login_is_expire
      // 设置业务返回值
      if (ruleContext.setBusinessRuleResult) {
        ruleContext.setBusinessRuleResult({
          isExpireLogin: isExpireLogin
        })
      }
      ruleContext.fireRouteCallback()
    }
  })
  ruleContext.markRouteExecuteUnAuto()

  return true
}

export { main }
