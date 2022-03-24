/**
 * 请求管理模块
 * @desc 提供后台请求相关接口，使用前请先import：vds.import("vds.rpc.*")
 * @namespace vds/rpc
 * @module rpc
 * @catalog 工具方法/请求管理
 * @example
 * vds.import("vds.rpc.*");
 * var date = vds.rpc.getDate();
 */

import { RPC as rpcEnum } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import * as sysConstant from '@v-act/vjs.framework.extension.platform.services.constant'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import {
  ExpressionContext as EngineContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import { RemoteMethodAccessor as serverRuleSetAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'
import { DataAccessObject } from '@v-act/vjs.framework.extension.platform.services.repository.access'
import { DataQuery as dataQuery } from '@v-act/vjs.framework.extension.platform.services.repository.remote.base'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import * as dataAdapter from '@v-act/vjs.framework.extension.platform.services.viewmodel.dataadapter'
import { WhereRestrict } from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { RPC } from '@v-act/vjs.framework.extension.system.rpc'
import { DataValidateUtil as dataValidateUtil } from '@v-act/vjs.framework.extension.util.datavalidate'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'
import { plupload } from '@v-act/vjs.framework.extension.vendor.plupload'

import RuleContext from '../../vjs.framework.extension.platform.services.integration.vds.rule/src/RuleContext'

;('vjs.framework.extension.util.DataValidateUtil')

/**
 * 超时类型
 * @enum {String}
 * */
const Timeout = {
  /**
   * 短暂的
   * */
  Short: 'SHORT',
  /**
   * 正常的
   * */
  Normal: 'NORMAL',
  /**
   * 长时间的
   * */
  Long: 'LONG',
  /**
   * 无限
   * */
  Infinite: 'INFINITE'
}

/**
 * 查询类型
 * @enum {String}
 * */
const QueryType = {
  /**
   * 表
   * */
  Table: 'Table', //表
  /**
   * 查询
   * */
  Query: 'Query'
}

export { QueryType, Timeout }

/**
 * 获取当前域信息,此方法是为了补充请求后台的时需要的构件/窗体信息，如果当前域是窗体域，则有构件编码和窗体编码，如果当前域是构件域，则只有构件编码
 * @returns {Object}
 * {
 *  "componentCode":"构件编码",
 *  "windowCode":"窗体编码",
 * }
 * */
var _getWindowInfo = function () {
  var _componentCode = null
  var _windowCode = null
  var scope = scopeManager.getScope()
  if (scope) {
    _componentCode = scope.getComponentCode()
    if (scopeManager.isWindowScope(scope.getInstanceId())) {
      _windowCode = scope.getWindowCode()
    }
  }
  return {
    componentCode: _componentCode,
    windowCode: _windowCode
  }
}

export function get(url: string) {
  return new Promise(function (resolve, reject) {
    RPC.crossDomainRequest({
      host: url,
      type: 'GET',
      afterResponse: resolve,
      error: reject
    })
  })
}
/**
 * 获取当前日期（同步）
 * @return {Date} 返回日期对象
 * */
export function getDate() {
  var value = sysConstant.get({
    type: sysConstant.TYPES.CurrentTime,
    params: ['yyyy-MM-dd HH:mm:ss']
  })
  var date = vds.date.valueOf(value)
  return date
}

/**
 * 保存数据
 * @param {Array} configs 保存配置
 * [{
 *  "entity":{Datasource} 数据源实例
 *  "tableCode":{String} 目标表编码
 *  "fileMappings":{Array} 字段映射
 *   [{
 *    "code":{String} 目标字段编码
 *    "value":{String} 来源值，type=field时，value是来源字段编码，type=expression时，value是表达式
 *    "type":{String} 来源类型，枚举：field/expression
 *   }]
 *  "treeStruct":{#link TreeStruct} 树结构，非树型实体可忽略（可选）
 *   "autoFieldMapping":{Boolean} 自动映射字段，默认false（可选）
 *   "saveAll" : {Boolean} 是否保存所有数据，true:保存全部数据，false:保存新增、修改、删除的数据（可选）
 * }]
 * @param {RuleContext} ruleContext 规则上下文
 * @param {Object} params 其他参数（可选）
 * {
 *  "isAsync" : {Boolean} 是否异步，默认false（可选）
 *  "isLocalDb" : {Boolean} 是否本地数据库，默认false（可选）
 * }
 * @return {Promise}
 * @example
 * vds.import("vds.rpc.*");
 * var dsObj = vds.ds.lookup("ds1");
 * vds.rpc.saveData([
 *  "entity": dsObj,
 *  "tableCode":"tableCode",
 *  "fileMappings":[{
 *    "code":"id",
 *    "value":"id",
 *    "type":"field"
 *  },{
 *    "code":"price",
 *    "value":"818",
 *    "type":"expression"
 *  }]
 * ]);
 */
export function saveData(
  configs: string | any[],
  ruleContext: RuleContext,
  params: { isAsync: any; isLocalDb?: any; ruleContext?: RuleContext }
) {
  return new Promise<void>(function (resolve, reject) {
    try {
      if (!configs) {
        resolve()
      }
      var isAsync = false
      var isLocalDb = false
      if (params) {
        isAsync = params.isAsync === true
        isLocalDb = params.isLocalDb === true
      }
      var newConfigs = []
      var treeStructs = []
      for (var i = 0, len = configs.length; i < len; i++) {
        var config = configs[i]
        var treeStruct = config.treeStruct
        var entity = config.entity
        if (!entity) {
          continue
        }
        entity = entity._get()
        // var entityCode = entity.getMetadata().getDatasourceName()
        var tableCode = config.tableCode
        var fieldMappings = config.fieldMappings
        var autoFieldMapping = config.autoFieldMapping
        var saveAll = config.saveAll
        if (treeStruct) {
          if (typeof treeStruct._get == 'function') {
            treeStruct = treeStruct._get()
            treeStructs.push(treeStruct)
          } else {
            treeStructs.push({
              type: '1',
              tableName: tableCode,
              pidField: treeStruct.pId,
              orderField: treeStruct.orderNo,
              isLeafField: treeStruct.isLeaf,
              treeCodeField: treeStruct.innerCode
            })
          }
        }
        var newFileMappings = []
        for (var j = 0; j < fieldMappings.length; j++) {
          var fieldMapping = fieldMappings[j]
          newFileMappings.push({
            colName: fieldMapping.code,
            colValue: fieldMapping.value,
            valueType:
              fieldMapping.type == 'field' ? 'entityField' : 'expression'
          })
        }
        var newConfig = {
          modelSchema: {
            modelMapping: {
              isFieldAutoMapping: autoFieldMapping === true,
              sourceModelName: entity,
              targetModelName: tableCode,
              fieldMappings: newFileMappings
            }
          },
          saveAll: saveAll
        }
        newConfigs.push(newConfig)
      }
      var saveParams = {
        configs: newConfigs,
        routeContext: ruleContext.getMethodContext()._getRouteContext(),
        treeStructs: treeStructs,
        isAsync: isAsync,
        isLocalDb: isLocalDb,
        success: resolve,
        error: reject
      }
      dataAdapter.saveData(saveParams)
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 查询数据(同步接口)
 * @deprecated
 * @param {String} sourceCode 来源编码
 * @param {String} sourceType 来源类型：Table（表）、Query（查询）
 * @param {@link Datasource} target 目标数据源实例
 * @param {Array} fieldMappings 字段映射
 *   [{
 *    "code":{String} 目标字段编码
 *    "value":{String} 来源值
 *    "type":{String} 来源类型，枚举：field（实体字段）/expression（表达式）
 *   }]
 * @param {Object} params 其他参数（可选）
 * {
 *  "where": {@link Where} 条件对象
 *  "treeStruct":{@link TreeStruct} 树结构（可选）
 *  "depth": {Number} 加载深度，当数据源为树数据源时有效，默认-1
 *  "autoFieldMapping":{Boolean} 自动映射字段，默认false（可选）
 *  "pageConfig": {Object} 分页配置（可选）
 *   {
 *    "pageSize":{Integer} 每页显示的记录数
 *    "recordStart": {Integer} 页码
 *   }
 *  "commandCode": {String}  指定查询入口（可选）
 *  "methodContext": {@link MethodContext} 方法上下文（可选）
 *  "isAppend":{Boolean} 是否以添加方式加载数据， 默认true（可选）
 *  "isLocalDb" : {Boolean} 是否本地数据库，默认false（可选）
 *  "isRefreshCondition" : {Boolean} 是否更新加载的条件，查询对象为查询时有效，默认true（可选）
 *  "isCheckUnique":{Boolean} 是否唯一性检查，默认false，已过时，不建议使用
 *  "senior":{Object} 高级参数
 *   {
 *  	"command" {String}  指定查询入口,
 *  	"groupCrossConfig" {Object}  分组交叉配置
 *  	"type" {String} 指定类型
 *   },
 *   "success" {Function} 成功回调
 *   "fail" {Function} 失败回调
 * }
 */
export function queryDataSync(
  sourceCode: string | string[],
  sourceType: string,
  target: any,
  fieldMappings: string | any[] | null,
  params: {
    where?: any
    pageConfig?:
      | { pageSize: number; recordStart: number }
      | { pageSize: number; recordStart: number }
      | { pageSize: number; recordStart: number }
    methodContext?: any
    CheckUnique?: boolean
    success?:
      | ((resultData: Record<string, any>[]) => void)
      | ((result: any[]) => void)
      | ((result: any[]) => void)
    fail?: any
  }
) {
  try {
    var extraParams: any = params || {}
    var successFunc: any = extraParams.success || function () {}
    var failFunc: any = extraParams.fail || function () {}
    if (!sourceCode || !sourceType) {
      successFunc()
      return
    }
    var pageConfig = extraParams.pageConfig
    //每页记录数
    var pageSize = -1
    //开始条数
    var recordStart = -1
    if (pageConfig) {
      if (pageConfig.hasOwnProperty('pageSize')) {
        pageSize = pageConfig['pageSize']
      }
      if (pageConfig.hasOwnProperty('recordStart')) {
        recordStart = pageConfig['recordStart']
      }
    }
    var where = extraParams.where
    var nullFilterWhere = null
    if (!where) {
      where = WhereRestrict.init()
      nullFilterWhere = WhereRestrict.init()
    } else if (where._get) {
      nullFilterWhere = where._getNullFilterWhere()
      where = where._get()
    }
    if (null === fieldMappings) {
      var newParams = {
        CheckUnique: extraParams.isCheckUnique === true,
        dataSourceName: sourceCode,
        queryType: sourceType == 'Query' ? 'query' : 'table',
        whereRestrict: where,
        queryRecordStart: recordStart,
        queryPageSize: pageSize
      }
      dataQuery.query({
        queryParams: [newParams],
        isAsync: false,
        success: successFunc
      })
      return
    }
    var tableOrQuery = null
    var entityInfo = null
    var senior = extraParams.senior || extraParams.Senior
    if (
      senior &&
      senior.command == 'CommonRule_DynamicCrossDataToInterfaceEntity'
    ) {
      tableOrQuery = senior.groupCrossConfig
      if (sourceType != 'Query') {
        var _entity
        if (sourceCode.indexOf('.') == -1 && sourceCode.indexOf('@') == -1) {
          _entity = vds.ds.lookup(sourceCode)
        } else {
          var ctx = new EngineContext()
          _entity = engine.execute({
            expression: sourceCode,
            context: ctx
          })
        }
        if (_entity) {
          entityInfo = vds.string.toJson(_entity.serialize(), false)
        }
      }
    }
    if (vds.ds.isDatasource(target)) {
      target = target._get()
    }
    var treeStruct = extraParams.treeStruct
      ? extraParams.treeStruct.toMap
        ? extraParams.treeStruct.toMap()
        : extraParams.treeStruct
      : null
    var autoFieldMapping = extraParams.autoFieldMapping
    var dataprovider = {
      name: sourceCode,
      type: sourceType
    }
    var newFieldMappings = []
    if (fieldMappings) {
      for (var j = 0, _l = fieldMappings.length; j < _l; j++) {
        var fieldMapping = fieldMappings[j]
        newFieldMappings.push({
          destName: fieldMapping['code'],
          type: fieldMapping['type'] == 'field' ? 'entityField' : 'expression',
          sourceName: fieldMapping['value']
        })
      }
    }
    var modelSchema = {
      modelMapping: {
        sourceModelName: sourceCode,
        targetModelName: null,
        target: target, //目标数据源
        treeStruct: treeStruct,
        targetModelType: null,
        fieldMappings: newFieldMappings,
        isFieldAutoMapping: autoFieldMapping === true //是否自动映射字段
      }
    }
    var command: any = {
      config: {
        where: where,
        pageSize: pageSize,
        recordStart: recordStart,
        filterFields: null,
        tableOrQuery: tableOrQuery
      },
      type: 'query'
    }
    var dao = new DataAccessObject(dataprovider, modelSchema, command)
    var methodContext = extraParams.methodContext
    if (methodContext && typeof methodContext._getRouteContext == 'function') {
      methodContext = methodContext._getRouteContext()
    }
    var newConfig: Record<string, any> = {
      isAppend: extraParams.isAppend === false ? false : true,
      isConcurrent: false,
      isLocalDb: extraParams.isLocalDb === true,
      refreshCondition: extraParams.isRefreshCondition !== false,
      routeContext: methodContext
    }
    newConfig['config'] = {
      dataAccessObjects: [dao],
      isAsync: extraParams.isAsync === true,
      callback: (function (
        cb,
        _config,
        _where,
        _tableOrQuery,
        _nullWhere,
        _depth
      ) {
        return function () {
          if (
            !_tableOrQuery &&
            _config.config.dataAccessObjects &&
            _config.config.dataAccessObjects[0] &&
            _config.config.dataAccessObjects[0].command &&
            _config.config.dataAccessObjects[0].command.config
          ) {
            _config.config.dataAccessObjects[0].command.config.depth = _depth
            _config.config.dataAccessObjects[0].command.config.whereToWhere =
              _where.toWhere()
            _config.config.dataAccessObjects[0].command.config.whereRestrictNoDepthFilter =
              _nullWhere
          }
          cb()
        }
      })(
        successFunc,
        newConfig,
        where,
        tableOrQuery,
        nullFilterWhere,
        extraParams.depth
      )
    }
    if (tableOrQuery) {
      newConfig.config.sourceType = senior && senior.type
      newConfig.config.entityInfo = entityInfo
      dataAdapter.queryDataSenior(newConfig)
    } else {
      dataAdapter.queryData(newConfig)
    }
  } catch (err) {
    failFunc(err)
  }
}
/**
 * 查询数据
 *
 * @param {String} sourceCode 来源编码
 * @param {String} sourceType 来源类型：Table（表）、Query（查询）
 * @param {@link Datasource} target 目标数据源实例
 * @param {Array} fieldMappings 字段映射
 *   [{
 *    "code":{String} 目标字段编码
 *    "value":{String} 来源值
 *    "type":{String} 来源类型，枚举：field（实体字段）/expression（表达式）
 *   }]
 * @param {Object} params 其他参数（可选）
 * {
 *  "where": {@link Where} 条件对象
 *  "treeStruct":{@link TreeStruct} 树结构（可选）
 *  "depth": {Number} 加载深度，当数据源为树数据源时有效，默认-1
 *  "autoFieldMapping":{Boolean} 自动映射字段，默认false（可选）
 *  "pageConfig": {Object} 分页配置（可选）
 *   {
 *    "pageSize":{Integer} 每页显示的记录数
 *    "recordStart": {Integer} 页码
 *   }
 *  "commandCode": {String}  指定查询入口（可选）
 *  "methodContext": {@link MethodContext} 方法上下文（可选）
 *  "isAppend":{Boolean} 是否以添加方式加载数据， 默认true（可选）
 *  "isLocalDb" : {Boolean} 是否本地数据库，默认false（可选）
 *  "isRefreshCondition" : {Boolean} 是否更新加载的条件，查询对象为查询时有效，默认true（可选）
 *  "isCheckUnique":{Boolean} 是否唯一性检查，默认false，已过时，不建议使用
 *  "senior":{Object} 高级参数
 *   {
 *  	"command" {String}  指定查询入口,
 *  	"groupCrossConfig" {Object}  分组交叉配置
 *  	"type" {String} 指定类型
 *   }
 * }
 * @returns {Promise}
 */
export function queryData(
  sourceCode: string | string[],
  sourceType: string,
  target: Record<string, any>,
  fieldMappings: string | any[] | null,
  params: {
    where?: any
    pageConfig?:
      | { pageSize: number; recordStart: number }
      | { pageSize: any; recordStart: any }
    autoFieldMapping?: boolean
    treeStruct?: any
    methodContext?: any
    isAsync?: boolean
    depth?: string
    isAppend?: boolean
    Senior?: { command: string; groupCrossConfig: any[]; type: number }
  }
) {
  return new Promise<void>(function (resolve, reject) {
    try {
      if (!sourceCode || !sourceType) {
        resolve()
        return
      }
      var extraParams: Record<string, any> = params || {}
      var pageConfig = extraParams.pageConfig
      //每页记录数
      var pageSize = -1
      //开始条数
      var recordStart = -1
      if (pageConfig) {
        if (pageConfig.hasOwnProperty('pageSize')) {
          pageSize = pageConfig['pageSize']
        }
        if (pageConfig.hasOwnProperty('recordStart')) {
          recordStart = pageConfig['recordStart']
        }
      }
      var where = extraParams.where
      var nullFilterWhere = null
      if (!where) {
        where = WhereRestrict.init()
        nullFilterWhere = WhereRestrict.init()
      } else if (where._get) {
        nullFilterWhere = where._getNullFilterWhere()
        where = where._get()
      }
      if (null === fieldMappings) {
        var newParams = {
          CheckUnique: extraParams.isCheckUnique === true,
          dataSourceName: sourceCode,
          queryType: sourceType == 'Query' ? 'query' : 'table',
          whereRestrict: where,
          queryRecordStart: recordStart,
          queryPageSize: pageSize
        }
        dataQuery.query({
          queryParams: [newParams],
          isAsync: false,
          success: resolve
        })
        return
      }
      var tableOrQuery = null
      var entityInfo = null
      var senior = extraParams.senior || extraParams.Senior
      if (
        senior &&
        senior.command == 'CommonRule_DynamicCrossDataToInterfaceEntity'
      ) {
        tableOrQuery = senior.groupCrossConfig
        if (sourceType != 'Query') {
          var _entity
          if (sourceCode.indexOf('.') == -1 && sourceCode.indexOf('@') == -1) {
            _entity = vds.ds.lookup(sourceCode)
          } else {
            var ctx = new EngineContext()
            _entity = engine.execute({
              expression: sourceCode,
              context: ctx
            })
          }
          if (_entity) {
            entityInfo = vds.string.toJson(_entity.serialize(), false)
          }
        }
      }
      if (vds.ds.isDatasource(target)) {
        target = target._get()
      }
      var treeStruct = extraParams.treeStruct
        ? extraParams.treeStruct.toMap
          ? extraParams.treeStruct.toMap()
          : extraParams.treeStruct
        : null
      var autoFieldMapping = extraParams.autoFieldMapping
      var dataprovider = {
        name: sourceCode,
        type: sourceType
      }
      var newFieldMappings = []
      if (fieldMappings) {
        for (var j = 0, _l = fieldMappings.length; j < _l; j++) {
          var fieldMapping = fieldMappings[j]
          newFieldMappings.push({
            destName: fieldMapping['code'],
            type:
              fieldMapping['type'] == 'field' ? 'entityField' : 'expression',
            sourceName: fieldMapping['value']
          })
        }
      }
      var modelSchema = {
        modelMapping: {
          sourceModelName: sourceCode,
          targetModelName: null,
          target: target, //目标数据源
          treeStruct: treeStruct,
          targetModelType: null,
          fieldMappings: newFieldMappings,
          isFieldAutoMapping: autoFieldMapping === true //是否自动映射字段
        }
      }
      var command: any = {
        config: {
          where: where,
          pageSize: pageSize,
          recordStart: recordStart,
          filterFields: null,
          tableOrQuery: tableOrQuery
        },
        type: 'query'
      }
      var dao = new DataAccessObject(dataprovider, modelSchema, command)
      var methodContext = extraParams.methodContext
      if (
        methodContext &&
        typeof methodContext._getRouteContext == 'function'
      ) {
        methodContext = methodContext._getRouteContext()
      }

      var newConfig: Record<string, any> = {
        isAppend: extraParams.isAppend === false ? false : true,
        isConcurrent: false,
        isLocalDb: extraParams.isLocalDb === true,
        refreshCondition: extraParams.isRefreshCondition !== false,
        routeContext: methodContext
      }
      newConfig['config'] = {
        dataAccessObjects: [dao],
        isAsync: extraParams.isAsync === true,
        callback: (function (
          cb,
          _config,
          _where,
          _tableOrQuery,
          _nullWhere,
          _depth
        ) {
          return function () {
            /* Task20210906040 */
            if (
              !_tableOrQuery &&
              _config.config &&
              _config.config.dataAccessObjects &&
              _config.config.dataAccessObjects[0] &&
              _config.config.dataAccessObjects[0].command &&
              _config.config.dataAccessObjects[0].command.config
            ) {
              _config.config.dataAccessObjects[0].command.config.depth = _depth
              _config.config.dataAccessObjects[0].command.config.whereToWhere =
                _where.toWhere()
              _config.config.dataAccessObjects[0].command.config.whereRestrictNoDepthFilter =
                _nullWhere
            }
            cb()
          }
        })(
          resolve,
          newConfig,
          where,
          tableOrQuery,
          nullFilterWhere,
          extraParams.depth
        )
      }
      if (tableOrQuery) {
        newConfig.config.sourceType = senior && senior.type
        newConfig.config.entityInfo = entityInfo
        dataAdapter.queryDataSenior(newConfig)
      } else {
        dataAdapter.queryData(newConfig)
      }
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 调用command
 * @param {String} command 活动集编码
 * @param {Array<Object>} datas 提交的数据
 * 	[{
 * 		"code":{String} 编码
 * 		"type":{String} 值类型
 * 		"value":{Any} 值
 * 	}]
 * @param {Object} params 其他参数（可选）
 * {
 * 	"isAsync" : {Boolean} 是否异步，默认false（可选）
 * 	"ruleContext":{@link RuleContext} 规则上下文（可选）
 *  "isRuleSetCode":{Boolean} 是否后台活动集的command，默认true（可选）
 *  "timeout":{Timeout} 超时类型（可选）
 *  "isOperation" {Boolean} 默认false，废弃属性，不建议使用,
 *  "operationParam" {Object} 操作参数。废弃属性，不建议使用
 * }
 * @returns {Promise}
 * @example
 * vds.import("vds.rpc.*");
 * var promise = vds.rpc.callCommand("commandCode",[]);
 * promise.then(function(returnDatas){
 *  console.log("调用成功，返回数据：" + JSON.stringify(returnDatas));
 * }).catch(function(e){
 *  console.err("调用失败.");
 * })
 */
export function callCommand(
  this: any,
  code: string,
  datas: string | any[] | null,
  params: {
    [x: string]: any
    isAsyn?: any
    isRuleSetCode?: any
    ruleContext?: any
    isAsync?: any
    isOperation?: any
    operationParam?: any
  }
) {
  var __info = _getWindowInfo.apply(this)
  return new Promise<void>(function (resolve, reject) {
    try {
      if (vds.string.isEmpty(code)) {
        resolve()
        return
      }
      params = params || {}
      if (params.isOperation === true) {
        var result = null
        operation.request({
          windowCode: __info['windowCode'],
          operation: code,
          isAsync: false,
          params: params.operationParam,
          success: resolve,
          error: reject
        })
        return
      }
      var operationParams = null
      var commitParams = []
      if (datas) {
        if (vds.object.isArray(datas)) {
          for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i]
            commitParams.push({
              paramName: data['code'],
              paramType: data['type'],
              paramValue: data['value']
            })
          }
        } else if (typeof datas == 'object') {
          operationParams = datas
        }
      }
      var isAsync = false
      var transactionId = null
      var isRuleSetCode = true
      var timeout = null
      if (params) {
        if (params.isAsync === true) {
          isAsync = true
        }
        if (params.ruleContext) {
          transactionId = params.ruleContext
            .getMethodContext()
            ._getRouteContext()
            .getTransactionId()
        }
        if (params.isRuleSetCode === false) {
          isRuleSetCode = false
        }
        var tmpTimeout = params['timeout']
        if (rpcEnum.TIMEOUT.hasOwnProperty(tmpTimeout)) {
          timeout = rpcEnum.TIMEOUT[tmpTimeout]
        }
      }
      var config = {
        isAsyn: isAsync,
        componentCode: __info['componentCode'],
        windowCode: __info['windowCode'],
        transactionId: transactionId,
        ruleSetCode: code,
        isRuleSetCode: isRuleSetCode,
        afterResponse: resolve,
        error: reject
      }
      if (operationParams) {
        config['operationParam'] = operationParams
      } else {
        config['commitParams'] = commitParams
      }
      if (null != timeout) {
        config['timeout'] = timeout
      }
      serverRuleSetAccessor.invoke(config)
    } catch (e) {
      reject(e)
    }
  })
}
/**
 * 调用command(同步方法)
 * @deprecated
 * @param {String} command 活动集编码
 * @param {Array<Object>} datas 提交的数据
 * 	[{
 * 		"code":{String} 编码
 * 		"type":{String} 值类型
 * 		"value":{Any} 值
 * 	}]
 * @param {Object} params 其他参数（可选）
 * {
 * 	"isAsync" : {Boolean} 是否异步，默认false（可选）
 * 	"ruleContext":{@link RuleContext} 规则上下文（可选）
 *  "isRuleSetCode":{Boolean} 是否后台活动集的command，默认true（可选）
 *  "timeout":{Timeout} 超时类型（可选）
 *  "success": {Function} 成功回调
 *  "fail": {Function} 失败回调
 *  "isOperation" {Boolean} 默认false，废弃属性，不建议使用,
 *  "operationParam" {Object} 操作参数。废弃属性，不建议使用
 * }
 * @returns {Promise}
 * @example
 * vds.import("vds.rpc.*");
 * vds.rpc.callCommandSync("commandCode",[],{
 * 	success:function(returnDatas){
 *  	console.log("调用成功，返回数据：" + JSON.stringify(returnDatas));
 * 	},
 *  error:function(){
 *  	console.err("调用失败.");
 *  }
 * });
 */
export function callCommandSync(
  this: any,
  code: string,
  datas: string | any[] | null,
  params: {
    [x: string]: any
    isOperation?: any
    operationParam?: any
    success?: any
    fail?: any
    error?: ((e: any) => never) | ((e: any) => never)
    isAsync?: any
    CertPicCode?: string
    isRuleSetCode?: any
    ruleContext?: any
  }
) {
  params = params || {}
  var success = params.success || function () {}
  var fail = params.fail || function () {}
  var __info = _getWindowInfo.apply(this)
  try {
    if (vds.string.isEmpty(code)) {
      success()
      return
    }
    if (params.isOperation === true) {
      var result = null
      operation.request({
        windowCode: __info['windowCode'],
        operation: code,
        isAsync: false,
        params: params.operationParam,
        success: success,
        error: fail
      })
      return
    }
    var operationParams = null
    var commitParams = []
    if (datas) {
      if (vds.object.isArray(datas)) {
        for (var i = 0, len = datas.length; i < len; i++) {
          var data = datas[i]
          commitParams.push({
            paramName: data['code'],
            paramType: data['type'],
            paramValue: data['value']
          })
        }
      } else if (typeof datas == 'object') {
        operationParams = datas
      }
    }
    var isAsync = false
    var transactionId = null
    var isRuleSetCode = true
    var timeout = null
    if (params) {
      if (params.isAsync === true) {
        isAsync = true
      }
      if (params.ruleContext) {
        transactionId = params.ruleContext
          .getMethodContext()
          ._getRouteContext()
          .getTransactionId()
      }
      if (params.isRuleSetCode === false) {
        isRuleSetCode = false
      }
      var tmpTimeout = params['timeout']
      if (rpcEnum.TIMEOUT.hasOwnProperty(tmpTimeout)) {
        timeout = rpcEnum.TIMEOUT[tmpTimeout]
      }
    }
    var config = {
      isAsyn: isAsync,
      componentCode: __info['componentCode'],
      windowCode: __info['windowCode'],
      transactionId: transactionId,
      ruleSetCode: code,
      isRuleSetCode: isRuleSetCode,
      afterResponse: success,
      error: fail
    }
    if (operationParams) {
      config['operationParam'] = operationParams
    } else {
      config['commitParams'] = commitParams
    }
    if (null != timeout) {
      config['timeout'] = timeout
    }
    serverRuleSetAccessor.invoke(config)
  } catch (e) {
    fail(e)
  }
}
/**
 * 调用webapi（目前仅支持调用V3平台提供的webapi地址）
 * @param {String} webAPISite webapi地址
 * @param {Object} params 其他参数（可选）
 * {
 *  "param":{Object} 请求参数
 * 	"timeout" : {Integer} 超时时间,单位：秒（如果未设置，则默认3秒）
 * }
 * @returns {Promise}
 * @example
 * var promise = vds.rpc.callWebapi("http://127.0.0.1:8080/webapi/code/WebApiCode",{
 *  "param":{
 *   "code1":"value1"
 *  },
 *  "timeout":20
 * });
 * promise.then(function(datas){
 * 	console.log("请求结束，返回数据：" + JSON.stringify(datas));
 * }).catch(function(err){
 * 	console.log("请求失败");
 * })
 * */
export function callWebapi(webAPISite: string, params: Record<string, any>) {
  return new Promise(function (resolve, reject) {
    try {
      if (!webAPISite) {
        reject(vds.exception.newConfigException('webapi地址不能为空'))
        return
      }
      //webAPISite 拆分参数
      var startHost = 0
      var endHost = webAPISite.indexOf('/webapi/')
      var startComp = endHost + 8
      var endComp = webAPISite.lastIndexOf('/')
      var startApiCode = endComp + 1
      var endApiCode = webAPISite.indexOf('?')
      if (endApiCode == -1) {
        endApiCode = webAPISite.length
      }
      var host = webAPISite.substring(startHost, endHost)
      var componentCode = webAPISite.substring(startComp, endComp)
      var apiCode = webAPISite.substring(startApiCode, endApiCode)
      if (host == '' || componentCode == '' || apiCode == '') {
        reject(
          vds.exception.newBusinessException(
            '地址格式错误，api地址：' + webAPISite
          )
        )
        return
      }
      var param
      var timeout = 3
      if (params) {
        if (params.hasOwnProperty('host')) {
          host = params['host']
        }
        if (params.hasOwnProperty('param')) {
          param = params['param']
        }
        if (params.hasOwnProperty('timeout')) {
          timeout = params['timeout']
        }
      }
      var config = {
        componentCode: componentCode,
        apiCode: apiCode,
        afterResponse: resolve,
        error: reject
      }
      if (host) {
        config['host'] = host
      }
      if (param) {
        config['param'] = param
      }
      if (timeout) {
        config['timeout'] = timeout
      }
      serverRuleSetAccessor.invokeV3Webapi(config)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 导入Excel文件
 * @param {Array<Object>} configs 导入配置
 * [{
 * 	tableCode {String} 表编码
 *  sheetNum {Integer} Sheet索引, 从1开始
 *  startRow {Integer} 数据开始行， 从1开始
 *  fieldMappings {Array<Object>} 表字段与单元格列的映射信息
 *   [{
 *    	chineseName {String} 中文名称
 *    	fieldName {String} 字段编码
 *      type {String} 值类型：ExcelName（列名）/ExcelCode（列号）/expression（表达式）
 *      value {Any} 值
 *   }]
 *   treeStruct:{@link TreeStruct} 树结构
 * }]
 * @param {@link MethodContext} methodContext 方法上下文
 * @returns {Promise}
 * @example
 * var promise = vds.rpc.importExcel([{
 * 	tableCode:"tableCode1",
 *  sheetNum:1,
 *  startRow:2,
 *  fieldMappings:[{
 *   chineseName:"编码",
 *   fieldName:"code",
 *   type:"ExcelCode",
 *   value:"A"
 *  }]
 * }]);
 * */
export function importExcel(
  configs: string | any[],
  params: { methodContext?: any; widgetCode?: any }
) {
  var __params = params || {}
  var __info = _getWindowInfo()
  return new Promise<void>(function (resolve, reject) {
    try {
      var methodContext = __params.methodContext
        ? __params.methodContext._getRouteContext()
        : null
      var widgetCode = __params.widgetCode
      var transaction_id = methodContext && methodContext.getTransactionId()
      var treeStructs: any[] = []
      var items: any[] = []
      var varMaps = {}
      var ruleConfig = {
        fileSource: '',
        treeStruct: treeStructs,
        items: items,
        varMap: varMaps
      }
      var ctx = new EngineContext()
      ctx.setRouteContext(methodContext)
      for (var i = 0, len = configs.length; i < len; i++) {
        var dgColumns = []
        var config = configs[i]
        var treeStruct = config.treeStruct
        if (treeStruct && treeStruct.treeStruct) {
          treeStruct = treeStruct.treeStruct
        }
        if (treeStruct) {
          treeStructs.push(treeStruct)
        }
        var fieldMappings = config.fieldMappings
        var sheetNum = config.sheetNum - 1
        var startRow = config.startRow
        var tableCode = config.tableCode
        var varMap = {}
        varMaps[tableCode + '_' + sheetNum] = varMap
        for (var j = 0; j < fieldMappings.length; j++) {
          var fieldMapping = fieldMappings[j]
          var type = fieldMapping.type
          var fileCode = fieldMapping.fieldName
          var value = fieldMapping.value
          var source = 'expression'
          switch (type) {
            case 'ExcelName':
              source = 'Excel'
              break
            case 'ExcelCode':
              source = 'ExcelColCode'
              break
            case 'expression':
              varMap[fileCode] = value
                ? engine.execute({
                    expression: value,
                    context: ctx
                  })
                : value
              break
          }
          dgColumns.push({
            chineseName: fieldMapping.chineseName,
            fieldName: fieldMapping.fieldName,
            source: source,
            value: value
          })
        }
        var item = {
          dataName: tableCode,
          dataType: treeStruct ? 'tree' : 'Table',
          dgcolumn: dgColumns,
          fileType: 'Excel',
          importNodeId: '',
          sheetNum: sheetNum,
          startRow: startRow + '',
          treeStruct: treeStruct ? treeStruct : null
        }
        items.push(item)
      }
      var option = {
        action: 'importTable',
        selectId: {},
        componentCode: __info['componentCode'],
        windowCode: __info['windowCode'],
        ruleConfig: vds.string.toJson(ruleConfig),
        varMap: varMaps,
        transactionId:
          transaction_id /**后台需要这个进行事物管理, 事物id变量错误，导致没有与前一个事务串联 jiqj*/
      }
      if (widgetCode) {
        var callback = function (arg2: any, error: any) {
          if (error.success === false) {
            var exception = factory.create(error)
            reject(exception)
          } else {
            resolve()
          }
        }
        widgetAction.executeWidgetAction(
          widgetCode,
          'importData',
          option,
          callback
        )
        return
      }
      if ($('#importExcelToDBFileButton').length > 0) {
        $('#importExcelToDBFileButton').next().remove()
        $('#importExcelToDBFileButton').remove()
      }
      var fileInput =
        "<div id='importExcelToDBFileButton' style='display:none'>隐藏按钮</div>"
      $('body').append(fileInput)
      var error_msg: { success: boolean; msg: string }
      var plupload_upload_obj = new plupload.Uploader({
        //实例化一个plupload上传对象
        runtimes: 'html5,flash,html4',
        browse_button: 'importExcelToDBFileButton',
        url: 'module-operation!executeOperation?operation=FileUpload&ajaxRequest=true',
        multipart_params: {},
        multi_selection: false,
        init: {
          FilesAdded: function (uploader: any, files: any) {
            //添加文件触发
            plupload_upload_obj.start()
          },
          FileUploaded: function (
            uploader: any,
            file: any,
            responseObject: { response: { success: boolean; msg: string } }
          ) {
            //每个文件上传完成触发
            error_msg = responseObject.response
          },
          UploadComplete: function (uploader: any, files: any) {
            //全部文件上传完成触发
            if (error_msg && typeof error_msg == 'string') {
              try {
                error_msg = vds.object.stringify(error_msg)
              } catch (e) {}
            }
            if (error_msg && error_msg.success === false) {
              var msg = error_msg.msg || '导入失败'
              var exception = factory.create({
                message: msg,
                type: factory.TYPES.System,
                exceptionDatas: []
              })
              exception.markServiceException()
              reject(exception)
            } else {
              resolve()
            }
          },
          Error: function (uploader: any, errObject: { code: any }) {
            var ERROR_CODE = {
              '-100': i18n.get('上传失败', 'Excel导入失败的通用提示'), //发生通用错误时的错误代码
              '-200': i18n.get('网络异常', '无法访问网络导致失败的信息'), //发生http网络错误时的错误代码，例如服务器端返回的状态码不是200
              '-300': i18n.get(
                '文件读取失败',
                '导入文件无法读取导致失败的信息'
              ), //发生磁盘读写错误时的错误代码，例如本地上某个文件不可读
              '-400': i18n.get('网络安全异常', '网络安全问题导致失败的信息'), //发生因为安全问题而产生的错误时的错误代码
              '-500': i18n.get('初始化失败', '导入插件初始化失败的信息'), //初始化时发生错误的错误代码
              '-600': i18n.get(
                '对不起，上传的文件太大',
                '上传文件过大导致失败的信息'
              ),
              '-601': i18n.get(
                '对不起，上传的文件类型不允许',
                '上传文件类型不允许导致失败的信息'
              ),
              '-602': i18n.get(
                '执行失败',
                '选取了重复的文件而配置中又不允许有重复文件时的错误信息'
              ), //当选取了重复的文件而配置中又不允许有重复文件时的错误代码
              '-700': i18n.get('图片格式错误', '图片格式错误时的错误信息'), //发生图片格式错误时的错误代码
              '-702': i18n.get(
                '文件大小超过可处理范围，请分批上传',
                '上传的文件超过最大的处理时的错误信息'
              ) //当文件大小超过了plupload所能处理的最大值时的错误代码
            }
            var code = errObject.code
            var error = ERROR_CODE[code]
            if (!error) {
              error = ERROR_CODE['-100']
            }
            var exception = factory.create({
              message: error,
              type: factory.TYPES.System,
              exceptionDatas: []
            })
            reject(exception)
          },
          Init: function () {
            $('#importExcelToDBFileButton').next().children().click()
          }
        }
      })
      var token = {
        data: {
          dataId: vds.string.uuid(),
          action: 'importTable',
          cfg: option,
          componentCode: option.componentCode,
          windowCode: option.windowCode,
          transaction_id: transaction_id
        }
      }
      var appendUrl = plupload_upload_obj.settings.url
      appendUrl += '&' + 'componentCode=' + option.componentCode
      appendUrl += '&' + 'windowCode=' + option.windowCode
      plupload_upload_obj.settings.url = appendUrl
      plupload_upload_obj._handleRequestDataByV3 = function (datas: {
        [x: string]: any
      }) {
        if (datas && dataValidateUtil.genAsciiCode) {
          var url = this.settings.url
          if (undefined != url && url.indexOf('?') != -1) {
            var urlParamArr = url.split('?')[1].split('&')
            for (var i = 0, len = urlParamArr.length; i < len; i++) {
              var param = urlParamArr[i]
              if (param.indexOf('=') != -1) {
                var paramArr = param.split('=')
                datas[paramArr[0]] = paramArr[1]
              }
            }
          }
          var map = dataValidateUtil.genAsciiCode(datas)
          return map
        }
      }
      plupload_upload_obj.settings.multipart_params.token = encodeURI(
        // isc.JSON.encode(token)
        JSON.stringify(token)
      )
      plupload_upload_obj.init()
    } catch (err) {
      reject(err)
    }
  })
}
