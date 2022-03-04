import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import {
  QueryCondUtil as util,
  WhereRestrict as whereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()

  let inParams = ruleConfig.inParams
  let cfg = jsonUtil.json2obj(inParams)

  // 处理查询条件
  let condCfgs = cfg.dsWhere
  //				var where = WhereRestrict.init();
  let where = whereRestrict.init()
  if (condCfgs != null && condCfgs.length > 0) {
    where.andExtraCondition(condCfgs, 'custom')
  }

  //处理查询参数
  let params = {}
  if ('QUERY' == stringUtil.toUpperCase(cfg.dataType)) {
    let queryParams = cfg.dsQueryParam
    if (queryParams != null && queryParams.length > 0) {
      //						params = queryConditionUtil.genCustomParams(queryParams);
      params = util.genCustomParams({
        paramDefines: queryParams,
        routeContext: ruleContext.getRouteContext()
      })
    }
  }

  //处理标题表达式
  let title = ''
  //				if (cfg.title) title = formulaUtil.evalExpression(cfg.title);
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  if (cfg.title)
    title = engine.execute({ expression: cfg.title, context: context })

  let option = {
    ruleInstId: ruleConfig.instanceCode,
    title: title,
    condSql: where.toWhere(),
    condParams: where.toParameters(),
    params: params,
    ruleConfig: jsonUtil.obj2json(cfg)
  }

  let token = {
    data: option
  }
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()

  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()

  let url =
    'module-operation!executeOperation?componentCode=' +
    componentCode +
    '&windowCode=' +
    windowCode +
    '&operation=ExportData'

  /**
   * 梁朝辉 2015-02-09
   * 创建一个from用post的方法提交数据，防止url超长的问题
   * token在createForm时处理
   */
  // url += '&token=' + encodeURIComponent(encodeURIComponent(jsonUtil.obj2json(token)));
  let iframeId = 'file_down_iframe'
  let formId = 'iframeDownForm'
  let tokenJson = jsonUtil.obj2json(token)
  let tokenEncode = encodeURIComponent(tokenJson)
  createIFrame(iframeId, '')
  let formObj = createForm(formId, iframeId, url, tokenEncode)
  formObj.submit()
  //createIFrame("file_down_iframe",url);
}

/**
 * 梁朝辉 2015-02-09
 * 创建一个from用post的方法提交数据，防止url超长的问题
 */
function createForm(formId, iframeId, actionUrl, tokenId) {
  let formObj = document.getElementById(formId)
  if (formObj == null) {
    formObj = document.createElement('form')
    formObj.setAttribute('id', formId)
    formObj.setAttribute('method', 'post')
    formObj.setAttribute('target', iframeId)
    formObj.setAttribute('style', 'display:none')
    document.body.appendChild(formObj)
  }
  formObj.setAttribute('action', actionUrl)
  formObj.innerHTML =
    "<input id='tokenId' type='hidden' name='token' value='" + tokenId + "'>"
  return formObj
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
