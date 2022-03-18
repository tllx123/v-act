import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { DatasourceEnums } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { MetadataFactory as metadataFactory } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import {
  ExpressionContext,
  ExpressionEngine as expressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { LocalDB as localDB } from '@v-act/vjs.framework.extension.platform.services.native.mobile.localdb'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import {
  DataQuery as dataQuery,
  DataSave as dataSave
} from '@v-act/vjs.framework.extension.platform.services.repository.remote.base'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'

const queryData = function (params: any) {
  let config = params.config,
    isCover = !params.isAppend
  let daos = config.dataAccessObjects
  let isAsync = config.isAsync
  let callback = config.callback
  let isLocalDb = params.isLocalDb
  let routeContext = params.routeContext
  if (arrayUtil.isArray(daos) && daos.length > 0) {
    let queryParams = []
    for (let i = 0; i < daos.length; i++) {
      let dao = daos[i]
      let modelSchema = dao.getModelSchema()
      let entityName = modelSchema.modelMapping.targetModelName
      //目的在于通知列表出现加载动画，如果是其他控件无影响
      if (isAsync) {
        let entityType = modelSchema.modelMapping.targetModelType
        //获取树形结构
        //var treeStruct = modelSchema.modelMapping.treeStruct;
        let ds = getDbObjByType(entityName, entityType, routeContext)
        ds.markWillToFecth()
      }
      let param = _packageParam(dao)
      queryParams.push(param)
    }
    //将查询数据填充到界面实体
    let loadDataCallback = function (resultData: any) {
      routeContext && snapshotManager.begine(routeContext.snapshotId)
      try {
        _loadDataToEntity(
          resultData,
          daos,
          isAsync,
          isCover,
          true,
          true,
          true,
          params.refreshCondition,
          routeContext
        )
        if (typeof callback == 'function') {
          callback(resultData)
        }
      } finally {
        routeContext && snapshotManager.end()
      }
    }
    //增加查询参数：路由上下文
    let p = {
      queryParams: queryParams,
      isAsync: isAsync,
      isConcurrent: params.isConcurrent,
      success: loadDataCallback,
      routeContext: routeContext,
      isLocalDb: isLocalDb
    }

    if (isLocalDb === true) {
      localDB.query(p)
    } else {
      dataQuery.query(p)
    }
  }
}

/**
 * 从数据结果中获取指定名称的数据对象
 * @param {*} resultData 后台返回的数据结果
 * @param {*} dsName 要获取结果的实体名称
 */
let getDataFromResult = function (resultData: any, dsName: string) {
  if (resultData) {
    for (let i = 0; i < resultData.length; i++) {
      if (resultData[i].dataSource == dsName) {
        return resultData[i]
      }
    }
  }
  return null
}
/**
 * 移除空白列
 * @param {*} resultData 后台返回结果对象
 * @param {*} fields 表格标题数据
 */
let removeEmptyCol = function (resultData: any, fields: any) {
  let dataVals = resultData ? resultData.datas.values : []
  for (let n = 0; n < fields.length; n++) {
    let currentCol = fields[n].code
    // 当前列是否为空列
    let isEmptyCol = true
    for (let k = 0; k < dataVals.length; k++) {
      let currentData = dataVals[k]
      // 任意一列有数据即不为空列
      if (
        (null != currentData[currentCol] && '' !== currentData[currentCol]) ||
        (typeof currentData[currentCol] == 'string' &&
          currentData[currentCol].trim().length > 0)
      ) {
        isEmptyCol = false
      }
    }
    // 如果有空列则删除所有对象对应列的属性
    if (isEmptyCol) {
      for (let m = 0; m < dataVals.length; m++) {
        delete dataVals[m][currentCol]
      }
      // 删除空白列标题
      fields.splice(n, 1)
      n--
    }
  }
}

const queryDataSenior = function (params: any) {
  let config = params.config,
    isCover = !params.isAppend
  let daos = config.dataAccessObjects
  let isAsync = config.isAsync
  let callback = config.callback
  let routeContext = config.routeContext
  //来源类型
  let sourceType = config.sourceType
  //实体信息
  let entityInfo = config.entityInfo

  if (arrayUtil.isArray(daos) && daos.length > 0) {
    let queryParams = []
    for (let i = 0; i < daos.length; i++) {
      let dao = daos[i]
      let modelSchema = dao.getModelSchema()
      let entityName = modelSchema.modelMapping.targetModelName
      //目的在于通知列表出现加载动画，如果是其他控件无影响
      if (isAsync) {
        let entityType = modelSchema.modelMapping.targetModelType
        //获取树形结构
        //var treeStruct = modelSchema.modelMapping.treeStruct;
        let ds = getDbObjByType(entityName, entityType, routeContext)
        ds.markWillToFecth()
      }

      let param: { [code: string]: any } = {}
      param = _packageParamSenior(dao)
      //保存实体信息
      if (param) {
        param.entityInfo = entityInfo
        param.sourceType = sourceType
      }
      queryParams.push(param)
    }
    //将查询数据填充到界面实体
    let loadDataCallback = function (resultData: any) {
      for (let i = 0; i < daos.length; i++) {
        let dao = daos[i]
        // 获取当列值为空是否显示的配置
        let isEmptyToProduceDynamicCol = false
        let tableOrQuery = dao.getCommand().config.tableOrQuery || []
        for (let index = 0; index < tableOrQuery.length; index++) {
          if (tableOrQuery[index].paramsName == 'isEmptyToProduceDynamicCol') {
            isEmptyToProduceDynamicCol = tableOrQuery[index].paramsValue
          }
        }
        let entityName = dao.getModelSchema().modelMapping.targetModelName
        let destEntity = datasourceManager.lookup({
          datasourceName: entityName
        })
        let sourceName = dao.getDataProvider().name
        let arrField = resultData[i].metadata.model[i].fields
        if (isEmptyToProduceDynamicCol) {
          removeEmptyCol(resultData[i], arrField)
        }
        let meta = resultData[i].metadata
        // destEntity.setMetadata(meta.model);
        meta.model[0].datasourceName = entityName
        destEntity.setMetadata(metadataFactory.unSerialize(meta))
        if (arrayUtil.isArray(arrField) && arrField.length > 0) {
          let fieldMappings = []
          for (let k = 0; k < arrField.length; k++) {
            let code = arrField[k].code
            let temp = {
              destName: entityName + '.' + code,
              sourceName: sourceName + '.' + code,
              type: 'entityField'
            }
            fieldMappings.push(temp)
          }
          let modelMapping = {
            sourceModelName: sourceName,
            targetModelName: entityName,
            fieldMappings: fieldMappings
          }
          dao.getModelSchema().modelMapping = modelMapping
        }

        _loadDataToEntity(
          resultData,
          daos,
          isAsync,
          isCover,
          true,
          true,
          true,
          params.refreshCondition,
          routeContext
        )
        if (typeof callback == 'function') {
          callback()
        }
      }
    }
    dataQuery.querySenior({
      queryParams: queryParams,
      isAsync: isAsync,
      success: loadDataCallback,
      routeContext: routeContext
    })
  }
}

const saveData = function (params: any) {
  let configs = params.configs,
    isAsync = params.isAsync,
    success = params.success,
    treeStructs = params.treeStructs,
    routeContext = params.routeContext,
    isLocalDb = params.isLocalDb
  if (configs && configs.length > 0) {
    let commitDataModels = []
    let savedDataSources = []
    for (let i = 0, len = configs.length; i < len; i++) {
      let config = configs[i]
      //是否保存所有，否则只保存改变的数据，为布尔值
      let saveAll = config.saveAll
      let modelMapping = config.modelSchema.modelMapping
      let dataSourceName = modelMapping['sourceModelName']
      let fieldMapArray = modelMapping['fieldMappings']
      let destTableName = modelMapping['targetModelName']
      if (modelMapping.isFieldAutoMapping === true) {
        let _ds = getDataSource(dataSourceName, routeContext)
        let sFields = _ds.getMetadata().getFields()
        fieldMapArray = autoMappingField(
          sFields,
          sFields,
          fieldMapArray,
          dataSourceName,
          destTableName,
          {
            dest: 'colName',
            source: 'colValue',
            type: 'valueType'
          }
        )
      }
      //获取需要提交的数据
      let saveDataModel = getSaveDataInfo(
        dataSourceName,
        saveAll,
        fieldMapArray,
        routeContext,
        isLocalDb
      )
      if (saveDataModel.values.length < 1) continue //没有需要提交的数据，则忽略该数据源
      let commitDataModel = {
        dataSource: destTableName,
        datas: saveDataModel,
        metadata: {
          model: [
            {
              object: destTableName,
              fields: []
            }
          ]
        }
      }
      commitDataModels.push(commitDataModel)
      savedDataSources.push(dataSourceName)
    }
    if (commitDataModels.length > 0) {
      let parameters = {
        dataSchemas: commitDataModels,
        treeStructs: treeStructs,
        transactionId: routeContext.getTransactionId(),
        success: generateSuccessCallback(
          savedDataSources,
          params.success,
          params.error,
          routeContext
        )
      }
      if (isLocalDb) {
        localDB.save(parameters)
      } else {
        dataSave.save(parameters)
      }
    } else {
      if (typeof params.success == 'function') {
        params.success()
      }
    }
  }
}

/**
 * 生成保存成功后回调
 * @return {Function}
 */
let generateSuccessCallback = function (
  datasources: any,
  successCallback: any,
  errorCallback: any,
  routeContext: any
) {
  return function (result) {
    if (result.success == true) {
      if (datasources && datasources.length > 0) {
        for (let i = 0, len = datasources.length; i < len; i++) {
          //对于需要保存的数据集或者自定义查询重置状态
          //						var ds = datasourceManager.lookup({"datasourceName":datasources[i]});
          /*获取数据源*/
          let ds = getDataSource(datasources[i], routeContext)
          ds.reset()
        }
      }
      if (typeof successCallback == 'function') {
        successCallback(result)
      }
    } else if (typeof errorCallback == 'function') {
      errorCallback(result)
    }
  }
}

let getSaveDataInfo = function (
  dsName: string,
  isSaveAll: boolean,
  fieldMapArray: any,
  routeContext: any,
  isLocalDb: boolean
) {
  let commitDatas = []
  let records = isSaveAll
    ? getAllRecords(dsName, routeContext)
    : getInsertOrUpdateRecords(dsName, routeContext)
  let insertOrUpdateCount = records.length
  let dataModel = {
    values: commitDatas,
    recordCount: insertOrUpdateCount
  }
  for (let i = 0; i < insertOrUpdateCount; i++) {
    let record = records[i]
    let data = fieldMapArray
      ? toJsonObjectByMapping(record, fieldMapArray, routeContext, isLocalDb)
      : record.toMap()
    data[DatasourceEnums.STATEFIELD] = 'insertorupdate'
    commitDatas.push(data)
  }
  let deletedResult = getRemovedRecords(dsName, routeContext)
  let iterator = deletedResult.iterator()
  while (iterator.hasNext()) {
    let record = iterator.next()
    let data = {
      id: record.getSysId()
    }
    data[DatasourceEnums.STATEFIELD] = 'delete'
    commitDatas.push(data)
  }
  return dataModel
}

/**
 *获取数据源所有记录
 */
let getAllRecords = function (dsName: string, routeContext: any) {
  //var datasource = datasourceManager.lookup({"datasourceName":dsName});
  /*获取数据源*/
  let datasource = getDataSource(dsName, routeContext)
  return datasource.getAllRecords().toArray()
}

/**
 * 获取所有需要保存的记录(除去删除的)
 * @return {Array<Record>}
 */
let getInsertOrUpdateRecords = function (dsName: string, routeContext: any) {
  //		var datasource = datasourceManager.lookup({"datasourceName":dsName});
  /*获取数据源*/
  let datasource = getDataSource(dsName, routeContext)
  let inserted = datasource.getInsertedRecords().toArray()
  let updated = datasource.getUpdatedRecords().toArray()
  let result = []
  if (inserted && inserted.length > 0) {
    result = result.concat(inserted)
  }
  if (updated && updated.length > 0) {
    result = result.concat(updated)
  }
  return result
}

/**
 * 获取已删除记录
 * @param {String} dsName 数据源名称
 * @return {Array<Record>}
 */
let getRemovedRecords = function (dsName: string, routeContext: any) {
  //		var datasource = datasourceManager.lookup({"datasourceName":dsName});
  /*获取数据源*/
  let datasource = getDataSource(dsName, routeContext)
  return datasource.getDeletedRecords()
}

/**
 * 根据字段映射信息，将record记录转换成json对象
 */
let toJsonObjectByMapping = function (
  record: any,
  fieldMapArray: any,
  routeContext: any,
  isLocalDb: boolean
) {
  let result: { [code: string]: any } = {}
  for (let i = 0, len = fieldMapArray.length; i < len; i++) {
    let fieldMap = fieldMapArray[i]
    let cellVal = getDestFieldMappingValue(record, fieldMap, routeContext)
    if (cellVal != null) {
      if (isLocalDb) {
        //本地数据库功能要求这里不能将boolean型的数据转成字符串。
        if (typeof cellVal != 'number' && typeof cellVal != 'boolean') {
          cellVal = '' + cellVal
        }
      } else {
        if (typeof cellVal != 'number') {
          cellVal = '' + cellVal
        }
      }
    }
    let destName = fieldMap['colName']
    result[getFieldCode(destName)] = cellVal
  }
  if (!result.hasOwnProperty('id')) {
    //如果不存在主键值，则补全
    result.id = record.getSysId()
  }
  return result
}

let getDestFieldMappingValue = function (
  record: any,
  fieldMapping: any,
  routeContext: any
) {
  let colValue = fieldMapping['colValue']
  let valueType = fieldMapping['valueType']
  let valueCol = ''
  switch (valueType) {
    case 'entityField': //界面实体
      valueCol = record.get(getFieldCode(colValue))
      break
    case 'expression': //表达式
      var context = new ExpressionContext()
      context.setRouteContext(routeContext)
      context.setRecords([record])
      valueCol = expressionEngine.execute({
        expression: colValue,
        context: context
      })
      break
    default:
      break
  }
  return valueCol
}

/**
 *获取字段编号
 */
let getFieldCode = function (fieldStr: string) {
  return fieldStr.substring(fieldStr.indexOf('.') + 1, fieldStr.length)
}

/**
 * 调用远程数据仓库查询数据服务
 * @param DAO对象
 * @param isAsync 是否异步
 */
let _packageParam = function (dao: any) {
  let dataProvider = dao.getDataProvider()
  let command_config = dao.getCommand().config
  let dataSourceName = dataProvider.name
  let queryType = dataProvider.type
  let whereRestrict = command_config.where
  let recordStart = command_config.recordStart
  let pageSize = command_config.pageSize
  let filterFields = command_config.filterFields //扩展预留,暂时无用

  let queryParam = {
    dataSourceName: dataSourceName,
    queryType: queryType,
    whereRestrict: whereRestrict,
    queryRecordStart: recordStart,
    queryPageSize: pageSize,
    queryFields: filterFields
  }
  return queryParam
}
/**
 * 调用远程数据仓库查询数据服务
 * @param DAO对象
 * @param isAsync 是否异步
 */
let _packageParamSenior = function (dao: any) {
  let dataProvider = dao.getDataProvider()
  let command_config = dao.getCommand().config
  let dataSourceName = dataProvider.name
  let queryType = dataProvider.type
  let whereRestrict = command_config.where
  let recordStart = command_config.recordStart
  let pageSize = command_config.pageSize
  let filterFields = command_config.filterFields //扩展预留,暂时无用
  let tableOrQuery = command_config.tableOrQuery //扩展预留,暂时无用

  let queryParam = {
    dataSourceName: dataSourceName,
    queryType: queryType,
    whereRestrict: whereRestrict,
    queryRecordStart: recordStart,
    queryPageSize: pageSize,
    queryFields: filterFields,
    tableOrQuery: tableOrQuery
  }
  return queryParam
}
/**
 * 自动映射字段
 * @param	{Object}	sourceFields	表的字段信息（注：保存的话，需要在后台重新校验字段是否存在）
 * @param	{Object}	targetFields	表的字段信息
 * @param	{Object}	mappings		前台映射信息
 * @param	{String}	entityCode		实体编码
 * @param	{String}	tableCode		来源表编码
 * @param	{String}	mps				映射信息的映射关系
 * */
let autoMappingField = function (
  sourceFields: any,
  targetFields: any,
  mappings: any,
  entityCode: string,
  tableCode: string,
  mps: any
) {
  if (entityCode.indexOf('.') != -1) {
    entityCode = entityCode.split('.')[1]
  }
  //实体的字段列表
  let targetFieldId = []
  for (let i = 0, len = targetFields.length; i < len; i++) {
    targetFieldId.push(targetFields[i].getCode())
  }
  let existMapping = []
  //已经配置的字段列表
  let nowMappings = []
  if (null != mappings) {
    for (let i = 0, len = mappings.length; i < len; i++) {
      let m = mappings[i][mps.dest]
      if (m.indexOf('.') != -1) {
        m = m.split('.')[1]
      }
      nowMappings.push(m)
    }
  } else {
    mappings = []
  }
  if (sourceFields.length > 0) {
    for (let i = 0, len = sourceFields.length; i < len; i++) {
      let field = sourceFields[i]
      let code = field.code
      if (
        targetFieldId.indexOf(code) != -1 &&
        nowMappings.indexOf(code) == -1
      ) {
        //实体包含字段并且没有配置
        let info = {}
        info[mps.dest] = entityCode + '.' + code
        info[mps.source] = tableCode + '.' + code
        info[mps.type] = 'entityField'
        mappings.push(info)
      }
    }
  }
  return mappings
}
/**
 * 加载数据到前台DB
 * @param resultData 查询结果数据
 * @param resultDAO 查询数据时的数据访问对象
 * @param isAsync 是否异步
 * @param isCover 是否覆盖加载（默认为是）
 * @param isCallObserver 是否通知ui进行更新（默认为是）
 * @param isLoadData 是否加载数据（默认为是）
 * @param isFireLoadEvent 是否触发加载事件（默认为是）
 */
let _loadDataToEntity = function (
  resultData: any,
  resultDAO: any,
  isAsync: boolean,
  isCover: boolean,
  isCallObserver: boolean,
  isLoadData: boolean,
  isFireLoadEvent: boolean,
  isRefreshCondition: boolean,
  routeContext: any
) {
  isCover = null == isCover || undefined == isCover ? true : isCover
  isRefreshCondition =
    null == isRefreshCondition || undefined == isRefreshCondition
      ? true
      : isRefreshCondition
  if (arrayUtil.isArray(resultData) && resultData.length > 0) {
    let resultDatas = []
    for (let i = 0; i < resultData.length; i++) {
      let rd = resultData[i]
      let datas = rd.datas
      let values = datas.values
      let daoObj = resultDAO[i]
      let _modelMapping = daoObj.getModelSchema().modelMapping
      let fieldMappings = _modelMapping.fieldMappings
      let entityName = _modelMapping.targetModelName
      //目标实体类型
      let entityType = _modelMapping.targetModelType
      //获取树形结构
      //var treeStruct = daoObj.getModelSchema().modelMapping.treeStruct;
      // 获取实体db对象
      let dbObj = getDbObjByType(entityName, entityType, routeContext)
      if (_modelMapping.isFieldAutoMapping) {
        let tableName = _modelMapping.sourceModelName
        let soruceFields = rd.metadata['model'][0].fields
        let targetFields = dbObj.getMetadata().getFields()
        fieldMappings = autoMappingField(
          soruceFields,
          targetFields,
          fieldMappings,
          entityName,
          tableName,
          {
            dest: 'destName',
            source: 'sourceName',
            type: 'type'
          }
        )
      }
      let resultSet = _getResultDatas(entityName, values, fieldMappings)
      //当数据操作类型为查询时,为前台DB添加数据源信息
      let commandType = daoObj.getCommand().type
      if (commandType == 'query' && isRefreshCondition) {
        dbObj.setDataAccessor({
          accessor: daoObj
        })
      }

      //将后查询数据填充到界面实体
      let datasource = dbObj
      if (!isCover) {
        //如果非覆盖式加载，则剔除加载数据中数据源已有数据,如树节点展开时，会将父节点数据一起加载下来
        let rs = []
        for (let i = 0, len = resultSet.length; i < len; i++) {
          let data = resultSet[i]
          let rd = datasource.getRecordById(data['id'])
          if (!rd) {
            rs.push(data)
          }
        }
        resultSet = rs
      }
      datasource.load({
        isAppend: !isCover,
        datas: resultSet,
        dataAmount: datas.recordCount
      })
    }
  }
}

/**
 * 根据实体
 * @param entityName 实体名
 * @param entityType 实体类型 （窗体实体（window）、方法输入实体（ruleSetInput）、方法输出实体（ruleSetOutput）、
 *								方法变量实体（ruleSetVar）、窗体输入实体（windowInput）、窗体输出实体（windowOutput））
 * @param routeContext 上下文
 * @return 目标实体DB对象
 */
let getDbObjByType = function (
  entityName: string,
  entityType: any,
  routeContext: any
) {
  if (!entityName) return null

  // 兼容处理旧版本开发系统数据，默认不传为窗体实体类型
  if (!entityType) entityType = 'window'

  let dbObj = null

  switch (entityType) {
    case 'window':
      //				if(treeStruct){
      //					dbObj = treeManager.lookup({"datasourceName": entityName,"treeStruct" : treeStruct});
      //				}else{
      //					dbObj = datasourceManager.lookup({"datasourceName": entityName});
      //				}
      dbObj = datasourceManager.lookup({
        datasourceName: entityName
      })
      break
    case 'ruleSetInput':
      dbObj = routeContext.getInputParam(entityName)
      break
    case 'ruleSetOutput':
      dbObj = routeContext.getOutPutParam(entityName)
      break
    case 'ruleSetVar':
      dbObj = routeContext.getVariable(entityName)
      break
    case 'windowInput':
      dbObj = windowParam.getInput({
        code: entityName
      })
      break
    case 'windowOutput':
      dbObj = windowParam.getOutput({
        code: entityName
      })
      break
    default:
  }

  if (!dbObj)
    throw Error('[DataAdapter]查找实体有误：不存在实体：' + entityName + '！')

  return dbObj
}

/**
 * 按照字段映射关系，生成目标数据源的记录信息
 * @param destDS 数据源
 * @param values 查询结果数据
 * @param mappings 数据源结果之间映射(需要收集的字段映射中，只有type为1的字段。其他认为是来源信息并非字段类型，sourceField中直接为最终值)
 * @return 将来源数据映射到目标数据源后的Record对象列表
 */
let _getResultDatas = function (
  destEntityName: string,
  values: any,
  mappings: any
) {
  // 只有类型为1的mappings，才会收集
  if (!values || values.length <= 0) {
    return []
  }

  let destRecords = []
  for (let index = 0; index < values.length; index++) {
    let sourceRecord = values[index]
    let destRecord = {}
    // 循环字段映射配置,将来源字段的值赋值给目标
    for (let fieldIndex = 0; fieldIndex < mappings.length; fieldIndex++) {
      let mapping = mappings[fieldIndex]
      // 来源和目标可以使用下面两种其中之一的格式
      let destField = mapping['destName'] || mapping['destField']
      //var sourceField = mapping["sourceName"] || mapping["sourceField"];
      //解决原有取值为0时 0||undefined 返回undefined问题
      let sourceField = mapping['sourceName']
      if (
        null == sourceField &&
        undefined == sourceField &&
        null != mapping['sourceField'] &&
        undefined != mapping['sourceField']
      ) {
        sourceField = mapping['sourceField']
      }

      let type = mapping['type']

      // 如果type并非COLLECT_MAPPING_TYPE定义的类型，标识sourceField变量直接就是值，不参于来源数据取值
      if (type != 'field' && type != 'entityField') {
        destRecord[_prcocessFieldStr(destField)] = sourceField
        continue
      }
      sourceField = _prcocessFieldStr(sourceField)
      //增加对id大小写的处理
      if (sourceField.toLowerCase() == 'id') {
        for (let k in sourceRecord) {
          if (k.toLowerCase() == 'id') {
            sourceField = k
            break
          }
        }
      }
      let sourceValue = null
      if (typeof sourceRecord[sourceField] != 'undefined') {
        sourceValue = sourceRecord[sourceField]
      }

      // 来源值赋值给目标字段
      destRecord[_prcocessFieldStr(destField)] = sourceValue
    }

    destRecords.push(destRecord)
  }

  // 返回Recrod对象数组
  return destRecords
}

let _prcocessFieldStr = function (fieldStr: string) {
  let index = fieldStr.lastIndexOf('.')
  return index != -1 ? fieldStr.substring(index + 1) : fieldStr
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
function getDataSource(dataSourceName: string, routeContext: any) {
  let dsName = dataSourceName
  let datasource = null
  if (dsName != null && dsName != '') {
    /*本身是实体对象*/
    if (DBFactory.isDatasource(dsName)) {
      datasource = dsName
    } else {
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      /*前台实体*/
      if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
        datasource = datasourceManager.lookup({
          datasourceName: dsName
        })
      } else {
        /*方法实体*/
        datasource = expressionEngine.execute({
          expression: dsName,
          context: context
        })
      }
    }
  }
  return datasource
}
export { queryData, queryDataSenior, saveData }
