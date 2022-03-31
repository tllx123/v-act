import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine'
import { ExpressionContext as expressionContext } from '@v-act/vjs.framework.extension.platform.services.engine'

// 主入口(必须有)
let main = function (param: any) {
  //实体名
  let entityName = 'TEMP_PROCESS_TASK'
  //实体字段名
  let entityFieldName = 'ActivityName'
  let context = new expressionContext()
  context.setRouteContext(param.getRouteContext())
  let expression =
    'PrdGetBizFrameCurrentRecord("' +
    entityName +
    '","' +
    entityFieldName +
    '")'
  //执行表达式
  return expressionEngine.execute({ expression: expression, context: context })
}
export { main }
