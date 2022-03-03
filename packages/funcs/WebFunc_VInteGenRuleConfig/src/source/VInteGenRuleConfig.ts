import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { DatasourceManager as managerService } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

//主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  let ruleCode = args.length > 0 ? args[0] : null

  let expression = 'VInteGetRuleConfigDefine("' + ruleCode + '")'
  let scope = scopeManager.getScope()
  let currentWindowCode = scope.getWindowCode()
  let result = operation.evalExpression({
    windowCode: currentWindowCode,
    expression: expression
  })
  let defines = null
  if (result && result.success == true) {
    defines = result.data.result
  } else {
    throw new Error(
      '[VInteGenRuleConfig.main]获取规则定义数据失败，result=' + result
    )
  }

  if (!defines) {
    return null
  }

  let ruleConfinMap = {}
  for (let i = 0; i < defines.length; i++) {
    let define = defines[i]
    let paramCode = define.paramCode
    let paramType = define.paramType
    let paramValueSource = define.paramValueSource

    let paramValue = null
    if ('SingleValue' == paramType) {
      let entityCode = paramValueSource.split('.')[0]
      let columnCode = paramValueSource.split('.')[1]

      let datasource = managerService.lookup({ datasourceName: entityCode })
      let record = datasource.getCurrentRecord()
      paramValue = record.get(columnCode)
    } else if ('EntityRecords' == paramType) {
      let entityCode = paramValueSource
      let datasource = managerService.lookup({ datasourceName: entityCode })
      let records = datasource.getAllRecords()
      let json = genDataMaps(records)
      paramValue = json
    }

    ruleConfinMap[paramCode] = paramValue
  }

  return jsonUtil.obj2json(ruleConfinMap)
}

/**
 * 将Record对象列表转换成原生Map信息
 * @param records Record对象列表
 * @return 对Record转换后的二维数组
 */
let genDataMaps = function (records) {
  let dataMaps = []
  if (records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      if (!record) {
        continue
      }
      dataMaps.push(record.toMap())
    }
  }
  return dataMaps
}

export { main }
