import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { Share as service } from '@v-act/vjs.framework.extension.platform.services.native.mobile.umeng'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'

let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

function main(ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let titleExp = inParamsObj['titleName']
  let contentExp = inParamsObj['content']
  let contentURLExp = inParamsObj['contentURL']
  let imgURLExp = inParamsObj['imgURL']
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let title = engine.execute({
    expression: titleExp,
    context: context
  })
  let content = engine.execute({
    expression: contentExp,
    context: context
  })
  let contentURL = engine.execute({
    expression: contentURLExp,
    context: context
  })
  let imgURL = engine.execute({
    expression: imgURLExp,
    context: context
  })
  let platArr = []
  if (
    inParamsObj.actionPlatform.datas &&
    inParamsObj.actionPlatform.datas.values
  ) {
    let length = inParamsObj.actionPlatform.datas.values.length
    let valuesArr = inParamsObj.actionPlatform.datas.values
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        let obj = valuesArr[i]
        platArr.push(obj.actionCode)
      }
    }
  }
  let success = function (rs) {
    setBusinessRuleResult(ruleContext, true)
    ruleContext.fireRouteCallback()
  }
  let error = function (rs) {
    setBusinessRuleResult(ruleContext, false)
    ruleContext.fireRouteCallback()
  }

  service.share(content, title, contentURL, imgURL, platArr, success, error)
  ruleContext.markRouteExecuteUnAuto()
}
function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isShareSuccess: result
    })
  }
}

export { main }
