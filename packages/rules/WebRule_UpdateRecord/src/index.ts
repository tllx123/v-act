import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
/**
 *	保存前端实体到数据库
 */
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as tree from '@v-act/vjs.framework.extension.platform.services.integration.vds.tree'

const vds = { rpc, ds, expression, tree }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var paramsJson = ruleContext.getVplatformInput()
      var treeStructMapArray = paramsJson['treeStruct']
      var treeMap = {}
      if (treeStructMapArray instanceof Array) {
        for (var i = 0, len = treeStructMapArray.length; i < len; i++) {
          var treeStruct = treeStructMapArray[i]
          var entityName = treeStruct['tableName']
          if (entityName) {
            var struct = vds.tree.createTreeStruct(
              entityName,
              treeStruct['pidField'],
              treeStruct['orderField'],
              treeStruct['treeCodeField'],
              treeStruct['isLeafField'],
              treeStruct['busiFilterField']
            )
            treeMap[entityName] = struct
          }
        }
      }
      var dataSourceMappings = paramsJson ? paramsJson['dataSourceMap'] : null
      var configs = []
      if (undefined != dataSourceMappings && null != dataSourceMappings) {
        for (var i = 0; i < dataSourceMappings.length; i++) {
          var dataSourceMapping = dataSourceMappings[i]
          //是否保存所有，否则只保存改变的数据，为布尔值，如果是旧规则值为undefined
          var isSaveAll = dataSourceMapping['isSaveAll']
          //兼容旧规则处理，默认为true
          if (isSaveAll == null || isSaveAll == undefined) {
            isSaveAll = true
          }
          //源数据源（可能为内存表、查询或物理表）
          var dataSourceName = dataSourceMapping['dataSource']
          var dataSourceNameType = dataSourceMapping['dataSourceType'] //获取实体类型
          if (null != dataSourceName) {
            /*给实体添加前缀*/
            var datasource = getDatasouce(
              dataSourceName,
              dataSourceNameType,
              ruleContext
            )
            if (null == datasource) {
              throw vds.exception.newConfigException(
                '实体【' + dataSourceName + '】不存在，请检查配置.'
              )
            }
            var newFieldMappings = []
            var fileMappings = dataSourceMapping['dataMap']
            if (fileMappings instanceof Array) {
              for (var j = 0, len = fileMappings.length; j < len; j++) {
                var map = fileMappings[j]
                var field = map.colName
                if (field.indexOf('.') != -1) {
                  field = field.split('.')[1]
                }
                var value = map.colValue
                // if(value.indexOf(".") !=-1){//表达式不能切[entity].[code]
                // 	value = value.split(".")[1];
                // }
                var type = map.valueType
                if (type == 'entityField') {
                  type = 'field'
                } else {
                  type = 'expression'
                }
                newFieldMappings.push({
                  code: field,
                  value: value,
                  type: type
                })
              }
            }
            var tableCode = dataSourceMapping['destTab']
            var config = {
              entity: datasource,
              tableCode: tableCode,
              fieldMappings: newFieldMappings,
              autoFieldMapping:
                dataSourceMapping.isFieldAutoMapping === true ? true : false,
              saveAll: isSaveAll
            }
            if (treeMap[tableCode]) {
              config['treeStruct'] = treeMap[tableCode]
            }
            configs.push(config)
          }
        }
      }
      if (configs.length > 0) {
        var promise = vds.rpc.saveData(configs, ruleContext, {
          isAsync: true,
          ruleContext: ruleContext
        })
        promise.then(resolve).catch(reject)
      } else {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 获取来源数据源实例
 * @param {String} entityName 数据源编码
 * @param {String} entityType 数据源类型：ruleSetOutput（方法输出）、ruleSetInput（方法输入）、ruleSetVar（方法变量）
 * @param {@link RuleContext} ruleContext 规则上下文
 * @return {@link Datasource}
 */
function getDatasouce(entityName, entityType, ruleContext) {
  var dbName = entityName
  var type = ''
  if (entityType == 'ruleSetOutput') {
    //方法输出
    type = 'BR_OUT_PARENT.'
  } else if (entityType == 'ruleSetInput') {
    //方法输入
    type = 'BR_IN_PARENT.'
  } else if (entityType == 'ruleSetVar') {
    //方法变量
    type = 'BR_VAR_PARENT.'
  } else {
    return vds.ds.lookup(entityName)
  }
  dbName = type + dbName
  return vds.expression.execute(dbName, {
    ruleContext: ruleContext
  })
}
export { main }
