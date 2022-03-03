import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { WhereRestrict as WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ExpressionEngine as formulaEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext1 } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { QueryCondUtil as util } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'
import { facade as paginationService } from '@v-act/vjs.framework.extension.platform.services.widget.pagination'
import { DataAdapter as dataAdapter } from '@v-act/vjs.framework.extension.platform.services.viewmodel.dataadapter'
import { object as DataAccessObject } from '@v-act/vjs.framework.extension.platform.services.repository.data'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

let undefined
let undefined
let undefined
let undefined
let sandBox
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}
//判断字符是否为空的方法
function isEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}
//规则主入口(必须有)
let main = function (ruleContext) {
  //获取规则上下文中的规则配置值
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)

  let isAsyn = inParamsObj['isAsyn']
  let routeRuntime = ruleContext.getRouteContext()
  let callBack = routeRuntime.getCallBackFunc()
  let callBackFunc = function (output) {
    if (typeof callBack == 'function') {
      callBack.apply(routeRuntime, [routeRuntime])
    }
  }
  let itemConfigs = inParamsObj['itemsConfig']
  for (let i = 0; i < itemConfigs.length; i++) {
    let itemConfig = itemConfigs[i]
    let isType = itemConfig['Istype']
    //查询：1，表：0
    let queryConds = itemConfig['dsWhere']
    // 过滤条件
    let entityName = itemConfig['entityName']
    //目标DB
    let itemqueryparam = itemConfig['itemqueryparam']
    //源数据中的字段
    let items = itemConfig['items']
    //高级查询参数值
    let tableOrQuery = itemConfig['tableOrQuery']
    let valueFunctions = itemConfig['valueFunctions']
    //这里要处理常量和表达式的交互
    if (tableOrQuery != null && tableOrQuery.length > 0) {
      for (let index = 0; index < tableOrQuery.length; index++) {
        let columntableOrQuery = tableOrQuery[index]

        let columnName = columntableOrQuery['paramsName']
        let columnValue = columntableOrQuery['paramsValue']
        if (columnName == 'rowSumName' || columnName == 'colSumName') {
          let expContext = {}
          let context = new ExpressionContext1()
          context.setRouteContext(ruleContext.getRouteContext())
          if (!isEmpty(columnValue)) {
            columnValue = formulaEngine.execute({
              expression: columnValue,
              context: context
            })
            columntableOrQuery['paramsValue'] = columnValue
          }
        }
        if (columnName == 'isEmptyToProduceDynamicCol') {
          let context = new ExpressionContext1()
          context.setRouteContext(ruleContext.getRouteContext())
          if (!isEmpty(columnValue)) {
            columntableOrQuery['paramsValue'] = formulaEngine.execute({
              expression: columnValue,
              context: context
            })
          }
        }
      }
      if (valueFunctions != null) {
        let entityObject = jsonUtil.obj2json(valueFunctions, false)
        let values = { paramsName: 'valueFunctions', paramsValue: entityObject }
        tableOrQuery.push(values)
      }
    }

    //映射关系
    let sourceName = itemConfig['sourceName']
    //源数据Name
    //处理非数据集字段的映射值
    let mappings = getMappings(items)
    // 自定义查询时，扩展的查询条件
    let extraCondition = null
    // 根据过滤条件获取出源数据源数据
    let isCustomSqlFind = isType + '' == '1'
    let whereRestrict = WhereRestrict.init(isCustomSqlFind ? 'custom' : 'table')
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

    //            var params = queryConditionUtil.genCustomParams(itemqueryparam);
    params = util.genCustomParams({
      paramDefines: itemqueryparam,
      routeContext: ruleContext.getRouteContext()
    })

    whereRestrict.addExtraParameters(params)

    let routeRuntime = ruleContext.getRouteContext()

    let paginationObj = paginationService.getPagingInfoByDataSource(entityName)
    let recordStart = paginationObj.recordStart
    let pageSize = paginationObj.pageSize

    let isAsyn = isAsyn
    let callBack = callBackFunc

    let queryParams = {}
    let queryType = 'Table'
    if (isType == 1) {
      //自定义查询
      queryType = 'Query'
      queryParams = genCustomSqlQueryParams(whereRestrict.toParameters())
      if (i < itemConfigs.length - 1) {
        isAsyn = false
        callBack = null
      } else {
        isAsyn = isAsyn
        callBack = callBackFunc
      }
      //viewModel.getDataModule().loadDataByDSWithOtherCustomQuery(entityName, sourceName, queryParams, whereRestrict.toWhere(), mappings, loadParam);
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
      if (i < itemConfigs.length - 1) {
        isAsyn = false
        callBack = null
      } else {
        isAsyn = isAsyn
        callBack = callBackFunc
      }

      // var tableOrQuery = itemConfig["tableOrQuery"];
    }

    let entityObject = ''
    if (isType == 'Entity') {
      let dataSource = getDataSource(sourceName, routeRuntime)
      entityObject = jsonUtil.obj2json(dataSource.serialize(), false)
    }

    let dataprovider = {
      name: sourceName,
      type: queryType
    }
    let modelSchema = {
      modelMapping: {
        sourceModelName: sourceName,
        targetModelName: entityName,
        fieldMappings: mappings
      }
    }
    let command = {
      config: {
        where: whereRestrict,
        pageSize: pageSize,
        recordStart: recordStart,
        filterFields: null, //这里直接添加规则valueFunctions参数通用解析逻辑不解析旧直接用了之前为null值的参数
        tableOrQuery: tableOrQuery
      },
      type: 'query'
    }

    let dao = new DataAccessObject(dataprovider, modelSchema, command)
    let queryParam = {
      dataAccessObjects: [dao],
      isAsync: isAsyn,
      sourceType: isType,
      entityInfo: entityObject,
      callback: null
    }
    dataAdapter.queryDataSenior({
      config: queryParam,
      isAppend: false
    })
    routeRuntime.setCallBackFlag(false)
  }
}
/**
 * desc Json字符串转Json对象
 * inParams
 * vjs:
 * 		"vjs.framework.extension.util.json":null,
 * services:
 * 		jsonUtil = sandbox.getService("vjs.framework.extension.util.JsonUtil");
 * */
let convertJson = function (inParams) {
  let result = {}
  if (undefined != inParams) {
    result = jsonUtil.json2obj(inParams)
  }
  return result
}
/**
 * 获得非数据集字段的映射值
 */
let getMappings = function (fromMappings) {
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
          //                        sourceName = formulaUtil.evalExpression(sourceName);
          var context = new ExpressionContext()
          var sourceName = engine.execute({
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

/**
 * desc 获取各类数据源（窗体实体、方法实体）
 * dataSourceName 数据源名称
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.interface.exception":null,
 * 		"vjs.framework.extension.platform.services.model.manager.datasource":null
 * services:
 * 		manager = sandbox.getService("vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager");
 * 		DBFactory = sandbox.getService("vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory");
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 * */
function getDataSource(dataSourceName, routeContext) {
  let dsName = dataSourceName
  let datasource = null
  if (dsName != null && dsName != '') {
    /*本身是实体对象*/
    if (DBFactory.isDatasource(dsName)) {
      datasource = dsName
    } else {
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      /*窗体实体*/
      if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
        datasource = manager.lookup({
          datasourceName: dsName
        })
      } else {
        /*方法实体*/
        datasource = engine.execute({
          expression: dsName,
          context: context
        })
      }
    }
  }
  if (!datasource) {
    HandleException('实体[' + dsName + ']不存在')
  }
  return datasource
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

export { main }
