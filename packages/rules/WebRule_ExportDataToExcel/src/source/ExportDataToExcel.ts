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
function MapTransform(cfg, ruleContext) {
  let _result = {}
  let _deColumnMap = []
  let _items = cfg['items']
  if (_items) {
    _result['defaultFileName'] = cfg['defaultFileName']
    _result['fileType'] = cfg['fileType']
    for (let i = 0; i < _items.length; i++) {
      let _itc = _items[i]
      let _itp = {}
      _itp['title'] = cfg['defaultFileName']
      let isAllNoExport = true
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      _itp['sheetName'] = engine.execute({
        expression: _itc['sheetName'],
        context: context
      })
      _itp['dataName'] = _itc['dataSource']
      _itp['dataType'] = _itc['dataSourceType']
      _itp['dsWhere'] = _itc['filterCondition']
      _itp['dsQueryParam'] = _itc['queryParam']
      let _fi = []
      for (let j = 0; j < _itc['mapping'].length; j++) {
        let _itfc = _itc['mapping'][j]
        let _fic = {}
        _fic['chineseName'] = _itfc['excelColName']
        _fic['fieldName'] = _itfc['fieldCode']
        _fic['needExport'] = _itfc['exportData']
        if (_fic['needExport'] && _fic['needExport'] == true) {
          isAllNoExport = false
        }
        _fic['orderBy'] = _itfc['orderType']
        _fic['orderNo'] = j
        _fi[j] = _fic
      }
      _itp['dsColumnMap'] = _fi
      _itp['isAllNoExport'] = isAllNoExport
      _deColumnMap[i] = _itp
    }
    _result['items'] = _deColumnMap
  }
  return _result
}
let main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()

  let inParams = ruleConfig.inParams
  let config = jsonUtil.json2obj(inParams)
  config = MapTransform(config, ruleContext)
  let gb_condSql = {}
  let gb_title = {}
  let gb_params = {}
  let gb_condParams = {}
  let routeContext = ruleContext.getRouteContext()
  let fileType = config['fileType']
  for (let _i = 0; _i < config['items'].length; _i++) {
    cfg = config['items'][_i]
    let dataName = cfg.dataName
    let iden_con = dataName + '_' + cfg.sheetName
    // 处理查询条件
    let condCfgs = cfg.dsWhere
    let wrParam = {
      fetchMode: 'custom',
      routeContext: routeContext
    }
    let where = whereRestrict.init(wrParam)
    if (condCfgs != null && condCfgs.length > 0) {
      where.andExtraCondition(condCfgs, 'custom')
    }
    // 处理查询参数
    let params = {}
    if ('QUERY' == stringUtil.toUpperCase(cfg.dataType)) {
      let queryParams = cfg.dsQueryParam
      if (queryParams != null && queryParams.length > 0) {
        // params =
        // queryConditionUtil.genCustomParams(queryParams);
        params = util.genCustomParams({
          paramDefines: queryParams,
          routeContext: ruleContext.getRouteContext()
        })
      }
    }
    let title = ''
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    if (cfg.title)
      title = engine.execute({
        expression: cfg.title,
        context: context
      })
    gb_condSql[iden_con] = where.toWhere()
    gb_condParams[iden_con] = where.toParameters()
    gb_params[iden_con] = params
    gb_title[iden_con] = title
  }
  let option = {
    ruleInstId: ruleConfig.instanceCode,
    title: gb_title,
    condSql: gb_condSql,
    condParams: gb_condParams,
    params: gb_params,
    ruleConfig: jsonUtil.obj2json(config),
    ruleName: 'ExportDataToExcel',
    fileType: fileType
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
    '&operation=ExportDataToExcel'

  /**
   * 梁朝辉 2015-02-09 创建一个from用post的方法提交数据，防止url超长的问题
   * token在createForm时处理
   */
  // url += '&token=' +
  // encodeURIComponent(encodeURIComponent(jsonUtil.obj2json(token)));
  let iframeId = 'file_down_iframe'
  let formId = 'iframeDownForm'
  let tokenJson = jsonUtil.obj2json(token)
  let tokenEncode = encodeURIComponent(tokenJson)
  createIFrame(iframeId, '')
  let formObj = createForm(formId, iframeId, url, tokenEncode)
  formObj.submit()
  // createIFrame("file_down_iframe",url);
}

/**
 * 梁朝辉 2015-02-09 创建一个from用post的方法提交数据，防止url超长的问题
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
