import { widgetContext as widgetContext } from 'vjs.framework.extension.widget.manager'

let getMenuDataByRuleSet = function (widgetId) {
  let isAsync = false //(typeof(config.isAsync) == "undefined") ? false : config.isAsync;
  let isInRuleChainTransaction = false
  let widget = widgetContext.get(widgetId, 'widgetObj')
  let params = widget.Param && widget.Param.invokeParams
  //let componentCode = viewContext.getComponentCode()
  let backVal: { [code: string]: any } = {}
  for (let i = 0, num = params.length; i < num; i++) {
    let param = params[i]
    if (param['paramType'] == 'expression') {
      let value = ''
      if (param['paramValue'] != '' && param['paramValue'] != null)
        value = formulaUtil.evalExpression(param['paramValue'])
      backVal[param['paramCode']] = value
    } else if (param['paramType'] == 'returnEntity') {
      //				var smartclientDB = sandBox.getService("vjs.framework.extension.system.datasource.factory").getDBServiceWithType("smartclient");
      //				var db = smartclientDB.unSerialze(param);
      //				backVal[param["paramCode"]] = db;
    }
  }
  let result = operationLib.executeRuleSet(
    { ruleSetCode: widget.ActivityAttribute, params: backVal },
    function (ruleSetResult) {
      if (ruleSetResult.data.result.menuJson != null) {
        let data = eval(ruleSetResult.data.result.menuJson.value)
        if (data && data.length > 0 && data[0].submenu) {
          let renderer = sandBox.getService(
            'vjs.framework.extension.ui.common.plugin.services.Renderer'
          )
          renderer.executeWidgetAction(
            widgetId,
            'setDataToMenu',
            data[0].submenu,
            data[1]
          )
        }
      }
    }
  )
}

export { menuEvent, MenuData, getMenuDataByRuleSet }
