import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
let undefined
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let systemVarNames = inParamsObj['systemVarNames'] // 赋值字段的fieldName
  if (
    undefined != systemVarNames &&
    null != systemVarNames &&
    systemVarNames.length > 0
  ) {
    componentParam.refreshVariant({
      codes: systemVarNames
    })
  }
}

export { main }
