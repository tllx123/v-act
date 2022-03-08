import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sb) {}
// 主入口(必须有)
/**
 *
 * @param {Object}
 *            entityName 实体名称
 */
const main = function (param) {
  let args = param.getArgs()
  let entityName = args.length > 0 ? args[0] : null
  if (!entityName) {
    throw new Error('实体名为空，请检查相关配置！')
  }
  let selectedDatas = null
  if (args.length > 1) {
    let type = args[1]
    let dataSoruce = manager.lookup({
      datasourceName: entityName
    })
    selectedDatas = []
    if (type == '1') {
      let rd = dataSoruce.getCurrentRecord()
      selectedDatas.push(rd)
    } else if (type == '2') {
      let rds = dataSoruce.getSelectedRecords().toArray()
      selectedDatas = rds
    }
  } else {
    selectedDatas = datasourcePuller.getSelectedAndCurrentRecords({
      datasourceName: entityName
    })
  }

  if (!selectedDatas) {
    return
  }
  let ruleSetCodes = []
  let componentCodes = []
  for (let i = 0; i < selectedDatas.length; i++) {
    let selectedData = selectedDatas[i]
    let ruleSetCode = selectedData.getOriginalData().code
    let componentCode = selectedData.getOriginalData().componentCode
    ruleSetCodes.push(ruleSetCode)
    componentCodes.push(componentCode)
  }
  let _respCallBack = function (result) {}
  let paramData = {}
  paramData['ruleSetCodes'] = ruleSetCodes.join(';')
  paramData['componentCodes'] = componentCodes.join(';')
  let param = jsonUtil.obj2json(paramData)
  let token = '{"data":' + param + '}'

  let scope = scopeManager.getScope()
  let currentComponentCode = scope.getComponentCode()
  let currentWindowCode = scope.getWindowCode()

  let url =
    'module-operation!executeOperation?componentCode=' +
    currentComponentCode +
    '&windowCode=' +
    currentWindowCode +
    '&operation=ExportRuleChainSqlSentence'
  url += '&token=' + encodeURIComponent(token)
  createIFrame('file_down_iframe', url)
}

function createIFrame(iframeId, url) {
  let iframeObj = document.getElementById(iframeId)
  if (iframeObj == null) {
    iframeObj = document.createElement('iframe')
    iframeObj.setAttribute('id', iframeId)
    iframeObj.setAttribute('style', 'display:none')
    document.body.appendChild(iframeObj)
  }
  iframeObj.setAttribute('src', url)
}

export { main }
