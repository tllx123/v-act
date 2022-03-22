import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { FunctionEngine } from '@v-act/vjs.framework.extension.platform.engine.function'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

export default class Context {
  private context: any
  private routeContext: any

  constructor(context: any) {
    this.context = context
    this.routeContext = context.routeContext
  }
  /**
   * 获取构件变量
   * */
  getComponontVar = (name: string) => WindowParam.getInput({ code: name })

  /**
   * 获取全局变量
   * */
  getWindowVar = (name: string) => {
    let val = WindowParam.getInput({ code: name })

    // 临时方案,解决无法单独获取表达式中的“变量-值”对的问题
    com.toone.itop.formula.FormulaTreeExtra.saveVariableValue(
      this.context,
      name,
      val
    )

    WindowParam.getInput({ code: name })
  }

  /**
   * 获取全局变量
   * */
  getRecordValue(entityCode: string, fieldCode: string) {
    let datasource = this.routeContext.getOutPutParam(entityCode)

    if (datasource) {
      var row
      if (this.routeContext.hasCurrentRecord(entityCode))
        row = this.routeContext.getCurrentRecord(entityCode)
      else if (this.routeContext.hasRecordIndex(entityCode))
        row = datasource.getRecordById(
          this.routeContext.getRecordIndex(entityCode)
        )
      else row = datasource.getCurrentRecord()

      // 如果上面都取不到记录，则取数据源的第一行记录
      row = row ? row : datasource.getRecordByIndex(0)
      return row ? row.get(fieldCode) : null
    }
  }

  /**
   * 获取WidgetProperty 语法值
   * */
  getWidgetProperty(widgetCode: string, propertyCode: string) {
    if (widgetCode && propertyCode) {
      return WidgetProperty.get(widgetCode, propertyCode)
    }
    throw new Error('[Context.getWidgetProperty]获取失败，参数缺失！')
  }

  /**
   * 函数运行
   * */
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
      context: new FunctionContext(args, this.routeContext)
    })
  }

  /**
   * 获取业务规则执行结果
   */
  getRuleBusinessResult(instanceCode: string, resultCode: string) {
    return this.routeContext.getBusinessRuleResult(instanceCode, resultCode)
  }

  /**
   *获取活动集输入实体参数的字段值
   *格式：BR_IN_PARENT.[入參英文名字].[字段名称]
   */
  getRulesetEntityFieldInput(entityName: string, fieldName: string) {
    let ctx = this.context.get('expressionContext')

    if (this.routeContext) {
      let datasource = this.routeContext.getInputParam(entityName)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(entityName))
          row = ctx.getCurrentRecord(entityName)
        else if (ctx.hasRecordIndex(entityName))
          row = datasource.getRecordById(ctx.getRecordIndex(entityName))
        else row = datasource.getCurrentRecord()
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldName) : null
      } else {
        throw Error(
          '[ExpressionEngine.evaluateBrInFieldVariable]获取活动集输入实体参数的字段值失败！活动集输入参数实体不存在，数据源名称：' +
            entityName +
            ',字段名称:' +
            fieldName
        )
      }
    } else {
      throw Error(
        '[ExpressionEngine.evaluateBrInFieldVariable]获取活动集输入实体参数的字段值失败！路由上下文不存在，数据源名称：' +
          entityName +
          ',字段名称:' +
          fieldName
      )
    }
  }

  /**
   *获取活动集输出实体参数的字段值
   *格式：BR_OUT_PARENT.[入參英文名字].[字段名称]
   */
  getRulesetEntityFieldOut(entityName: string, fieldName: string) {
    let ctx = this.context.get('expressionContext')
    if (this.routeContext) {
      let datasource = this.routeContext.getOutPutParam(entityName)
      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(entityName))
          row = ctx.getCurrentRecord(entityName)
        else if (ctx.hasRecordIndex(entityName))
          row = datasource.getRecordById(ctx.getRecordIndex(entityName))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldName) : null
      }
    }
    return null
  }

  /**
   * 获取活动集输出实体参数的字段值
   * 格式：BR_OUT_PARENT.[变量英文名称].[字段名称]
   */
  getRulesetEntityFieldVar(entityName: string, fieldName: string) {
    var ctx = this.context.get('expressionContext')
    var routeContext = ctx.getRouteContext()
    if (routeContext) {
      var datasource = routeContext.getVariable(entityName)
      if (datasource) {
        var row
        if (ctx.hasCurrentRecord(entityName))
          row = ctx.getCurrentRecord(entityName)
        else if (ctx.hasRecordIndex(entityName))
          row = datasource.getRecordById(ctx.getRecordIndex(entityName))
        else row = datasource.getCurrentRecord()

        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldName) : null
      }
    }
    return null
  }

  /**
   * 获取输出参数值
   */
  getRulesetInput(entityName: string) {
    return this.routeContext.getOutPutParam(entityName)
  }

  /**
   *获取活动集变量值
   */
  getRulesetVar(entityName: string) {
    return this.routeContext.routeContext.getVariable(entityName)
  }
}
