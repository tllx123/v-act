import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as expressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'

const initModule = function (sb) {
  // sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

// 主入口(必须有)
let main = function (param) {
  //实体名
  let entityName = 'TEMP_PROCESS_TASK'
  //实体字段名
  let entityFieldName = 'FromActivityName'
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
export { initModule, main }
