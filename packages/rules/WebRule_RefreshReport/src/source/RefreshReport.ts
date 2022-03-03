import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import * as viewContext from 'module'
import * as viewModel from 'module'
import * as formulaUtil from 'module'
let undefined
let undefined
let undefined
let undefined
exports.initModule = function (sBox) {}
let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParamsValue = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParamsValue)
  let widgetId = inParamsObj['widgetId']
  let reportSelect = inParamsObj['reportSelect']
  let reportSelect = viewContext.getWidgetProperty(widgetId, 'ReportSelect')
  let datas = formulaUtil.evalExpression(
    'GenerateDrawReport("' + widgetId + '","' + reportSelect + '")'
  )
}

export { main }
