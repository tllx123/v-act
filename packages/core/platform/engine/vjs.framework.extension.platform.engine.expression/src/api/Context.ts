import { FunctionEngine } from '@v-act/vjs.framework.extension.platform.engine.function'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import {
  WindowParam,
  ComponentParam
} from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { MathUtil } from '@v-act/vjs.framework.extension.util.math'

export default class Context {
  private readonly context: any
  private readonly routeContext: any

  constructor(context: any) {
    this.context = context
    this.routeContext = context.routeContext
  }
  /**
   * 获取构件变量
   * */
  getComponontVar = (name: string) => ComponentParam.getVariant({ code: name })

  /**
   * 获取全局变量
   * */
  getWindowVar = (name: string) => {
    return WindowParam.getInput({ code: name })
  }

  /**
   * 获取全局变量
   * */
  getRecordValue(entityCode: string, fieldCode: string) {
    let ctx = this.context.get('expressionContext')
    if (this.routeContext) {
      let datasource = DatasourceManager.lookup({ datasourceName: entityCode })

      if (datasource) {
        let row
        if (ctx.hasCurrentRecord(entityCode))
          row = ctx.getCurrentRecord(entityCode)
        else if (ctx.hasRecordIndex(entityCode))
          row = datasource.getRecordById(ctx.getRecordIndex(entityCode))
        else row = datasource.getCurrentRecord()
        // 如果上面都取不到记录，则取数据源的第一行记录
        row = row ? row : datasource.getRecordByIndex(0)
        return row ? row.get(fieldCode) : null
      }
    }
    return null
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
  executeFunction(functionName: string, ...args: any[]) {
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

  //获取foreach循环变量的值
  //格式：LV.[变量英文名称].[字段名称]
  evaluateForEachVar(varCode: string, fieldCode: string) {
    let ctx = this.context.get('expressionContext')
    let routeContext = ctx.getRouteContext()
    if (routeContext) {
      let record = routeContext.getForEachVarValue(varCode)
      return record.get(fieldCode)
    } else {
      return null
    }
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
    return this.routeContext.getVariable(entityName)
  }
  getString(string: string) {
    return string
  }

  getNumber(v: string) {
    return Number(v)
  }

  /**
   *获取加法结果
   */
  evaluateAdd(v1: number, v2: number) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let val = MathUtil.add(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' add type is wrong')
    }
  }

  /**
   * 获取乘法结果
   */
  evaluateSub(v1: number, v2: number) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let val = MathUtil.subtract(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' subtract type is wrong')
    }
  }
  /**
   * 获取乘法结果
   */
  evaluateMult(v1: number, v2: number) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let val = MathUtil.multiply(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' multiply type is wrong')
    }
  }
  /**
   * 获取乘法结果
   */
  evaluateDiv(v1: number, v2: number) {
    if (!isNaN(v1) && !isNaN(v2)) {
      let val = MathUtil.divide(v1, v2)
      return Number(val)
    } else {
      throw new Error(v1 + ',' + v2 + ' divide type is wrong')
    }
  }
}
