﻿/**
 * 加载动态交叉表到实体
 */

import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = {
  component,
  ds,
  exception,
  expression,
  log,
  rpc,
  string,
  widget,
  window
}

//规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      //获取规则上下文中的规则配置值
      var inParamsObj = ruleContext.getVplatformInput()
      var isAsyn = inParamsObj['isAsyn']
      var itemConfigs = inParamsObj['itemsConfig']
      for (var i = 0; i < itemConfigs.length; i++) {
        var itemConfig = itemConfigs[i]
        var isType = itemConfig['Istype']
        //查询：1，表：0
        var queryConds = itemConfig['dsWhere']
        // 过滤条件
        var entityName = itemConfig['entityName']
        //目标DB
        var itemqueryparam = itemConfig['itemqueryparam']
        //源数据中的字段
        var items = itemConfig['items']
        //高级查询参数值
        var tableOrQuery = itemConfig['tableOrQuery']
        var valueFunctions = itemConfig['valueFunctions']
        //这里要处理常量和表达式的交互
        if (tableOrQuery != null && tableOrQuery.length > 0) {
          for (var index = 0; index < tableOrQuery.length; index++) {
            var columntableOrQuery = tableOrQuery[index]

            var columnName = columntableOrQuery['paramsName']
            var columnValue = columntableOrQuery['paramsValue']
            if (columnName == 'rowSumName' || columnName == 'colSumName') {
              if (!isEmpty(columnValue)) {
                columnValue = vds.expression.execute(columnValue, {
                  ruleContext: ruleContext
                })
                columntableOrQuery['paramsValue'] = columnValue
              }
            }
            if (columnName == 'isEmptyToProduceDynamicCol') {
              if (!isEmpty(columnValue)) {
                columntableOrQuery['paramsValue'] = vds.expression.execute(
                  columnValue,
                  { ruleContext: ruleContext }
                )
              }
            }
          }
          if (valueFunctions != null) {
            var entityObject = vds.string.toJson(valueFunctions, false)
            var values = {
              paramsName: 'valueFunctions',
              paramsValue: entityObject
            }
            tableOrQuery.push(values)
          }
        }

        //映射关系
        var sourceName = itemConfig['sourceName']
        //源数据Name
        //处理非数据集字段的映射值
        var mappings = getMappings(items, ruleContext)
        // 根据过滤条件获取出源数据源数据
        var isCustomSqlFind = isType + '' == '1'
        var wrParam = {
          type: isCustomSqlFind
            ? vds.ds.WhereType.Query
            : vds.ds.WhereType.Table,
          methodContext: ruleContext.getMethodContext()
        }
        var whereRestrict = vds.ds.createWhere(wrParam)
        if (
          undefined != queryConds &&
          null != queryConds &&
          queryConds.length > 0
        ) {
          whereRestrict.addCondition(queryConds)
        }

        var params = genCustomParams(itemqueryparam, ruleContext)
        whereRestrict.addParameters(params)

        var paginationObj = getPagingInfoByDataSource(entityName)
        var recordStart = paginationObj.recordStart
        var pageSize = paginationObj.pageSize

        var isAsyn = isAsyn
        var queryParams = {}
        var queryType = 'Table'
        if (isType == 1) {
          //自定义查询
          queryType = 'Query'
          queryParams = genCustomSqlQueryParams(whereRestrict.toParameters())
          if (i < itemConfigs.length - 1) {
            isAsyn = false
          } else {
            isAsyn = isAsyn
          }
        } else {
          queryParams = whereRestrict.toParameters()
          // 排序条件处理
          var orderByCfg = itemConfig['orderBy']
          if (
            orderByCfg &&
            typeof orderByCfg != 'undefined' &&
            orderByCfg.length > 0
          ) {
            for (var obIndex = 0; obIndex < orderByCfg.length; obIndex++) {
              var orderByItem = orderByCfg[obIndex]
              if (!orderByItem.field || orderByItem.field == '') {
                continue
              }
              var fieldArray = orderByItem.field.split('.')
              var orderByField = fieldArray[fieldArray.length - 1]
              var orderType =
                orderByItem.type.toLowerCase() == 'desc'
                  ? whereRestrict.OrderType.DESC
                  : whereRestrict.OrderType.ASC
              whereRestrict.addOrderBy(orderByField, orderType)
            }
          }
          if (i < itemConfigs.length - 1) {
            isAsyn = false
          } else {
            isAsyn = isAsyn
          }
        }

        var senior = {
          command: 'CommonRule_DynamicCrossDataToInterfaceEntity',
          groupCrossConfig: tableOrQuery,
          type: isType
        }
        var newFieldMappings = []
        for (var j = 0, _l = mappings.length; j < _l; j++) {
          var _map = mappings[j]
          var field = _map['destName']
          if (field.indexOf('.') != -1) {
            field = field.split('.')[1]
          }
          newFieldMappings.push({
            code: field,
            type: _map['type'] == 'entityField' ? 'field' : 'expression',
            value: _map['sourceName']
          })
        }
        var destEntity = getDatasource(
          entityName,
          '',
          ruleContext.getMethodContext()
        )
        var promise = vds.rpc.queryData(
          sourceName,
          queryType,
          destEntity,
          newFieldMappings,
          {
            where: whereRestrict,
            pageConfig: {
              pageSize: pageSize,
              recordStart: recordStart
            },
            methodContext: ruleContext.getMethodContext(),
            isAsync: isAsyn,
            isAppend: false,
            Senior: senior
          }
        )
        promise.then(resolve).catch(reject)
      }
    } catch (ex) {
      reject(ex)
    }
  })
}

//判断字符是否为空的方法
function isEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

/**
 * 获得非数据集字段的映射值
 */
var getMappings = function (fromMappings, ruleContext) {
  var returnMappings = []
  if (!fromMappings || fromMappings.length <= 0) {
    return returnMappings
  } else {
    for (var index = 0; index < fromMappings.length; index++) {
      var fromMapping = fromMappings[index]
      var type = fromMapping['type']
      type = type.toString()
      var destName = fromMapping['destName']
      var sourceName = fromMapping['sourceName']
      var returnMapping = {}
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
          var sourceName = vds.expression.execute(sourceName, {
            ruleContext: ruleContext
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

var getDatasource = function (dsCode, type, methodContext) {
  var datasource
  switch (type) {
    case 'windowVariant': //窗体输入
    case 'windowInput':
      datasource = vds.window.getInput(dsCode)
      break
    case 'ruleSetVariant': //方法变量
    case 'ruleSetVar': //方法变量
      datasource = methodContext.getVariable(dsCode)
      break
    case 'ruleSetOutput': //方法输出
      datasource = methodContext.getOutput(dsCode)
      break
    case 'windowOutput': //窗体输出
      datasource = vds.window.getOutput(dsCode)
      break
    default:
      //界面实体
      datasource = vds.ds.lookup(dsCode)
      break
  }
  if (!datasource) {
    throw vds.exception.newBusinessException('实体[' + dsCode + ']不存在')
  }
  return datasource
}

var genCustomSqlQueryParams = function (params) {
  // 构建实际查询时需要的参数对象
  var queryParams = {}
  if (params) {
    for (var key in params) {
      queryParams[key] = {}
      queryParams[key]['paramName'] = key
      queryParams[key]['paramValue'] = params[key]
    }
  }
  return queryParams
}

var getPagingInfoByDataSource = function (entityName) {
  var types = ['JGDataGrid', 'JGPagination']
  var widgetCodes = vds.widget.getWidgetCodes(entityName)
  var pageInfo
  if (widgetCodes) {
    for (var i = 0; i < widgetCodes.length; i++) {
      var widgetCode = widgetCodes[i]
      var type = vds.widget.getType(widgetCode)
      if (types.indexOf(type) != -1) {
        pageInfo = vds.widget.execute(widgetCode, 'getPageInfo', [widgetCode])
        if (pageInfo) {
          return pageInfo
        }
      }
    }
  }
  pageInfo = {
    recordStart: -1,
    pageSize: -1
  }
  return pageInfo
}

//#region genCustomParams 方法

var genCustomParams = function (paramDefines, ruleContext) {
  var rs = {}
  if (paramDefines && paramDefines.length > 0) {
    for (var i = 0; i < paramDefines.length; i++) {
      var define = paramDefines[i]
      var key = define['queryfield']
      if (!key) {
        key = define['Queryfield']
      }
      var valueDefine = define['queryfieldValue']
      if (!valueDefine) {
        valueDefine = define['QueryfieldValue']
      }
      var type = define['type']
      var componentControlID = define['componentControlID']
      var value = getCustomParamValue(
        valueDefine,
        type,
        componentControlID,
        ruleContext
      )
      rs[key] = value
    }
  }
  return rs
}
/**
 * 获取自定义参数的值
 * @param queryfieldValue 参数值
 * @param type 参数类源类型(参数值类型1表字段，2系统变量，3组件变量，4固定值，5自定义，6面板参数，8控件的值, 9表达式)
 * @param componentControlId 参数来源控件
 */
var getCustomParamValue = function (
  queryfieldValue,
  type,
  componentControlId,
  ruleContext
) {
  var returnValue = ''

  switch (vds.string.trim(type + '')) {
    case '1':
      if (queryfieldValue.indexOf('.') == -1) {
        vds.log.warn(queryfieldValue + ' 格式必须为表名.字段名')
        break
      }
      var ds = queryfieldValue.split('.')[0]
      var fieldName = queryfieldValue.split('.')[1]
      var record = getCurrentRecord(ds)
      returnValue = record.get(fieldName)
      break
    case '2':
      returnValue = vds.component.getVariant(queryfieldValue)
      break
    case '3':
      returnValue = vds.window.getInput(queryfieldValue)
      break
    case '4':
      // returnValue = queryfieldValue;
      // 固定值(0:假，1:真，2:空)
      switch ((queryfieldValue + '').toLowerCase()) {
        case '0':
          returnValue = false
          break
        case '1':
          returnValue = true
          break
        case '2':
          returnValue = null
          break
        default:
          returnValue = queryfieldValue
          break
      }
      break
    case '5':
      returnValue = queryfieldValue
      break
    case '6':
      var valueQueryControlID = componentControlId
      var value = queryfieldValue
      var storeType = vds.widget.getStoreType(valueQueryControlID)
      var storeTypes = vds.widget.StoreType
      // 按照控件不同的属性类型，获取参数值
      var ds = getDsName(valueQueryControlID)
      var record = getCurrentRecord(ds)
      if (storeTypes.Set == storeType) {
        // 集合类控件，组装表名.字段名进行取值
        if (record) {
          var field = value.split('_')[1]
          returnValue = record.get(field)
        } else {
          vds.log.error(
            '集合控件:' + valueQueryControlID + ' 无选中行，无法获取其参数值'
          )
        }
      } else if (storeTypes.SingleRecordMultiValue == storeType) {
        // 单记录多值控件，按照控件属性名字取得关联的标识，再进行取值
        //var propertyCode = value.split("_")[1];
        var propertyCode = ''
        // 目前认为使用-分隔，也可以使用_分隔
        if (value.indexOf('-') != -1) {
          propertyCode = value.split('-')[1]
        } else {
          propertyCode = value.split('_')[1]
        }
        var fieldCode = vds.widget.getProperty(
          valueQueryControlID,
          propertyCode
        )
        returnValue = record.get(fieldCode)
      } else if (storeTypes.SingleRecord == storeType) {
        // 单值控件，直接取值
        var fieldCode = vds.widget.getFieldCodes(ds, valueQueryControlID)[0]
        returnValue = record.get(fieldCode)
        if (null == returnValue || undefined == returnValue) {
          returnValue = ''
        }
      }
      break
    case '8':
    case '9':
    default:
      if (!queryfieldValue) {
        // modify by xiedh 2016-04-26,预先校验，防止执行表达式报错
        if (null == queryfieldValue || undefined == queryfieldValue) {
          returnValue = null
        } else {
          returnValue = queryfieldValue
        } //end modify
      } else {
        returnValue = vds.expression.execute(queryfieldValue, {
          ruleContext: ruleContext
        })
      }
      break
  }
  //todo
  if (queryfieldValue !== '""' && returnValue === '') {
    return null
  }
  // 统一输出为字符串
  //return (null == returnValue || undefined == returnValue ? "" : returnValue);
  return undefined == returnValue ? null : returnValue
}
var getCurrentRecord = function (ds) {
  var datasource = vds.ds.lookup(ds)
  return datasource.getCurrentRecord()
}

var getDsName = function (widgetCode) {
  var dsNames = vds.widget.getDatasourceCodes(widgetCode)
  return dsNames[0]
}

//#endregion

export { main }
