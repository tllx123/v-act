import {
  ExpressionContext as expressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let missUpdate, sandbox
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
const main = function (ruleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  //		// 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  //		// 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  let varCode = inParamObj.LoopVar
  let entity = inParamObj.LoopEntity
  let type = inParamObj.LoopEntityType
  let fields = inParamObj.Fields

  let datasource = routeContext.getForEachVarDataSource(varCode)
  //			if(type == "window"){
  //				datasource = manager.lookup({
  //					"datasourceName": entity
  //				});
  //			}else{
  //				var context = new expressionContext();
  //				context.setRouteContext(routeContext);
  //				/*方法实体*/
  //				datasource = engine.execute({
  //					"expression": getEntityCode(entity, type),
  //					"context": context
  //				});
  //			}
  if (datasource) {
    //				//create test data
    //				fields = jsonUtil.json2obj(fields);
    //				routeContext.setForEachVar({
    //					'code':varCode,
    //					'value':datasource.getAllRecords().toArray()[0],
    //					'datasource':datasource
    //				});
    //				//end
    let record = routeContext.getForEachVarValue(varCode)
    if (fields && fields.length > 0) {
      let context = new expressionContext()
      context.setRouteContext(routeContext)
      for (let i = 0, l = fields.length; i < l; i++) {
        let fieldInfo = fields[i]
        let value = engine.execute({
          expression: fieldInfo.Source,
          context: context
        })
        record.set(fieldInfo.LoopVarField, value)
      }
      datasource.updateRecords({ records: [record] })
    }
  } else {
    throw Error('实体[' + entity + ']不存在')
  }
}
let getEntityCode = function (entity, type) {
  switch (type) {
    case 'window':
      return entity
      break
    case 'ruleSetOutput':
      return 'BR_OUT_PARENT.' + entity
      break
    case 'ruleSetVar':
      return 'BR_VAR_PARENT.' + entity
      break
    case 'ruleSetInput':
      return 'BR_IN_PARENT.' + entity
      break
  }
}
export { main }
