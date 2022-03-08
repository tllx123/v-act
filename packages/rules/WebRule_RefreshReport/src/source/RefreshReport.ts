import * as formulaUtil from 'module'
import * as viewContext from 'module'

import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}
const main = function (ruleContext) {
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
