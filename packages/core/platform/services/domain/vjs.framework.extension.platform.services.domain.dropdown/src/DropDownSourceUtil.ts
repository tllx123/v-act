import {
  Operation,
  Request
} from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote.base'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import {
  QueryCondUtil as queryConditionUtil,
  WhereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { MapUtil as mapUtil } from '@v-act/vjs.framework.extension.util.map'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let sandbox: Record<string, any>

let genSQLConfig = function (dataSourceSetting: Record<string, any>) {
  let config = dataSourceSetting['DataConfig']
  let sql = config['SqlSelect']
  let requestCfg = {
    queryType: 'SQL',
    queryDS: sql,
    whereRestrict: null,
    recordStart: -1,
    pageSize: -1
  }
  return requestCfg
}

let genwhereRestrict = function (dataSourceSetting: Record<string, any>) {
  let config = dataSourceSetting['DataConfig']
  let Condition = config['Condition']
  let whereRestrict = WhereRestrict.init()
  if (Condition) {
    if (Condition.NewDataSet && Condition.NewDataSet.dsWhere) {
      if (
        typeof Condition.NewDataSet.dsWhere['length'] != 'undefined' &&
        Condition.NewDataSet.dsWhere.length > 0
      ) {
        Condition = Condition.NewDataSet.dsWhere
      } else {
        Condition =
          Condition.NewDataSet.dsWhere.length === 0
            ? []
            : [Condition.NewDataSet.dsWhere]
      }
    }
  }
  let QueryParam = config['QueryParam']
  if (QueryParam) {
    if (QueryParam.NewDataSet) {
      if (
        typeof QueryParam.NewDataSet.dtquery['length'] != 'undefined' &&
        QueryParam.NewDataSet.dtquery.length > 0
      ) {
        QueryParam = QueryParam.NewDataSet.dtquery
        if (arrayUtil.isArray(QueryParam)) {
          QueryParam = {
            paramDefines: QueryParam,
            routeContext: null
          }
        }
        let params = queryConditionUtil.genCustomParams(QueryParam)
        whereRestrict.addExtraParameters(params)
      }
    }
  }
  let SourceType = config['SourceType']
  if (undefined != Condition && null != Condition && Condition.length > 0) {
    whereRestrict.andExtraCondition(
      Condition,
      SourceType == 'Table' ? 'table' : 'custom'
    )
  }

  //Table方式时，增加排序条件
  if (SourceType == 'Table') {
    let SourceName = config['SourceName']

    // 2015-07-15 兼容处理[构件名].[表名]的情况，只取[表名]
    if (SourceName.indexOf('.') != -1) {
      let sourceNameItems = SourceName.split('.')
      SourceName = sourceNameItems[sourceNameItems.length - 1]
    }
    let sortType = config['SortType']
    let sortField = config['SortField']
    let sortColumn = SourceName + '.' + sortField

    if (sortField && sortType == 'Asc') {
      whereRestrict.addOrderBy(sortColumn)
    } else if (sortField && sortType == 'Desc') {
      whereRestrict.addOrderByDesc(sortColumn)
    }
  }

  return whereRestrict
}

let getVMMappingDataSources = function () {
  let componentCode = scopeManager.getScope().getComponentCode()
  let windowCode = scopeManager.getWindowScope().getWindowCode()
  let result: Record<string, any> = {
    dataSources: {}
  }
  let requestParams = {
    componentCode: componentCode,
    windowCode: windowCode,
    operation: 'VMMappingDataSourcesGetter',
    isAsync: false,
    params: {},
    success: function (resp: Record<string, any>) {
      result = resp ? resp : result
    }
  }
  remoteOperation.request(requestParams)
  return result
}

/**
 * 生成加载的查询条件缓存
 *
 * @param selectDatas 查询体selectData列表
 * @return { dataSource:数据源, loadCondition:{} }
 */
let _genDataSourceLoadConditionMap = function (selectDatas: string | any[]) {
  let dataSourceLoadCondition = {}
  if (selectDatas && selectDatas.length > 0) {
    for (let i = 0; i < selectDatas.length; i++) {
      let selectData = selectDatas[i]
      let dataSource = selectData['dataSource']
      let queryModel = selectData['queryMode']
      let dbLoadCondition = {}
      if ('table' == queryModel) {
        // 普通查询
        dbLoadCondition['where'] = selectData['condition']
        dbLoadCondition['params'] = selectData['valueParamMap']
        dbLoadCondition['orderBys'] = selectData['orderBy']
      } else {
        // 自定义查询
        dbLoadCondition['where'] = selectData['extraCondition']
        dbLoadCondition['params'] = selectData['conditionParams']
      }
      dbLoadCondition['recordStart'] = selectData['recordStart']
      dbLoadCondition['pageSize'] = selectData['pageSize']
      dataSourceLoadCondition[dataSource] = dbLoadCondition
    }
  }
  return dataSourceLoadCondition
}

/**
 * 将重载使用的查询条件，注入到resultDatas中，并返回新构建的resultDatas
 *
 * @param resultDatas 查询结果
 * @param loadConditionMap 各数据源的加载条件
 */
let _genResultDatasWithLoadCondition = function (
  resultDatas: string | any[],
  loadConditionMap: Record<string, any>
) {
  let newResultDatas = []
  if (typeof resultDatas != 'undefined') {
    for (let i = 0; i < resultDatas.length; i++) {
      let resultData = resultDatas[i]
      let dataSourceName = resultData['dataSource']
      let loadCondition = loadConditionMap[dataSourceName]
      resultData['loadCondition'] = loadCondition
      newResultDatas.push(resultData)
    }
  }
  return newResultDatas
}

let getDataSourceFindReqFunc = function (selectData: any | string) {
  let componentCode = scopeManager.getScope().getComponentCode()
  let windowCode = scopeManager.getWindowScope().getWindowCode()
  let operation = new Operation()
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation('Find')
  operation.addParam('selectDatas', [selectData])
  operation.setAfterResponse(function (result: Record<string, any>) {
    if (result.success != true) {
      throw new Error('获取数据出错')
    } else {
      let dsLoadConditionMap = _genDataSourceLoadConditionMap([selectData])
      let resultDatas = _genResultDatasWithLoadCondition(
        result.data.resultDatas,
        dsLoadConditionMap
      )
      return resultDatas
    }
  })
  return operation
}

let getDataSourceFindDatasBySelectData = function (
  selectDatas: string | any[]
) {
  let isArray = arrayUtil.isArray(selectDatas)
  if (!isArray) selectDatas = [selectDatas]
  let operations = []
  for (let i = 0; i < selectDatas.length; i++) {
    let selectData = selectDatas[i]
    operations.push(getDataSourceFindReqFunc(selectData))
  }
  let results = null
  let requestSuccess = function (resp: any) {
    results = resp
  }
  remoteOperation.request({
    request: new Request(false, operations, requestSuccess)
  })
  return isArray ? results : isArray[0]
}

let getDataSourceFindDatas = function (requestCfgs: any) {
  let isArray = arrayUtil.isArray(requestCfgs)
  if (!isArray) requestCfgs = [requestCfgs]
  let selectDatas = []
  // 缺省参数时的默认值
  let nullWhere = WhereRestrict.init()
  let defaultCfg = {
    queryType: null, //请求类型：SQL、TABLE、QUERY之一，必须
    queryDS: null, //查询内容：对于SQL就是selectExpression，对于TABLE就是tableName，对于QUERY就是queryName
    whereRestrict: nullWhere, //where条件，可以为null
    recordStart: -1, //开始记录号，可不提供，默认：-1
    pageSize: -1
    //每页记录数，可不提供，默认：-1
  }
  for (let i = 0; i < requestCfgs.length; i++) {
    let cfg = $.extend(true, {}, defaultCfg, requestCfgs[i])
    let where = cfg.whereRestrict || nullWhere
    switch (cfg.queryType) {
      case 'SQL':
        var queryParams = genCustomSqlQueryParams(where.toParameters())
        var selectData = genCustomQueryParam(
          null,
          'SQL',
          cfg.queryDS,
          queryParams,
          where.toWhere(),
          cfg.recordStart,
          cfg.pageSize
        )
        selectDatas.push(selectData)
        break
      case 'TABLE':
        var selectData = genTableQueryParam(
          null,
          [cfg.queryDS],
          [],
          where.toWhere(),
          where.toOrderBy(),
          cfg.recordStart,
          cfg.pageSize,
          where.toParameters()
        )
        selectDatas.push(selectData)
        break
      case 'QUERY':
        var queryParams = genCustomSqlQueryParams(where.toParameters())
        var selectData = genCustomQueryParam(
          null,
          'NAME',
          cfg.queryDS,
          queryParams,
          where.toWhere(),
          cfg.recordStart,
          cfg.pageSize
        )
        selectDatas.push(selectData)
        break
      default:
        throw new Error('查询类型不正确！' + cfg.queryType)
    }
  }

  let results = getDataSourceFindDatasBySelectData(selectDatas)
  return isArray ? results : results[0]
}

// 加载TableQuery数据
let genTableQuery = function (
  dataSourceSetting: any,
  whereRestrict: any,
  valueField: any,
  textField: any
) {
  let requestCfg = genTableQueryConfig(dataSourceSetting, whereRestrict)
  let results = getDataSourceFindDatas([requestCfg])
  return genTableQueryData(results[0], dataSourceSetting, valueField, textField)
}

let genTableQueryConfig = function (
  dataSourceSetting: Record<string, any>,
  whereRestrict: any
) {
  let config = dataSourceSetting['DataConfig']
  // let SourceID = config['SourceID']
  let SourceName = config['SourceName']
  let SourceType = config['SourceType']
  let SaveColumn = config['SaveColumn']
  let ShowColumn = config['ShowColumn']
  let queryFileds = []
  queryFileds.push(SaveColumn)
  queryFileds.push(ShowColumn)
  if (SourceType == 'Table') {
    let requestCfg = {
      queryType: 'TABLE',
      queryDS: SourceName,
      whereRestrict: whereRestrict,
      recordStart: -1,
      pageSize: -1,
      queryFiledArray: queryFileds
    }
    return requestCfg
  } else if (SourceType == 'Query') {
    let requestCfg = {
      queryType: 'QUERY',
      queryDS: SourceName,
      whereRestrict: whereRestrict,
      recordStart: -1,
      pageSize: -1
    }
    return requestCfg
  }
}

let genCustomSqlQueryParams = function (params: Record<string, any>) {
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

let genQueryParamItem = function (
  queryMode: string | null | undefined,
  params: Record<string, any>,
  recordStart: string | null | undefined,
  pageSize: string | null | undefined
) {
  let queryParam: Record<string, any> = {}
  // 查询模式
  if (queryMode != '' && queryMode != null && queryMode != undefined) {
    queryParam.queryMode = queryMode
  } else {
    queryParam.queryMode = 'table'
  }
  // 主查询参数体
  if (null != params && undefined != params) {
    for (let attr in params) {
      queryParam[attr] = params[attr]
    }
  }
  // recordStart
  if (recordStart != null && recordStart != '' && recordStart != undefined) {
    queryParam.recordStart = recordStart
  }
  // pageSize
  if (pageSize != null && pageSize != '' && pageSize != undefined) {
    queryParam.pageSize = pageSize
  }
  return queryParam
}

let genCustomQueryParam = function (
  dataSource: string | null,
  queryFrom: string,
  expression: any,
  conditionParams: {},
  extraCondition: any,
  recordStart: string | null | undefined,
  pageSize: string | null | undefined
) {
  let params: Record<string, any> = {}
  params.dataSource = dataSource
  params.queryFrom = queryFrom
  params.selectExpression = expression
  params.conditionParams = conditionParams
  params.extraCondition = extraCondition
  return genQueryParamItem('custom', params, recordStart, pageSize)
}

let genTableQueryParam = function (
  dataSource: string | null,
  tableNames: any[],
  fields: any[],
  condition: any,
  orderBy: any,
  recordStart: string | null | undefined,
  pageSize: string | null | undefined,
  valueParamMap: any
) {
  let params: Record<string, any> = {}
  params.dataSource = dataSource
  params.name = tableNames
  params.field = fields
  params.condition = condition
  params.orderBy = orderBy
  params.valueParamMap = valueParamMap
  return genQueryParamItem('table', params, recordStart, pageSize)
}

let doRequestCfg = function (requestCfg: any) {
  // 缺省参数时的默认值
  let nullWhere = WhereRestrict.init()
  let defaultCfg = {
    queryType: null, //请求类型：SQL、TABLE、QUERY之一，必须
    queryDS: null, //查询内容：对于SQL就是selectExpression，对于TABLE就是tableName，对于QUERY就是queryName
    whereRestrict: nullWhere, //where条件，可以为null
    recordStart: -1, //开始记录号，可不提供，默认：-1 queryFiledArray
    pageSize: -1
    //每页记录数，可不提供，默认：-1
  }
  let cfg: Record<string, any> = {}
  sandbox.util.object.extend(cfg, defaultCfg, requestCfg)
  let where = cfg.whereRestrict || nullWhere
  let selectData: Record<string, any>
  switch (cfg.queryType) {
    case 'SQL':
      var queryParams = genCustomSqlQueryParams(where.toParameters())
      selectData = genCustomQueryParam(
        null,
        'SQL',
        cfg.queryDS,
        queryParams,
        where.toWhere(),
        cfg.recordStart,
        cfg.pageSize
      )
      break
    case 'TABLE':
      selectData = genTableQueryParam(
        null,
        [cfg.queryDS],
        cfg.queryFiledArray,
        where.toWhere(),
        where.toOrderBy(),
        cfg.recordStart,
        cfg.pageSize,
        where.toParameters()
      )
      break
    case 'QUERY':
      var queryParams = genCustomSqlQueryParams(where.toParameters())
      selectData = genCustomQueryParam(
        null,
        'NAME',
        cfg.queryDS,
        queryParams,
        where.toWhere(),
        cfg.recordStart,
        cfg.pageSize
      )
      break
    default:
      throw new Error('查询类型不正确！' + cfg.queryType)
  }
  return selectData
}

let doDataSourceLoadConditionMap = function (selectDatas: string | any[]) {
  let dataSourceLoadCondition = {}
  if (selectDatas && selectDatas.length > 0) {
    for (let i = 0; i < selectDatas.length; i++) {
      let selectData = selectDatas[i]
      let dataSource = selectData['dataSource']
      let queryModel = selectData['queryMode']
      let dbLoadCondition = {}
      if ('table' == queryModel) {
        // 普通查询
        dbLoadCondition['where'] = selectData['condition']
        dbLoadCondition['params'] = selectData['valueParamMap']
        dbLoadCondition['orderBys'] = selectData['orderBy']
      } else {
        // 自定义查询
        dbLoadCondition['where'] = selectData['extraCondition']
        dbLoadCondition['params'] = selectData['conditionParams']
      }
      dbLoadCondition['recordStart'] = selectData['recordStart']
      dbLoadCondition['pageSize'] = selectData['pageSize']
      dataSourceLoadCondition[dataSource] = dbLoadCondition
    }
  }
  return dataSourceLoadCondition
}

let doResultDatasWithLoadCondition = function (
  resultDatas: string | any[],
  loadConditionMap: Record<string, any>
) {
  let newResultDatas = []
  if (typeof resultDatas != 'undefined') {
    for (let i = 0; i < resultDatas.length; i++) {
      let resultData = resultDatas[i]
      let dataSourceName = resultData['dataSource']
      let loadCondition = loadConditionMap[dataSourceName]
      resultData['loadCondition'] = loadCondition
      newResultDatas.push(resultData)
    }
  }
  return newResultDatas
}

let genCustomConst = function (
  dataSourceSetting: Record<string, any>,
  valueField: string | number,
  textField: string | number
) {
  let datas = []
  let dataConfig = dataSourceSetting['DataConfig']
  if (dataConfig && dataConfig.ConstData && dataConfig.ConstData.length > 0) {
    for (let i = 0; i < dataConfig.ConstData.length; i++) {
      let data = dataConfig.ConstData[i]
      data[valueField] = data['id'] != null ? data['id'] : ''
      if (data['text'] != null) {
        data[textField] = data['text']
      } else {
        data[textField] = ''
      }
      if (data['selected'] == 'True' || data['default']) {
        data['default'] = true
      } else {
        data['default'] = false
      }
      data['selected'] = false
      // UI不赋默认值，有db赋值
      datas.push(data)
    }
  }
  return datas
}

let genSQLData = function (
  result: string | any[],
  dataSourceSetting: Record<string, any>,
  valueField: string | number,
  textField: string | number
) {
  let datas = []
  let config = dataSourceSetting['DataConfig']
  let defaultSaveColumn = config['DefaultSaveColumn']
  let saveColumn = config['SaveColumn']
  let showColumn = config['ShowColumn']

  if (result && result.length > 0 && typeof result[0] != 'undefined') {
    // 开发平台配置的字段信息，可能与实际的表字段存在大小写区别，所以这里使用实际的表字段做对比，适配大小写问题
    let firstRecord = result[0].datas.values[0]
    for (let field in firstRecord) {
      if (saveColumn.toLowerCase() === field.toLowerCase()) {
        saveColumn = field
      }

      if (showColumn.toLowerCase() === field.toLowerCase()) {
        showColumn = field
      }
    }
    // 循环记录，构建其初始化数据格式
    for (let i = 0; i < result[0].datas.values.length; i++) {
      let resultData = result[0].datas.values[i]
      let data = {}

      data[valueField] = resultData[saveColumn]
      data['id'] = resultData[saveColumn]
      if (resultData[showColumn] != null) {
        data[textField] = resultData[showColumn]
        data['text'] = resultData[showColumn]
      } else {
        data[textField] = ''
        data['text'] = ''
      }

      if (defaultSaveColumn === resultData[saveColumn]) {
        data['default'] = true
        data['selected'] = true
      } else {
        data['default'] = false
        data['selected'] = false
      }

      datas.push(data)
    }
  } else {
    log.warn('下拉控件的来源SQL没有查到任何数据，请进行验证')
    return false
  }

  return datas
}

let genTableQueryData = function (
  result: string | any[],
  dataSourceSetting: Record<string, any>,
  valueField: string | number,
  textField: string | number
  // widgetId
) {
  let datas = []
  let config = dataSourceSetting['DataConfig']
  // let defaultSaveColumn = config['DefaultSaveColumn']
  // let DefaultShowColumn = config['DefaultShowColumn']
  // let MapTable = config['MapTable']

  let saveColumn = config['SaveColumn']
  let showColumn = config['ShowColumn']
  // let SourceName = config['SourceName']
  // let SourceType = config['SourceType']
  if (result && result.length > 0 && typeof result[0] != 'undefined') {
    // 开发平台配置的字段信息，可能与实际的表字段存在大小写区别，所以这里使用实际的表字段做对比，适配大小写问题
    let firstRecord = result[0].datas.values[0]
    for (let field in firstRecord) {
      if (saveColumn.toLowerCase() === field.toLowerCase()) {
        saveColumn = field
      }
      if (showColumn.toLowerCase() === field.toLowerCase()) {
        showColumn = field
      }
    }

    let sqlQueryConstData = config['SqlQueryConstData']
    if (sqlQueryConstData != null) {
      let constData = sqlQueryConstData['ConstData']
      if (constData != null && constData.length != undefined) {
        //自定义常量
        for (let i = 0; i < constData.length; i++) {
          let resultData = constData[i]
          let data = {}

          data[valueField] = resultData['id'] != null ? resultData['id'] : ''
          data['id'] = resultData['id'] != null ? resultData['id'] : ''
          if (resultData['text'] != null) {
            data[textField] = resultData['text']
            data['text'] = resultData['text']
          } else {
            data[textField] = ''
            data['text'] = ''
          }

          if (resultData['selected'] == 'True') {
            data['default'] = true
            data['selected'] = true
          } else {
            data['default'] = false
            data['selected'] = false
          }

          // UI不赋默认值，有db赋值
          datas.push(data)
        }
      }
    }

    // 循环记录，构建其初始化数据格式
    for (let i = 0; i < result[0].datas.values.length; i++) {
      let resultData = result[0].datas.values[i]
      let data = {}

      data[valueField] = resultData[saveColumn]
      if (resultData[showColumn] != null) {
        data[textField] = resultData[showColumn]
      } else {
        data[textField] = ''
      }
      // UI不赋默认值，有db赋值

      datas.push(data)
    }
  } else {
    log.warn('控件的来源表/查询 没有查到任何数据，请进行验证')
    return false
  }

  return datas
}

let genEntityData = function (
  dataSourceSetting: Record<string, any>,
  valueField: string | number,
  textField: string | number
) {
  let data: any[] = []
  if (dataSourceSetting.DataSourceType == 'Entity') {
    let dataConfig = dataSourceSetting.DataConfig
    //获取常量记录
    let entityConstData = dataConfig.EntityConstData
    if (entityConstData && entityConstData.ConstData) {
      let constDatas = entityConstData.ConstData
      for (let i = 0; i < constDatas.length; i++) {
        let temp = {}
        let cData = constDatas[i]
        let idColumn = cData.id
        let textColumn = cData.text
        temp[textField] = textColumn
        temp[valueField] = idColumn
        temp['id'] = idColumn
        temp['text'] = textColumn
        if (cData.selected && cData.selected.toLowerCase() === 'true') {
          temp['default'] = true
          temp['selected'] = true
        } else {
          temp['default'] = false
          temp['selected'] = false
        }
        data.push(temp)
      }
    }
    //获取实体记录
    let entityName = dataConfig.SourceName
    let showColumn = dataConfig.ShowColumn
    let saveColumn = dataConfig.SaveColumn
    let isPickListFields = dataConfig.IsPickListFields + '' //是否未多列
    // let pickListFields = dataConfig.PickListFields

    if (entityName) {
      let entity = datasourceUtil.getDatasource(entityName)
      let result = entity.getAllRecords()
      if (!result.isEmpty()) {
        result.iterate(function (record: Record<string, any>) {
          let temp = {}
          let valueMap = record.toMap()

          if (isPickListFields === 'true')
            //如果为多列下拉框则存储所有信息
            temp = valueMap

          let idColumn = valueMap[saveColumn]
          let textColumn = valueMap[showColumn]
          temp[textField] = textColumn
          temp[valueField] = idColumn
          temp['id'] = idColumn
          temp['text'] = textColumn
          data.push(temp)
        })
      }
    }
  }
  return data
}

let retData: Record<string, any>
let isWhere: Record<string, any>
let _initMap = function (map: Record<string, any>) {
  if (!map) {
    map = new mapUtil.Map()
  }
  return map
}

/**
 * 根据数据来源配置信息获取数据
 */
let getDataByDataSource = function (
  dropDownSource: string | number,
  valueField: string | number,
  textField: string | number
) {
  //获取需要集中请求的配置
  let datas: any = [{}]
  if (!stringUtil.isEmpty(dropDownSource)) {
    let dataSourceSetting = dropDownSource['DataSourceSetting']
    let dataSourceType = dataSourceSetting['DataSourceType']
    retData = _initMap(retData)
    isWhere = _initMap(isWhere)
    if (dataSourceType == 'TableQuery') {
      //查询条件
      let IsWhereRestrict = genwhereRestrict(dataSourceSetting)
      let jIsWhereRestrict = jsonUtil.obj2json(IsWhereRestrict)
      let oldIsWhere = isWhere.get(textField)
      if (jIsWhereRestrict != oldIsWhere) {
        let requestCfg = genTableQueryConfig(dataSourceSetting, IsWhereRestrict)
        let results = getDataSourceFindDatas(requestCfg)
        datas = genTableQueryData(
          results,
          dataSourceSetting,
          valueField,
          textField
        )
        // 缓存查询条件
        isWhere.put(textField, jIsWhereRestrict)
        // 缓存数据
        retData.put(textField, datas)
      } else {
        return retData.get(textField)
      }
    } else if (dataSourceType == 'CustomConst') {
      if (stringUtil.isEmpty(retData.get(textField))) {
        datas = genCustomConst(dataSourceSetting, valueField, textField)
        retData.put(textField, datas)
      } else {
        return retData.get(textField)
      }
    }
  }

  return datas
}

export {
  doDataSourceLoadConditionMap,
  doRequestCfg,
  doResultDatasWithLoadCondition,
  genCustomConst,
  genEntityData,
  genSQLConfig,
  genSQLData,
  genTableQuery,
  genTableQueryConfig,
  genTableQueryData,
  genwhereRestrict,
  getDataByDataSource,
  getDataSourceFindDatas
}
