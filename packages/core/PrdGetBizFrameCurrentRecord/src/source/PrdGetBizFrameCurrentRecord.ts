import { log as log } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
let expressionEngine

const initModule = function (sb) {
  // sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

// 主入口(必须有)
let main = function (ruleContext) {
  let args = ruleContext.getArgs()
  let argsLen = args.length
  if (argsLen == 0) {
    log.error('[PrdGetBizFrameCurrentRecord]参数为空')
    return null
  }
  // 实体名
  let entityName = argsLen >= 1 ? args[0] : null
  // 实体字段名
  let entityFieldName = argsLen >= 2 ? args[1] : null

  let result
  let windowInstanceId
  // 获取窗体实体记录
  let getRecord = function () {
    // 获取是否是流程框架窗体标识，判断是否是流程框架窗体
    let isProcessFrmeWindow = windowParam.getInput({
      code: 'isProcessFrmeWindow'
    })
    if (isProcessFrmeWindow === true) {
      // 判断窗体实体是否存在
      let isExist = datasourceManager.exists({
        datasourceName: entityName
      })
      if (isExist) {
        let dataSource = datasourceManager.lookup({
          datasourceName: entityName
        })
        // 查找所有记录
        let records = dataSource.getAllRecords()
        if (!records.isEmpty()) {
          let record = dataSource.getCurrentRecord()
          if (null == entityFieldName) {
            // 返回记录
            return jsonUtil.obj2json(record.toMap())
          } else {
            // 返回记录某个字段
            return record.get(entityFieldName)
          }
        } else {
          log.log(
            '[PrdGetBizFrameCurrentRecord]业务窗体实体' +
              entityName +
              '记录为空'
          )
        }
      } else {
        return null
      }
    }
    return null
  }

  // 获取窗体实例
  let windowScope = scopeManager.getWindowScope()
  windowInstanceId = windowScope.getInstanceId()
  // 最大寻找次数
  let attempts = 3
  while (null == result) {
    if (null == windowInstanceId || 0 == attempts) {
      log.error('[PrdGetBizFrameCurrentRecord]获取业务窗体实体异常')
      return null
    }
    result = scopeManager.createScopeHandler({
      scopeId: windowInstanceId,
      handler: getRecord
    })()
    // 递归往父窗体寻找实体
    if (null == result) {
      let parentWindowInstanceId =
        scopeManager.getParentScopeId(windowInstanceId)
      windowInstanceId = parentWindowInstanceId
    }
    attempts--
  }

  return result
}
export { initModule, main }
