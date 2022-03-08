import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  if (null != inParamsObj) {
    let dataSourceNames = inParamsObj['dataSourceNames']
    if (dataSourceNames) {
      for (let i = 0; i < dataSourceNames.length; i++) {
        let datasource = datasourceManager.lookup({
          datasourceName: dataSourceNames[i]['name']
        })
        //如果数据源存在，则执行清除
        if (datasource) {
          datasource.clear()
        } else {
          HandleException('实体[' + dataSourceNames[i]['name'] + ']不存在！')
        }
      }
    }
  }
}
/**
 * desc 非回调中抛异常
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException(error_msg) {
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  throw exception
}

export { main }
