import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVMMappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import {
  QueryCondUtil as queryConditionUtil,
  WhereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let sandBox

export function initModule(sBox) {
  sandBox = sBox
}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let routeRuntime = ruleContext.getRouteContext()
  let isAsyn = inParamsObj['isAsyn']
  let context = new ExpressionContext()
  context.setRouteContext(routeRuntime)

  let callBack = routeRuntime.getCallBackFunc()
  let callBackFunc = function (output) {
    if (typeof callBack == 'function') {
      callBack.apply(routeRuntime, [routeRuntime])
    }
  }
  let itemConfigs = inParamsObj['itemsConfig']
  let treeStruct = inParamsObj['treeStruct']
  let dtds = []
  let nowDtd = null
  for (let i = 0; i < itemConfigs.length; i++) {
    let _itemConfig = itemConfigs[i]
    let asyFun = function (itemConfig) {
      let dtd = $.Deferred()
      let isType = itemConfig['Istype']
      // 查询：1，表：0
      let queryConds = itemConfig['dsWhere']
      // 过滤条件
      let entityName = itemConfig['entityName']
      // 目标DB
      let targetModelType = itemConfig['entityType']
      // 目标实体类型
      let itemqueryparam = itemConfig['itemqueryparam']
      // 源数据中的字段
      let items = itemConfig['items']
      // 映射关系
      let sourceName = itemConfig['sourceName']
      // 源数据Name
      let dynamicLoad = itemConfig['dataLoad']
      //是否自动映射字段
      let isFieldAutoMapping =
        itemConfig.isFieldAutoMapping === true ? true : false
      let __isWindowRule = _isWindowRule(targetModelType)
      if (__isWindowRule) {
        handleWindowRule(entityName)
      }

      //动态加载
      let mode = isCustomSqlFind ? 'custom' : 'table'
      let wrParam = {
        fetchMode: mode,
        routeContext: routeRuntime
      }
      let whereRestrict = WhereRestrict.init(wrParam)
      let whereRestrictNoDepthFilter = WhereRestrict.init(wrParam)
      // 处理动态加载数据
      let dynamicLoadCallBackFunc = (function (d, flag) {
        return function () {
          queryParam.dataAccessObjects[0].command.config.depth = dynamicLoad
          queryParam.dataAccessObjects[0].command.config.whereToWhere =
            whereRestrict.toWhere()
          queryParam.dataAccessObjects[0].command.config.whereRestrictNoDepthFilter =
            whereRestrictNoDepthFilter
          //给方法变量赋值  (开发系统暂时没有分页配置逻辑，后期考虑)
          if (
            undefined != totalRecordSave &&
            null != totalRecordSave &&
            totalRecordSave.length > 0
          ) {
            handlePagingLogic(
              totalRecordSave,
              ruleContext,
              entityName,
              targetModelType
            )
          }
          //设置为异步异步
          //ruleContext.fireRuleCallback();
          ruleContext.setRuleStatus(true)
          d.resolve()
        }
      })(dtd, isAsyn)
      let mappings = getMappings(items, context)
      let treeStructMap = handleTreeStruct(
        dynamicLoad,
        mappings,
        sourceName,
        entityName,
        treeStruct,
        isFieldAutoMapping,
        whereRestrict
      )
      // 自定义查询时，扩展的查询条件
      let extraCondition = null
      // 根据过滤条件获取出源数据源数据
      let isCustomSqlFind = isType + '' == '1'
      if (
        undefined != queryConds &&
        null != queryConds &&
        queryConds.length > 0
      ) {
        whereRestrict.andExtraCondition(
          queryConds,
          isCustomSqlFind ? 'custom' : 'table'
        )
        whereRestrictNoDepthFilter.andExtraCondition(
          queryConds,
          isCustomSqlFind ? 'custom' : 'table'
        )
      }

      let params = queryConditionUtil.genCustomParams({
        paramDefines: itemqueryparam,
        routeContext: routeRuntime
      })

      whereRestrict.addExtraParameters(params)
      whereRestrictNoDepthFilter.addExtraParameters(params)

      let pagers = itemConfig['pager']
      let isPaging
      let pageSize = -1
      let recordStart = -1
      let totalRecordSave

      //加载规则分页
      if (undefined != pagers && null != pagers && pagers.length > 0) {
        let expressionContext = new ExpressionContext()
        expressionContext.setRouteContext(ruleContext.getRouteContext())
        let pager = pagers[0]
        let pageNo = -1
        let size = -1
        totalRecordSave = pager.totalRecordSave
        isPaging = pager.isPaging
        if (undefined != isPaging && null != isPaging && isPaging) {
          let pageNoTemp = engine.execute({
            expression: pager.pageNo,
            context: expressionContext
          })
          let pageSizeTemp = engine.execute({
            expression: pager.pageSize,
            context: expressionContext
          })

          if (pageNoTemp != null && pageNoTemp != '' && !isNaN(pageNoTemp)) {
            pageNo = parseInt(pageNoTemp)
          }

          if (
            pageSizeTemp != null &&
            pageSizeTemp != '' &&
            !isNaN(pageSizeTemp)
          ) {
            size = parseInt(pageSizeTemp)
          }

          if (pageNo != -1 && size != -1) {
            pageSize = size
            recordStart = (pageNo - 1) * size + 1
          }
        }
      }
      //分页控件分页
      if (
        __isWindowRule &&
        (undefined == isPaging || null == isPaging || !isPaging)
      ) {
        let paginationService = sandBox.getService(
          'vjs.framework.extension.platform.services.widget.pagination.facade'
        )
        let paginationObj =
          paginationService.getPagingInfoByDataSource(entityName)
        recordStart = paginationObj.recordStart
        pageSize = paginationObj.pageSize
      }

      let isCover = true
      let callBack = callBackFunc

      let queryParams = {}
      let queryType = 'Table'
      if (isType == 1) {
        //自定义查询
        queryType = 'Query'
        queryParams = genCustomSqlQueryParams(whereRestrict.toParameters())
        if (i < itemConfigs.length - 1) {
          callBack = null
        } else {
          callBack = callBackFunc
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
              whereRestrictNoDepthFilter.addOrderByDesc(orderByField)
            } else {
              whereRestrict.addOrderBy(orderByField)
              whereRestrictNoDepthFilter.addOrderBy(orderByField)
            }
          }
        }
        if (i < itemConfigs.length - 1) {
          callBack = null
        } else {
          callBack = callBackFunc
        }
      }

      let dataAdapter = sandBox.getService(
        'vjs.framework.extension.platform.services.viewmodel.dataadapter.DataAdapter'
      )
      let DataAccessObject = sandBox.getService(
        'vjs.framework.extension.platform.services.repository.data.object'
      )

      let dataprovider = {
        name: sourceName,
        type: queryType
      }
      let modelSchema = {
        modelMapping: {
          sourceModelName: sourceName,
          targetModelName: entityName,
          treeStruct: treeStructMap,
          targetModelType: targetModelType,
          fieldMappings: mappings,
          isFieldAutoMapping: isFieldAutoMapping //是否自动映射字段
        }
      }
      let command = {
        config: {
          where: whereRestrict,
          pageSize: pageSize,
          recordStart: recordStart,
          filterFields: null
        },
        type: 'query'
      }

      let dao = new DataAccessObject(dataprovider, modelSchema, command)
      let queryParam = {
        dataAccessObjects: [dao],
        isAsync: i < itemConfigs.length - 1 ? false : true,
        callback: dynamicLoadCallBackFunc
      }
      dataAdapter.queryData({
        config: queryParam,
        isAppend: false,
        isConcurrent: isAsyn,
        routeContext: routeRuntime
      })
      routeRuntime.setCallBackFlag(false)
      return dtd
    }
    if (i == 0) {
      nowDtd = asyFun(_itemConfig)
    } else {
      nowDtd = nowDtd.then(
        (function (config) {
          return function () {
            return asyFun(config)
          }
        })(_itemConfig)
      )
    }
  }
  if (isAsyn) {
    //串行执行加载规则
    setTimeout(
      (function (ctx) {
        return function () {
          ctx.fireRouteCallback()
        }
      })(ruleContext),
      1
    )
  }
  //标记规则为异步
  ruleContext.markRouteExecuteUnAuto()
  nowDtd.then(
    (function (flag, ctx) {
      return function () {
        ctx.fireRuleCallback()
        if (!flag) {
          ctx.fireRouteCallback()
        }
      }
    })(isAsyn, ruleContext)
  )
  /*
    $.when.apply($.when, dtds).done((function(flag, ctx) {
        return function() {
            ctx.fireRuleCallback();
            if (!flag) {
                ctx.fireRouteCallback();
            }
        }
    })(isAsyn, ruleContext));
    */
}
/**
 * 处理返回分页逻辑
 * @param {*} totalRecordSave
 * @param {*} ruleContext
 * @param {*} entityName
 * @param {*} targetModelType
 */
let handlePagingLogic = function (
  totalRecordSave,
  ruleContext,
  entityName,
  targetModelType
) {
  let totalRecordSaveObj = totalRecordSave[0]
  let isSaveTotalRecord = totalRecordSaveObj.isSaveTotalRecord
  if (
    undefined != isSaveTotalRecord &&
    null != isSaveTotalRecord &&
    isSaveTotalRecord
  ) {
    let dataSource = _getEntityDS(ruleContext, targetModelType, entityName)
    let amount = dataSource.getDataAmount()
    let target = totalRecordSaveObj.target
    let targetType = totalRecordSaveObj.targetType
    if (targetType == 'methodVariant') {
      ruleContext.getRouteContext().setVariable(target, amount)
    } else if (targetType == 'methodOutput') {
      ruleContext.getRouteContext().setOutputParam(target, amount)
    } else if (targetType == 'windowInput') {
      windowParam.setInput({
        code: target,
        value: amount
      })
    } else if (targetType == 'windowOutput') {
      windowParam.setOutput({
        code: target,
        value: amount
      })
    }
  }
}
/**
 * 处理树结构
 * @param {*} dynamicLoad
 * @param {*} mappings
 * @param {*} sourceName
 * @param {*} entityName
 * @param {*} treeStruct
 * @param {*} isFieldAutoMapping
 * @param {*} whereRestrict
 */
let handleTreeStruct = function (
  dynamicLoad,
  mappings,
  sourceName,
  entityName,
  treeStruct,
  isFieldAutoMapping,
  whereRestrict
) {
  let treeStructMap
  if (dynamicLoad != null && dynamicLoad != '-1' && dynamicLoad != '0') {
    let treeStructMap = _getTreeStruct(entityName, treeStruct)
    if (treeStructMap != null) {
      //var treeStructJson = encodeURIComponent(jsonUtil.obj2json(treeStructMap));
      //将实体的树结构转为表的树结构
      let sourceTreeStruct = dest2SourceTreeStruct(mappings, treeStructMap, {
        isFieldAutoMapping: isFieldAutoMapping
      })
      let treeStructJson = encodeURIComponent(
        jsonUtil.obj2json(sourceTreeStruct)
      )
      let whereObj = {
        condition: whereRestrict.toWhere(),
        parameters: whereRestrict.toParameters()
      }
      let whereObjJson = encodeURIComponent(jsonUtil.obj2json(whereObj))

      let expression =
        'DynamicLoadCondition("' +
        sourceName +
        '","' +
        dynamicLoad +
        '", "' +
        treeStructJson +
        '","' +
        whereObjJson +
        '")'

      let dynamicCondition = engine.execute({
        expression: expression,
        context: new ExpressionContext()
      })

      if (dynamicCondition && dynamicCondition != '') {
        //var eventName = whereRestrict.EVENT_AFTER_FIND;
        whereRestrict.andConditionString('(' + dynamicCondition + ')')
      }
    }
  }
  return treeStructMap
}
/*
 * 判断当前规则是否为窗体规则、或者构建方法规则
 */
let _isWindowRule = function (entityType) {
  let _isWinRule = true
  switch (entityType) {
    case 'ruleSetInput':
      _isWinRule = false
      break
    case 'ruleSetOutput':
      _isWinRule = false
      break
    case 'ruleSetVar':
      _isWinRule = false
      break
    case 'windowInput':
      _isWinRule = false
      break
    case 'windowOutput':
      _isWinRule = false
      break
    default:
  }
  return _isWinRule
}

let handleWindowRule = function (entityName) {
  // 处理列表过滤条件重置
  let _filterEntity = {
    datasourceName: entityName
  }
  let widgetCodes =
    windowVMMappingManager.getWidgetCodesByDatasourceName(_filterEntity)
  // 处理窗体输入或者输出实体不支持绑定控件过滤条件
  if (widgetCodes && widgetCodes.length > 0) {
    for (let j = 0, len = widgetCodes.length; j < len; j++) {
      let widget = widgetContext.get(widgetCodes[j], 'widgetObj')
      if (widget && widget._filterFields) widget._filterFields = null
    }
  }
}
/*
 * 获取树结构信息
 */
let _getTreeStruct = function (tableName, treeStructMaps) {
  if (treeStructMaps == null) return null
  for (let i = 0; i < treeStructMaps.length; i++) {
    let treeStructMap = treeStructMaps[i]
    if (treeStructMap != null && treeStructMap.tableName == tableName) {
      return treeStructMap
    }
  }
  return null
}

/**
 * 获得非数据集字段的映射值
 */
let getMappings = function (fromMappings, context) {
  let returnMappings = []
  if (!fromMappings || fromMappings.length <= 0) {
    return returnMappings
  } else {
    for (let index = 0; index < fromMappings.length; index++) {
      let fromMapping = fromMappings[index]
      let type = fromMapping['type']
      type = type.toString()
      let destName = fromMapping['destName']
      let sourceName = fromMapping['sourceName']
      let returnMapping = {}
      returnMapping['type'] = type
      returnMapping['destName'] = destName
      switch (type) {
        case 'field':
        case 'entityField':
          //数据集字段
          returnMapping['sourceName'] = sourceName
          break
        case 'expression':
          //表达式
          //sourceName = formulaUtil.evalExpression(sourceName);
          sourceName = engine.execute({
            expression: sourceName,
            context: context
          })
          returnMapping['sourceName'] = sourceName
          break
        default:
          break
      }
      returnMappings.push(returnMapping)
    }
  }
  return returnMappings
}

// 将实体的树结构转为表的树结构
let dest2SourceTreeStruct = function (mappings, treeStructMap, params) {
  // 获取字段映射关系
  let mappingFields = []
  for (let i = 0; i < mappings.length; i++) {
    let item = mappings[i]
    let type = item['type']
    if (type == 'entityField') {
      let destName1 = item['destName'].split('.')[1]
      let sourceName1 = item['sourceName'].split('.')[1]
      let fieldMap = new Object()
      fieldMap.destName = destName1
      fieldMap.sourceName = sourceName1
      mappingFields.push(fieldMap)
    }
  }
  let newSourceTreeStructMap = new Object()
  let isFieldAutoMapping = params && params.isFieldAutoMapping
  // 转实体的表结构为表的树结构
  for (let p in treeStructMap) {
    let isMappingExist = true
    let item = treeStructMap[p]
    newSourceTreeStructMap[p] = item
    if (
      p == 'pidField' ||
      p == 'treeCodeField' ||
      p == 'orderField' ||
      p == 'isLeafField'
    ) {
      isMappingExist = checkMappingExist(item, mappingFields)
    }
    if (item != '') {
      if (isMappingExist || isFieldAutoMapping) {
        for (let i = 0; i < mappingFields.length; i++) {
          if (item == mappingFields[i]['destName']) {
            newSourceTreeStructMap[p] = mappingFields[i]['sourceName']
            break
          }
        }
      } else {
        throw new Error(
          '树结构字段[' + p + ']的映射[' + newSourceTreeStructMap[p] + ']不存在'
        )
      }
    }
  }
  return newSourceTreeStructMap
}

// 判断树结构的映射字段是否存在
let checkMappingExist = function (item, mappingFields) {
  for (let i = 0; i < mappingFields.length; i++) {
    if (item == mappingFields[i]['destName']) {
      return true
    }
  }
  return false
}

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

// 获取实体数据源
let _getEntityDS = function (ruleContext, entityType, entityName) {
  let ds

  if (entityType == 'window') {
    let ds = DatasourceManager.lookup({ datasourceName: entityName })
  } else if (entityType == 'windowInput') {
    ds = windowParam.getInput({ code: entityName })
  } else if (entityType == 'windowOutput') {
    ds = windowParam.getOutput({ code: entityName })
  } else if (entityType == 'ruleSetInput') {
    ds = ruleContext.getRouteContext().getInputParam(entityName)
  } else if (entityType == 'ruleSetOutput') {
    ds = ruleContext.getRouteContext().getOutPutParam(entityName)
  } else if (entityType == 'ruleSetVar') {
    ds = ruleContext.getRouteContext().getVariable(entityName)
  }

  if (undefined == ds)
    throw new Error('找不到类型为[' + entityType + ']的实体：' + entityName)

  return ds
}

export { main }
