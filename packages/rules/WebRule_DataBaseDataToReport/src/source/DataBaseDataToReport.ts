import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourcePusher as datasourcePusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import {
  ExpressionContext,
  ExpressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine.route'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import {
  WidgetAction,
  WidgetProperty as widgetProperty
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import {
  QueryCondUtil,
  WhereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let sandBox

export function initModule(sBox) {
  sandBox = sBox
}

const main = function (ruleContext) {
  let scope = ScopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let windowCode = scope.getWindowCode()
  let ruleCfgValue = ruleContext.getRuleCfg()

  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let isAsyn = inParamsObj.isAsyn //是否异步
  let reportCode = inParamsObj.report //报表名称
  let reportType = inParamsObj.reportType //类别
  let reportControlCode = inParamsObj.reportControl //报表控件编码
  let itemConfigs = inParamsObj.itemsConfig //配置信息
  let reportEvents = inParamsObj.reportEvents //报表控件事件信息
  if (itemConfigs == null) return

  if ('WindowReport' == reportType) {
    reportCode = windowCode + '.' + reportCode
  }

  let routeContext = ruleContext.getRouteContext()
  let operateType = inParamsObj.operateType //操作类型（write,preview,expression）
  let operateTypeExpress = inParamsObj.operateTypeExpress //操作类型表达式（解析后的值：write,preview）
  if (operateType == null) {
    operateType = 'preview'
  } else if (operateType == 'expression') {
    let expressionContext = new ExpressionContext()
    expressionContext.setRouteContext(routeContext)
    operateType = getExpressionValue(expressionContext, operateTypeExpress)
  }

  //获取"打印方式"完成事件
  let afterGetReportEdition = function (result) {
    let success = result['success']
    if (success != true) return

    let data = result['data']
    let reportEdition = data.reportEdition
    let isRight = checkItemConfigs(ruleContext, reportEdition, itemConfigs)
    if (false == isRight) return

    arrangeItems(itemConfigs)

    if (reportEdition != 'TooneReport') {
      //加载报表文件完成事件
      let afterLoadReportFile = (function (reportCode, reportControlCode) {
        return function (resultDataString, routeContext) {
          if (resultDataString) {
            //报表配置信息
            let reportCfg = jsonUtil.json2obj(resultDataString.outputJSON)
            if (reportCfg.dataSource) {
              reportCfg.dataSource = reportCfg.dataSource.replace('|', ';')
            }
            //将报表信息加载到报表控件
            let reportData = getRemoteData(
              itemConfigs,
              ruleContext.getRouteContext()
            )
            if (reportControlCode) {
              //执行JGReportAction.js的draw方法
              WidgetAction.executeWidgetAction(
                reportControlCode,
                'draw',
                reportData,
                reportCfg
              )
              //执行扩展的JS脚本
              let curWidget = widgetContext.get(reportControlCode, 'widgetObj')
              //报表ID
              let curReportID = 'v3Report_' + curWidget.getID()
              window['VReport'] = window[curReportID]
              //执行脚本
              exeExtendJs(itemConfigs)
            }
          } else {
            throw new Error('加载报表文件出错:' + result.msg)
          }
          ruleContext.fireRuleCallback()
        }
      })(reportCode, reportControlCode)

      //加载报表模板
      let loadReportFileParams = {
        report: reportCode,
        componentCode: componentCode
      }

      RemoteMethodAccessor.invoke({
        ruleSetCode: 'CommonRule_LoadReportFile',
        componentCode: componentCode,
        commitParams: [
          {
            paramName: 'inParams',
            paramType: 'char',
            paramValue: jsonUtil.obj2json(loadReportFileParams)
          }
        ],
        isAsyn: isAsyn,
        afterResponse: afterLoadReportFile
      })
    } else {
      //打印方式为"TooneReport"
      registEventForTooneReport(
        componentCode,
        windowCode,
        reportControlCode,
        reportEvents,
        routeContext
      )
      getRequestForTooneReport(itemConfigs, routeContext)
      getRemoteDataForTooneReport(
        routeContext,
        reportType,
        reportCode,
        reportControlCode,
        itemConfigs,
        operateType
      )
    }
  }

  let printTypeParams = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    ruleSetCode: 'GetReportEdition',
    isRuleSetCode: false,
    afterResponse: afterGetReportEdition
  }

  //获取"打印方式"
  RemoteMethodAccessor.invoke(printTypeParams)

  routeContext.setCallBackFlag(false)
}

// 是否存在外部方法。返回值true：存在， false：不存在
let isExistApi = function (itemConfigs) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    let sourceType = itemConfig.Istype
    if (sourceType == 'Api') {
      return true
    }
  }
  return false
}

// 是否存在窗体实体。返回值true：存在， false：不存在
let isExistWindowEntity = function (itemConfigs) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    let sourceType = itemConfig.Istype
    if (sourceType == 'WindowEntity') {
      return true
    }
  }
  return false
}

// 是否存在执行脚本。返回值true：存在， false：不存在
let isExistExeScript = function (itemConfigs) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    let exeScript = itemConfig.exeScript
    if (exeScript != null && exeScript != '') {
      return true
    }
  }
  return false
}

// 所有配置中的字段映射中是否存在表达式。返回值true：存在， false：不存在
let isExistExpression = function (itemConfigs) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let items = itemConfigs[i].items
    for (let j = 0; j < items.length; j++) {
      let item = items[j]
      let type = item.type
      if (type == 'expression') {
        return true
      }
    }
  }
  return false
}

// 字段映射中是否存在表达式。返回值true：存在， false：不存在
let isExistExpressionInItems = function (items) {
  for (let j = 0; j < items.length; j++) {
    let item = items[j]
    let type = item.type
    if (type == 'expression') {
      return true
    }
  }
  return false
}

// 校验配置信息是否正确
let checkItemConfigs = function (ruleContext, reportEdition, itemConfigs) {
  if (reportEdition != 'TooneReport') {
    let isExist = isExistApi(itemConfigs)
    if (isExist) {
      showMessage(ruleContext, '此打印方式不支持调用 [外部方法]。')
      return false
    }
  } else {
    let isExist = false
    isExist = isExistExeScript(itemConfigs)
    if (isExist) {
      showMessage(ruleContext, '此打印方式不支持调用 [执行脚本]。')
      return false
    }
  }

  return true
}

// 弹出提示窗口
let showMessage = function (ruleContext, msg) {
  DialogUtil.warnDialog(msg, null, false)
  ruleContext.fireRouteCallback()
  ScopeManager.closeScope()
}

// 移除构件编码
let getFieldName = function (name, fieldType) {
  let result = name
  if (fieldType === 'entityField') {
    let nameArr = name.split('.')
    if (nameArr.length > 2) {
      result = nameArr[nameArr.length - 2] + '.' + nameArr[nameArr.length - 1]
    }
  }
  return result
}

// 重新整理映射信息，去掉构件编码
let arrangeItems = function (itemConfigs) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let items = itemConfigs[i].items
    for (let j = 0; j < items.length; j++) {
      let item = items[j]
      let destName = item.destName
      let sourceName = item.sourceName
      destName = getFieldName(destName, item.type)
      sourceName = getFieldName(sourceName, item.type)
      item.destName = destName
      item.sourceName = sourceName
    }
  }
}

// 执行扩展脚本
let exeExtendJs = function (itemConfigs) {
  if (!itemConfigs) return

  for (let i = 0, len = itemConfigs.length; i < len; i++) {
    let itemConfig = itemConfigs[i]
    let exeScript = itemConfig && itemConfig['exeScript']
    if (exeScript && exeScript !== '') {
      try {
        eval(exeScript)
      } catch (e) {
        window.console && console.log('执行自定义脚本报错，请检查脚本：' + e)
      }
    }
  }
}

// 获取数据源
let getRemoteData = function (itemConfigs, routeContext) {
  let reportDatas = {}
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    //来源类型（Table：表，Query：查询， WindowEntity：窗体实体，Api：方法）
    let isType = itemConfig['Istype']
    //来源数据
    let sourceName = itemConfig['sourceName']
    //目标数据
    let entityName = itemConfig['entityName']
    //过滤条件
    let queryConds = itemConfig['dsWhere']
    //源数据中的字段
    let itemqueryparam = itemConfig['itemqueryparam']
    //映射关系
    let items = itemConfig['items']
    // 自定义查询时，扩展的查询条件
    let extraCondition = null
    // 根据过滤条件获取出源数据源数据
    let isCustomSqlFind = isType + '' == '1'
    let wrParam = {
      fetchMode: 'custom',
      routeContext: routeContext
    }
    let whereRestrict = WhereRestrict.init(wrParam)
    if (
      undefined != queryConds &&
      null != queryConds &&
      queryConds.length > 0
    ) {
      whereRestrict.andExtraCondition(
        queryConds,
        isCustomSqlFind ? 'custom' : 'table'
      )
    }
    let params = QueryCondUtil.genCustomParams({
      paramDefines: itemqueryparam,
      routeContext: routeContext
    })
    whereRestrict.addExtraParameters(params)

    let queryParams = {}
    let queryType = 'Table'
    if (isType == 'WindowEntity') {
      let db = datasourceManager.lookup({
        datasourceName: sourceName
      })
      if (db) {
        let datas = callBack(db.serialize(), items, routeContext)
        reportDatas[entityName] = datas
      } else {
        throw Error(
          '[DataBaseDataToReport.main]未找到窗体界面实体，请检查配置！实体编号：' +
            sourceName
        )
      }
    } else {
      if (isType == 1) {
        //自定义查询
        queryType = 'Query'
        queryParams = genCustomSqlQueryParams(whereRestrict.toParameters())
      } else {
        queryParams = whereRestrict.toParameters()
        // 排序条件处理
        let orderByCfg = itemConfig['orderBy']
        if (
          orderByCfg &&
          typeof orderByCfg != 'undefined' &&
          orderByCfg.length > 0
        ) {
          for (let obIndex = 0; obIndex < orderByCfg.length; obIndex++) {
            let orderByItem = orderByCfg[obIndex]
            if (!orderByItem.field || orderByItem.field == '') {
              continue
            }
            let fieldArray = orderByItem.field.split('.')
            let orderByField = fieldArray[fieldArray.length - 1]
            if (orderByItem.type.toLowerCase() == 'desc') {
              whereRestrict.addOrderByDesc(orderByField)
            } else {
              whereRestrict.addOrderBy(orderByField)
            }
          }
        }
      }

      let dataQuery = sandBox.getService(
        'vjs.framework.extension.platform.services.repository.query'
      )
      let param = [
        {
          dataSourceName: sourceName,
          whereRestrict: whereRestrict,
          queryRecordStart: -1,
          queryPageSize: -1,
          queryType: queryType
        }
      ]
      let isAsyn = false

      // 2015-06-26 liangchaohui：根据SDK调整作出修改
      // dataQuery.query(param,isAsyn,callBack);
      dataQuery.query({
        queryParams: param,
        isAsync: isAsyn,
        success: function (result) {
          if (result) {
            let datas = callBack(result[0], items, routeContext)
            reportDatas[entityName] = datas
          }
        }
      })
    }
  }
  return {
    values: reportDatas
  }
}

let callBack = function (result, items, routeContext) {
  //封装成报表数据结构  {"values":{"dsName":[{"destfield1":value1},{"destfield2":value2}]}}
  let datas = []
  if (result) {
    let resultData = result.datas.values
    if (items && items.length > 0) {
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      for (let j = 0; j < resultData.length; j++) {
        let dataObj = resultData[j]
        let temp = {}
        for (let field in dataObj) {
          for (let i = 0; i < items.length; i++) {
            let destName = items[i].destName
            let sourceName = items[i].sourceName
            let sourcetype = items[i].type
            let destField = destName.split('.')[1]
            // 2015-07-15 兼容处理[构件名].[表名]的情况，只取[表名]
            if (destField.indexOf('.') != -1) {
              let destFieldItems = destField.split('.')
              destField = destFieldItems[destFieldItems.length - 1]
            }
            if (sourcetype != 'expression') {
              let sourceField = sourceName.split('.')[1]
              if (sourceField.indexOf('.') != -1) {
                let sourceFieldItems = sourceField.split('.')
                sourceField = sourceFieldItems[sourceFieldItems.length - 1]
              }
              if (field == sourceField) {
                temp[destField] = dataObj[field]
              }
            } else {
              let otherValue = getExpressionValue(context, sourceName)
              temp[destField] = otherValue
            }
          }
        }
        datas.push(temp)
      }
    }
  }
  return datas
}

//获取自定义查询参数
let genCustomSqlQueryParams = function (params) {
  // 构建实际查询时需要的参数对象
  let queryParams = {}
  if (params) {
    for (let key in params) {
      queryParams[key] = {}
      queryParams[key]['paramName'] = key
      queryParams[key]['paramValue'] = params[key]
    }
  }
  return queryParams
}

let getFromWindowEntity = function (itemConfig, routeContext) {
  //来源数据
  let sourceName = itemConfig['sourceName']
  //报表实体
  let entityName = itemConfig['entityName']
  //映射关系
  let items = itemConfig['items']

  let db = datasourceManager.lookup({
    datasourceName: sourceName
  })

  if (db) {
    let dbSerialize = db.serialize()
    let datas = callBack(dbSerialize, items, routeContext)
    dbSerialize.datas = datas
    return dbSerialize
  } else {
    throw Error(
      '[DataBaseDataToReport.main]未找到窗体界面实体，请检查配置！实体编号：' +
        sourceName
    )
  }
}

let getFromDataBase = function (itemConfig, routeContext) {
  //来源类型
  let isType = itemConfig['Istype']
  //来源数据
  let sourceName = itemConfig['sourceName']
  //映射关系
  let items = itemConfig['items']
  //过滤条件
  let queryConds = itemConfig['dsWhere']
  //查询参数
  let itemqueryparam = itemConfig['itemqueryparam']

  let wrParam = {
    fetchMode: 'custom',
    routeContext: routeContext
  }
  let whereRestrict = WhereRestrict.init(wrParam)

  //根据过滤条件获取出源数据
  let isCustomSqlFind = isType + '' == '1'
  if (undefined != queryConds && null != queryConds && queryConds.length > 0) {
    whereRestrict.andExtraCondition(
      queryConds,
      isCustomSqlFind ? 'custom' : 'table'
    )
  }

  let params = QueryCondUtil.genCustomParams({
    paramDefines: itemqueryparam,
    routeContext: routeContext
  })
  whereRestrict.addExtraParameters(params)

  let queryParams = {}
  let queryType = 'Table'
  if (isType == 1) {
    //自定义查询
    queryType = 'Query'
    let params = whereRestrict.toParameters()
    if (params) {
      for (let key in params) {
        queryParams[key] = {}
        queryParams[key]['paramName'] = key
        queryParams[key]['paramValue'] = params[key]
      }
    }
  } else {
    queryParams = whereRestrict.toParameters()
    // 排序条件处理
    let orderByCfg = itemConfig['orderBy']
    if (
      orderByCfg &&
      typeof orderByCfg != 'undefined' &&
      orderByCfg.length > 0
    ) {
      for (let obIndex = 0; obIndex < orderByCfg.length; obIndex++) {
        let orderByItem = orderByCfg[obIndex]
        if (!orderByItem.field || orderByItem.field == '') {
          continue
        }
        let fieldArray = orderByItem.field.split('.')
        let orderByField = fieldArray[fieldArray.length - 1]
        if (orderByItem.type.toLowerCase() == 'desc') {
          whereRestrict.addOrderByDesc(orderByField)
        } else {
          whereRestrict.addOrderBy(orderByField)
        }
      }
    }
  }

  let dataQuery = sandBox.getService(
    'vjs.framework.extension.platform.services.repository.query'
  )
  let param = [
    {
      dataSourceName: sourceName,
      whereRestrict: whereRestrict,
      queryRecordStart: -1,
      queryPageSize: -1,
      queryType: queryType
    }
  ]

  let isAsyn = false
  let resultObj
  dataQuery.query({
    queryParams: param,
    isAsync: isAsyn,
    success: function (result) {
      if (result) {
        resultObj = result[0]
        datas = callBack(resultObj, items, routeContext)
        resultObj.datas = datas
      }
    }
  })

  return resultObj
}

//获取表达式值
let getExpressionValue = function (expressionContext, srcExpression) {
  let value = ExpressionEngine.execute({
    expression: srcExpression,
    context: expressionContext
  })

  return value
}

//处理"表"、"查询"表达式
let getWhereRestrictExpression = function (
  routeContext,
  dsWhere,
  itemqueryparam,
  orderBys
) {
  let mode = 'table'
  let wrParam = {
    fetchMode: mode,
    routeContext: routeContext
  }
  let whereRestrict = WhereRestrict.init(wrParam)

  //过滤条件
  if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0) {
    whereRestrict.andExtraCondition(dsWhere, mode)
  }

  //查询参数
  let params = queryConditionUtil.genCustomParams({
    paramDefines: itemqueryparam,
    routeContext: routeContext
  })
  whereRestrict.addExtraParameters(params)

  //排序
  if (undefined != orderBys && null != orderBys && orderBys.length > 0) {
    for (let j = 0; j < orderBys.length; j++) {
      let orderByItem = orderBys[j]
      if (!orderByItem.field || orderByItem.field == '') {
        continue
      }
      let fieldArray = orderByItem.field.split('.')
      let orderByField = fieldArray[fieldArray.length - 1]
      if (orderByItem.type.toLowerCase() == 'desc') {
        whereRestrict.addOrderByDesc(orderByField)
      } else {
        whereRestrict.addOrderBy(orderByField)
      }
    }
  }

  return whereRestrict
}

//处理"外部方法"表达式
let getApiExpression = function (routeContext, invokeRuleParams) {
  if (invokeRuleParams != null) {
    let expressionContext = new ExpressionContext()
    expressionContext.setRouteContext(routeContext)
    for (let j = 0; j < invokeRuleParams.length; j++) {
      let item = invokeRuleParams[j]
      let paramType = item.paramType
      if (paramType == 'expression') {
        let srcExpression = item.paramSourceValue
        let destExpression = getExpressionValue(
          expressionContext,
          srcExpression
        )
        item.paramSourceValue = destExpression
      }
    }
  }
}

//打印方式为"TooneReport"，注册报表控件事件
let registEventForTooneReport = function (
  componentCode,
  windowCode,
  reportControlCode,
  reportEvents,
  routeContext
) {
  let scopeId = ScopeManager.getCurrentScopeId()
  if (reportEvents != null && reportEvents.length > 0) {
    for (let i = 0; reportEvents != null && i < reportEvents.length; i++) {
      let reportEvent = reportEvents[i]
      let eventCode = reportEvent.eventCode
      let ruleSetCode = reportEvent.ruleSetCode
      let invokeParams = reportEvent.invokeParams
      let returnMappings = reportEvent.returnMapping
      //原逻辑（规则注册事件）
      registEventItemForTooneReport(
        componentCode,
        windowCode,
        reportControlCode,
        routeContext,
        eventCode,
        ruleSetCode,
        invokeParams,
        returnMappings,
        scopeId
      )
    }
  }

  //单元格注册事件
  registControlEventItemForTooneReport(reportControlCode, scopeId)
}

let registControlEventItemForTooneReport = function (
  reportControlCode,
  scopeId
) {
  WidgetAction.executeWidgetAction(
    reportControlCode,
    'registReportEvent',
    'CellClick',
    function (rptData, successCallback, failCallback) {
      if (rptData && rptData.eventCode) {
        let ruleSetCode = rptData.eventCode
        ScopeManager.openScope(scopeId)
        routeEngine.executeWindowRoute({
          ruleSetCode: ruleSetCode,
          args: null,
          success: function (args) {
            successCallback(args)
          },
          fail: function (args) {
            alert('fail')
            failCallback(args)
          }
        })
        ScopeManager.closeScope()
      }
    }
  )
}

let registEventItemForTooneReport = function (
  componentCode,
  windowCode,
  reportControlCode,
  routeContext,
  eventCode,
  ruleSetCode,
  invokeParams,
  returnMappings,
  scopeId
) {
  WidgetAction.executeWidgetAction(
    reportControlCode,
    'registReportEvent',
    eventCode,
    function (rptData, successCallback, failCallback) {
      ScopeManager.openScope(scopeId)
      let param = parseParam(
        invokeParams,
        componentCode,
        windowCode,
        ruleSetCode,
        'local',
        'client-ruleSet',
        routeContext,
        rptData
      )
      routeEngine.executeWindowRoute({
        ruleSetCode: ruleSetCode,
        args: param,
        success: function (args) {
          if (!successCallback) {
            return
          }

          let returnArgs = {}
          if (returnMappings) {
            for (let j = 0; j < returnMappings.length; j++) {
              let mapping = returnMappings[j]
              let srcValue = mapping['srcValue']
              let destValue = mapping['destValue']
              if (!srcValue || !destValue) {
                continue
              }
              let fieldMappings = mapping['fieldMapping']

              let srcDatasource = args[srcValue]
              if (!srcDatasource) {
                continue
              }
              let srcObjs = srcDatasource.getAllRecords().datas
              if (srcObjs && srcObjs.length > 0) {
                let srcObj = srcObjs[0]
                let destObj = {}
                for (let k = 0; k < fieldMappings.length; k++) {
                  let fieldMapping = fieldMappings[k]
                  let srcType = fieldMapping['srcType']
                  let srcFieldName = fieldMapping['srcValue']
                  let destFieldName = fieldMapping['destValue']
                  if (!destFieldName) {
                    continue
                  }
                  let items = destFieldName.split('.')
                  if (items.length > 1) {
                    destFieldName = items[1]
                  }

                  let value = null
                  if (srcType && srcType == 'expression') {
                    let expressionContext = new ExpressionContext()
                    expressionContext.setRouteContext(routeContext)
                    value = getExpressionValue(expressionContext, srcFieldName)
                  } else {
                    let value = srcObj[srcFieldName]
                  }
                  destObj[destFieldName] = value
                }

                //修改状态
                let statValue = destObj[STATE_FIELDNAME]
                if (statValue != ADD_STATE) {
                  destObj[STATE_FIELDNAME] = EDIT_STATE
                }

                returnArgs[destValue] = destObj
              }
            }
          }

          successCallback(returnArgs)
        },
        fail: function (args) {
          if (!failCallback) {
            failCallback(args)
          }
        }
      })
      ScopeManager.closeScope()
    }
  )
}

let parseParam = function (
  invokeParams,
  componentCode,
  windowCode,
  ruleSetCode,
  invokeType,
  sourceType,
  routeContext,
  rptData
) {
  let param = {}
  //获取活动集配置
  let ruleSetConfig
  if (windowCode) {
    let windowRoute = sandBox.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.WindowRoute'
    )
    ruleSetConfig = windowRoute.getRoute({
      componentCode: componentCode,
      windowCode: windowCode,
      routeCode: ruleSetCode
    })
  } else {
    let componentRoute = sandBox.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.ComponentRoute'
    )
    ruleSetConfig = componentRoute.getRoute({
      componentCode: componentCode,
      routeCode: ruleSetCode
    })
  }
  for (let i = 0; invokeParams != null && i < invokeParams.length; i++) {
    let invokeObj = invokeParams[i]
    let paramCode = invokeObj['paramCode']
    if (paramCode == null || paramCode == '') {
      throw new Error('输入参数名不能为空')
    }

    //参数类型，expression:表达式，entity:实体
    let paramType = invokeObj['paramType']
    //来源类型：1、窗体实体。2、窗体输入实体。3、方法输入实体。4、方法变量实体。5、报表实体
    let paramSource = invokeObj['paramSource']
    if (paramType == 'expression') {
      parseParamForExpression(routeContext, invokeObj, param, rptData)
    } else if (paramType == 'entity') {
      if (paramSource == 'ReportEntity') {
        parseParamForReportEntity(
          routeContext,
          invokeObj,
          param,
          ruleSetConfig,
          rptData
        )
      } else {
        parseParamForEntity(routeContext, invokeObj, param, ruleSetConfig)
      }
    }
  }

  if (sourceType == 'server-ruleSet') {
    return param
  }
  //如果调用活动集时，设置了入参，则将此入参的值覆盖到活动集原始配置参数中。
  let mockParam = {}
  if (ruleSetConfig && ruleSetConfig.getInputs()) {
    let ruleSetcfg_inputs = ruleSetConfig.getInputs()
    for (let i = 0, l = ruleSetcfg_inputs.length; i < l; i++) {
      let input_Obj = ruleSetcfg_inputs[i]
      let input_value = input_Obj.geInitValue()
      let type = input_Obj.getType()
      //如果参数为实体类型，则转为游离DB
      if (type == 'entity') {
        let fieldsMapping = input_Obj.getConfigs()
        let freeDB = getFreeDB(fieldsMapping)
        input_value = freeDB
      }
      mockParam[input_code] = input_value
      for (let param_code in param) {
        if ((input_code = param_code)) {
          mockParam[input_code] = param[param_code]
        }
      }
    }
  }
  //执行SPI活动集时，当发现有configData信息时，需要以configData的入参来替换掉原装SPI入参
  if (invokeType == 'spi') {
    let configData_inputs = appData.getRuleSetInputs({
      componentCode: componentCode,
      windowCode: windowCode,
      metaCode: ruleSetCode
    })
    if (configData_inputs && configData_inputs.length > 0) {
      //用configData过滤:只过滤非实体类型。(目前只考虑简单类型的匹配，即非实体类型)
      if (configData_inputs && configData_inputs.length > 0) {
        for (let input_code in mockParam) {
          for (let j = 0; j < configData_inputs.length; j++) {
            let configDataObj = configData_inputs[j]
            let configDataObj_code = configDataObj.getCode()
            let configDataObj_initValue = configDataObj.geInitValue()
            if (input_code == configDataObj_code) {
              mockParam[input_code] = configDataObj_initValue
            }
          }
        }
      }
    }
  }
  return mockParam
}

let parseParamForExpression = function (
  routeContext,
  invokeObj,
  param,
  rptData
) {
  //活动集参数
  if (!rptData || !rptData.data) return

  let paramCode = invokeObj['paramCode']
  let value = invokeObj['paramValue']
  if (value != null && value != '') {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)

    let selectedEntity = {}
    let entityNames = Object.keys(rptData.data)
    for (let i = 0; i < entityNames.size(); i++) {
      let entityName = entityNames[i]
      let entity = rptData.data[entityName]
      let fieldCodes = Object.keys(entity)
      for (let j = 0; j < fieldCodes.size(); j++) {
        let fieldCode = fieldCodes[j]
        let key = entityName + '.' + fieldCode
        selectedEntity[key] = entity[fieldCode]
      }
    }

    context.getExpressionContext().put('Report@@Entity', selectedEntity)
    let val = ExpressionEngine.execute({
      expression: value,
      context: context
    })
    param[paramCode] = val
  }
}

let parseParamForEntity = function (
  routeContext,
  invokeObj,
  param,
  ruleSetConfig
) {
  //活动集参数
  let paramCode = invokeObj['paramCode']
  //值来源
  let srcEntityName = invokeObj['paramValue']
  //来源类型：窗体实体、窗体输入实体、方法输入实体、方法变量实体、报表实体
  let paramSource = invokeObj['paramSource']
  //数据提交方式：modify:修改过的(新增,修改或删除的)，all:(默认,新增,修改或删除的)
  let dataFilterType = invokeObj['dataFilterType']
  //字段映射
  let paramFieldMapping = invokeObj['paramFieldMapping']

  checkParamFieldMapping(paramFieldMapping, ruleSetConfig)

  //创建游离DB
  let fieldsMapping = ruleSetConfig.getInput(paramCode).getConfigs()
  let freeDB = getFreeDB(fieldsMapping)
  let srcDB = null
  switch (paramSource) {
    case 'ruleSetInput':
      srcDB = routeContext.getInputParam(srcEntityName)
      break
    case 'ruleSetVar':
      srcDB = routeContext.getVariable(srcEntityName)
      break
    case 'windowInput':
      srcDB = windowParam.getInput({
        code: srcEntityName
      })
      break
    default:
      srcDB = datasourceManager.lookup({
        datasourceName: srcEntityName
      })
      break
  }

  if (srcDB) {
    datasourcePusher.copyBetweenEntities({
      sourceEntity: srcDB,
      destEntity: freeDB,
      valuesMapping: paramFieldMapping,
      dataFilterType: dataFilterType,
      routeContext: routeContext
    })
  }

  param[paramCode] = freeDB
}

let STATE_FIELDNAME = 'I_N_P_U_T_S_T_A_T_E'
let UNCHANGE_STATE = 'UnChange'
let ADDEMPTY_STATE = 'AddEmpty'
let ADD_STATE = 'Add'
let EDIT_STATE = 'Edit'
let DELETE_STATE = 'Delete'

let parseParamForReportEntity = function (
  routeContext,
  invokeObj,
  param,
  ruleSetConfig,
  rptData
) {
  if (!rptData || !rptData.data) return

  //活动集参数
  let destEntityName = invokeObj['paramCode']
  //值来源
  let srcEntityName = invokeObj['paramValue']
  //活动集参数 值来源 之间的字段映射
  let paramFieldMapping = invokeObj['paramFieldMapping']
  //校验字段映射
  checkParamFieldMapping(paramFieldMapping, ruleSetConfig)
  //活动集参数中的实体字段列表
  let destFields = ruleSetConfig.getInput(destEntityName).getConfigs()
  //受限于界面实体更新算法，增加stateFieldName字段，生成更新记录时，修改此字段的值。
  destFields = addStateField(destFields)
  paramFieldMapping = addStateFieldMapping(paramFieldMapping)
  changeParamFieldMapping(paramFieldMapping)

  let srcDatas = rptData.data[srcEntityName]
  let destDataSource = createDataSource(
    routeContext,
    srcDatas,
    destFields,
    paramFieldMapping
  )
  param[destEntityName] = destDataSource
}

let checkParamFieldMapping = function (paramFieldMapping, ruleSetConfig) {
  if (paramFieldMapping == null || paramFieldMapping.length == 0) {
    throw new Error('输入参数类型为实体时，参数实体字段映射不能为空')
  }

  for (
    let i = 0;
    paramFieldMapping != null && i < paramFieldMapping.length;
    i++
  ) {
    let mappingItem = paramFieldMapping[i]
    let paramEntityField = mappingItem['paramEntityField']
    if (paramEntityField == null || paramEntityField == '') {
      throw new Error('输入参数类型为实体时，参数实体字段不能为空')
    }
    //字段值(字段值类型为field时为前台实体的字段,否则为表达式)
    let fieldValue = mappingItem['fieldValue']
    //字段来源类型：field:前台实体字段, expression:表达式
    let fieldValueType = mappingItem['fieldValueType']
    if (
      fieldValueType == 'entityField' &&
      (fieldValue == null || fieldValue == '')
    ) {
      throw new Error('输入参数类型为实体时，来源字段配置不能为空')
    }
  }
  if (!ruleSetConfig) {
    let exception = exceptionFactory.create({
      message:
        '请先打开目标组件容器！componentCode=' +
        componentCode +
        'windowCode=' +
        windowCode,
      type: exceptionFactory.TYPES.Business
    })
    throw exception
  }
}

let addStateField = function (destFields) {
  let newDestFields = []
  $.extend(newDestFields, destFields)

  let extendField = {}
  $.extend(extendField, newDestFields[0])
  extendField.code = STATE_FIELDNAME
  extendField.configs = null
  extendField.initValue = null
  extendField.type = 'char'
  newDestFields.push(extendField)

  return newDestFields
}

let addStateFieldMapping = function (paramFieldMapping) {
  let newParamFieldMapping = []
  $.extend(newParamFieldMapping, paramFieldMapping)

  let extendMappingItem = {}
  extendMappingItem['paramEntityField'] = STATE_FIELDNAME
  extendMappingItem['fieldValue'] = STATE_FIELDNAME
  newParamFieldMapping.push(extendMappingItem)

  return newParamFieldMapping
}

let changeParamFieldMapping = function (paramFieldMapping) {
  for (let i = 0; i < paramFieldMapping.length; i++) {
    let mappingItem = paramFieldMapping[i]
    let fieldValue = mappingItem['fieldValue']
    let fieldValueType = mappingItem['fieldValueType']
    if ('expression' != fieldValueType) {
      //为实体时，去掉实体名称
      let items = fieldValue.split('.')
      if (items.length > 1) {
        fieldValue = items[items.length - 1]
      }
      mappingItem['fieldValue'] = fieldValue
    }
  }
}

let createDataSource = function (
  routeContext,
  srcDatas,
  destFields,
  paramFieldMapping
) {
  let freeDB = getFreeDB(destFields)
  let loadDatas = []
  let addDatas = []
  let editDatas = []
  let tmpEditDatas = []
  let delDatas = []

  if (srcDatas instanceof Array) {
    for (let i = 0; i < srcDatas.length; i++) {
      let srcData = srcDatas[i]
      let stateFieldValue = srcData[STATE_FIELDNAME]
      if (stateFieldValue == UNCHANGE_STATE) {
        //未修改
        let loadData = createLoadData(
          routeContext,
          srcData,
          paramFieldMapping,
          stateFieldValue
        )
        loadDatas.push(loadData)
      } else if (stateFieldValue == ADD_STATE) {
        //增加
        let destRecord = createRecord(
          routeContext,
          freeDB,
          srcData,
          paramFieldMapping,
          stateFieldValue
        )
        let item = {}
        item.index = i
        item.records = destRecord
        addDatas.push(item)
      } else if (stateFieldValue == EDIT_STATE) {
        //修改
        let loadData = createLoadData(
          routeContext,
          srcData,
          paramFieldMapping,
          stateFieldValue
        )
        loadDatas.push(loadData)

        let editRecord = createRecord(
          routeContext,
          freeDB,
          srcData,
          paramFieldMapping,
          stateFieldValue
        )
        editDatas.push(editRecord)
        let tmEditRecord = createRecord(
          routeContext,
          freeDB,
          srcData,
          paramFieldMapping,
          UNCHANGE_STATE
        )
        tmpEditDatas.push(tmEditRecord)
      } else if (stateFieldValue == DELETE_STATE) {
        //删除
        //必须有id字段
        let id = srcData['id']
        if (id) {
          delDatas.push(id)
        }
        let loadData = createLoadData(
          routeContext,
          srcData,
          paramFieldMapping,
          stateFieldValue
        )
        loadDatas.push(loadData)
      }
    }
  }

  //加载
  let obj = {}
  obj.datas = loadDatas
  obj.dataAmount = loadDatas.length
  obj.isAppend = true
  freeDB.load(obj)

  //增加
  if (addDatas && addDatas.length > 0) {
    for (let i = 0; i < addDatas.length; i++) {
      let item = addDatas[i]
      let index = item.index
      let selectedRecord = freeDB.getRecordByIndex(index)
      if (selectedRecord) {
        let selectedObj = {}
        selectedObj.records = [selectedRecord]
        selectedObj.isSelect = true
        freeDB.selectRecords(selectedObj)
      }
      let addObj = {}
      addObj.records = [item.records]
      addObj.position = 'BEFORE'
      freeDB.insertRecords(addObj)
    }
  }

  //修改
  if (editDatas && editDatas.length > 0) {
    let editObj = {}
    editObj.records = tmpEditDatas
    freeDB.updateRecords(editObj)

    editObj.records = editDatas
    freeDB.updateRecords(editObj)
  }

  //删除
  if (delDatas && delDatas.length > 0) {
    let deleteObj = {}
    deleteObj.ids = delDatas
    freeDB.removeRecordByIds(deleteObj)
  }

  return freeDB
}

let createLoadData = function (
  routeContext,
  srcData,
  paramFieldMapping,
  stateFieldValue
) {
  let result = {}
  for (let i = 0; i < paramFieldMapping.length; i++) {
    let mappingItem = paramFieldMapping[i]
    let paramEntityField = mappingItem['paramEntityField']
    let fieldValue = mappingItem['fieldValue']
    let fieldValueType = mappingItem['fieldValueType']

    let value
    if ('expression' == fieldValueType) {
      let expressionContext = new ExpressionContext()
      expressionContext.setRouteContext(routeContext)
      value = getExpressionValue(expressionContext, fieldValue)
    } else {
      value = srcData[fieldValue]
    }

    result[paramEntityField] = value
  }
  result[STATE_FIELDNAME] = stateFieldValue
  return result
}

let createRecord = function (
  routeContext,
  freeDB,
  srcData,
  paramFieldMapping,
  stateFieldValue
) {
  let destRecord = freeDB.createRecord()
  for (let i = 0; i < paramFieldMapping.length; i++) {
    let mappingItem = paramFieldMapping[i]
    let paramEntityField = mappingItem['paramEntityField']
    let fieldValue = mappingItem['fieldValue']
    let fieldValueType = mappingItem['fieldValueType']

    let value
    if ('expression' == fieldValueType) {
      let expressionContext = new ExpressionContext()
      expressionContext.setRouteContext(routeContext)
      value = getExpressionValue(expressionContext, fieldValue)
    } else {
      value = srcData[fieldValue]
    }

    destRecord.set(paramEntityField, value)
  }
  destRecord.set(STATE_FIELDNAME, stateFieldValue)
  return destRecord
}

let getFreeDB = function (fieldsMapping) {
  let json = createJsonFromConfig(fieldsMapping)
  return datasourceFactory.unSerialize(json)
}

let createJsonFromConfig = function (params) {
  let fields = []
  let freeDBName = 'freeDB_' + uuid.generate()
  for (let i = 0, l = params.length; i < l; i++) {
    let param = params[i]
    fields.push({
      code: param.getCode(),
      name: param.getName(),
      type: param.getType(),
      defaultValue: param.geInitValue()
    })
  }
  return {
    datas: {
      values: []
    },
    metadata: {
      model: [
        {
          datasource: freeDBName,
          fields: fields
        }
      ]
    }
  }
}

//打印方式为"TooneReport"，整理itemConfigs
let getRequestForTooneReport = function (itemConfigs, routeContext) {
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    //来源类型（Table：表，Query：查询， WindowEntity：窗体实体，Api：方法）
    let sourceType = itemConfig.Istype
    if (sourceType == 'Table' || sourceType == 'Query') {
      //字段映射
      let items = itemConfig.items
      let isExist = isExistExpressionInItems(items)
      if (isExist) {
        let datas = getFromDataBase(itemConfig, routeContext)
        itemConfig.datas = datas
      } else {
        //过滤条件
        let dsWhere = itemConfig.dsWhere
        //查询参数
        let itemqueryparam = itemConfig.itemqueryparam
        //排序
        let orderBys = itemConfig.orderBy

        let whereRestrict = getWhereRestrictExpression(
          routeContext,
          dsWhere,
          itemqueryparam,
          orderBys
        )
        itemConfig.queryParameters = whereRestrict.toParameters()
        itemConfig.queryCondition = whereRestrict.toWhere()
        itemConfig.queryOrderBy = whereRestrict.toOrderBy()
      }
    } else if (sourceType == 'WindowEntity') {
      let datas = getFromWindowEntity(itemConfig, routeContext)
      itemConfig.datas = datas
    } else if (sourceType == 'Api') {
      let invokeRuleParams = itemConfig.invokeRuleParams
      getApiExpression(routeContext, invokeRuleParams)
    }
  }
}

//打印方式为"TooneReport"，获取Html数据
let getHtmlData = function (
  reportType,
  reportCode,
  reportControlCode,
  itemConfigs
) {
  let scope = ScopeManager.getScope()
  let params = {
    isAsyn: true,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    ruleSetCode: 'GetDataBaseDataToReport',
    isRuleSetCode: false,
    commitParams: [
      {
        paramName: 'isPrint',
        paramType: 'char',
        paramValue: '1'
      },
      {
        paramName: 'reportType',
        paramType: 'char',
        paramValue: reportType
      },
      {
        paramName: 'reportCode',
        paramType: 'char',
        paramValue: reportCode
      },
      {
        paramName: 'reportControlCode',
        paramType: 'char',
        paramValue: reportControlCode
      },
      {
        paramName: 'itemConfigs',
        paramType: 'char',
        paramValue: itemConfigs
      }
    ],
    afterResponse: function (result) {
      var success = result['success']
      if (success == true) {
        var data = result['data']
        var reportControlCode = data.reportControlCode
        var reportData = data.reportData
        //设置数据源
        var datasource = []
        datasource.push(reportData)

        var cfg = {}
        // 服务器名称
        cfg.serviceHost = ''
        // 服务器类型
        cfg.serverHostType = 'local'
        // 打印机名称
        cfg.printerName = ''
        // 打印份数
        cfg.printNum = 1
        // 数据源
        cfg.datasource = datasource

        //调用JGReportAction.js中的tooneReportHtmlData方法
        WidgetAction.executeWidgetAction(
          reportControlCode,
          'tooneReportHtmlData',
          cfg
        )
      }
    }
  }
  RemoteMethodAccessor.invoke(params)
}

//打印方式为"TooneReport"，获取SpreadJs数据
let getRemoteDataForTooneReport = function (
  routeContext,
  reportType,
  reportCode,
  reportControlCode,
  itemConfigs,
  operateType
) {
  let readOnly = widgetProperty.get(reportControlCode, 'ReadOnly')
  if (readOnly == null || readOnly == 'True') readOnly = true

  let scope = ScopeManager.getScope()
  let params = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    ruleSetCode: 'GetDataBaseDataToReport',
    isRuleSetCode: false,
    commitParams: [
      {
        paramName: 'isPrint',
        paramType: 'char',
        paramValue: '0'
      },
      {
        paramName: 'reportType',
        paramType: 'char',
        paramValue: reportType
      },
      {
        paramName: 'reportCode',
        paramType: 'char',
        paramValue: reportCode
      },
      {
        paramName: 'reportControlCode',
        paramType: 'char',
        paramValue: reportControlCode
      },
      {
        paramName: 'operateType',
        paramType: 'char',
        paramValue: operateType
      },
      {
        paramName: 'itemConfigs',
        paramType: 'char',
        paramValue: itemConfigs
      },
      {
        paramName: 'readOnly',
        paramType: 'boolean',
        paramValue: readOnly
      }
    ],
    afterResponse: function (result) {
      var success = result['success']
      if (success == true) {
        var data = result['data']
        //设置报表编码，用于填报时修改数据后，打印用
        data.reportCode = reportCode
        data.reportType = reportType

        //调用JGReportAction.js中的tooneReport方法
        var methodName = 'tooneReport'
        if (operateType == 'write') {
          methodName = 'tooneReportInput'
        }
        var isInput = !readOnly
        WidgetAction.executeWidgetAction(
          reportControlCode,
          methodName,
          data,
          isInput
        )
        //清理缓存的报表实体对象
        var key = 'Report@@Entity'
        var scope = ScopeManager.getScope()
        scope.set(key, null)
        //异步获取html数据
        getHtmlData(reportType, reportCode, reportControlCode, itemConfigs)
      }
    }
  }

  RemoteMethodAccessor.invoke(params)
}

export { main }
