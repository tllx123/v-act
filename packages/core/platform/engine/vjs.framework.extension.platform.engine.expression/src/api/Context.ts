import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { FunctionEngine } from '@v-act/vjs.framework.extension.platform.engine.function'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'

export default class Context {
  getComponontVar = (name: string) => WindowParam.getInput({ code: name })

  getWindowVar = (name: string) => (name: string) =>
    WindowParam.getInput({ code: name })

  getRecordValue(entityCode: string, fieldCode: string) {
    let datasource = RouteContext.getOutPutParam(entityCode)

    if (datasource) {
      var row
      if (RouteContext.hasCurrentRecord(entityCode))
        row = RouteContext.getCurrentRecord(entityCode)
      else if (RouteContext.hasRecordIndex(entityCode))
        row = datasource.getRecordById(RouteContext.getRecordIndex(entityCode))
      else row = datasource.getCurrentRecord()

      // 如果上面都取不到记录，则取数据源的第一行记录
      row = row ? row : datasource.getRecordByIndex(0)
      return row ? row.get(fieldCode) : null
    }
  }

  getWidgetProperty(widgetCode: string, propertyCode: string) {
    if (widgetCode && propertyCode) {
      return WidgetProperty.get(widgetCode, propertyCode)
    }
    throw new Error('[Context.getWidgetProperty]获取失败，参数缺失！')
  }

  executeFunction() {
    if (arguments.length < 1)
      throw new Error('[Context.executeFunction]运行失败，未传参！')

    let functionName: string = arguments[0]
    let args = []

    for (let i = 0; i < arguments.length; i++) {
      if (i < 1) continue
      let result: Function = new Function('context', `return ${arguments[i]}`)
      args.push(result(this))
    }

    return FunctionEngine.execute({
      functionName: functionName,
      context: new FunctionContext(
        args,
        context.get('expressionContext').getRouteContext()
      )
    })
  }

  getRuleBusinessResult(instanceCode: string, resultCode: string) {
    return RouteContext.getBusinessRuleResult(instanceCode, resultCode)
  }

  getRulesetEntityFieldInput(entityName: string) {}

  getRulesetEntityFieldOut(entityName: string) {}

  getRulesetEntityFieldVar(entityName: string) {}

  getRulesetInput(entityName: string) {
    return RouteContext.getOutPutParam(entityName)
  }

  getRulesetVar(entityName: string) {
    return RouteContext.getVariable(entityName)
  }
}
