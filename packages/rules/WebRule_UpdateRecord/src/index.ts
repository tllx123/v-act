import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
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

const vds = { rpc, ds, expression, tree, exception }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      const paramsJson = ruleContext.getVplatformInput()
      const treeStructMapArray = paramsJson['treeStruct']
      const treeMap = {}
      if (treeStructMapArray instanceof Array) {
        for (let i = 0, len = treeStructMapArray.length; i < len; i++) {
          const treeStruct = treeStructMapArray[i]
          const entityName = treeStruct['tableName']
          if (entityName) {
            const struct = vds.tree.createTreeStruct(
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
      const dataSourceMappings = paramsJson ? paramsJson['dataSourceMap'] : null
      const configs = []
      if (undefined != dataSourceMappings && null != dataSourceMappings) {
        for (let i = 0; i < dataSourceMappings.length; i++) {
          const dataSourceMapping = dataSourceMappings[i]
          //是否保存所有，否则只保存改变的数据，为布尔值，如果是旧规则值为undefined
          let isSaveAll = dataSourceMapping['isSaveAll']
          //兼容旧规则处理，默认为true
          if (isSaveAll == null || isSaveAll == undefined) {
            isSaveAll = true
          }
          //源数据源（可能为内存表、查询或物理表）
          const dataSourceName = dataSourceMapping['dataSource']
          const dataSourceNameType = dataSourceMapping['dataSourceType'] //获取实体类型
          if (null != dataSourceName) {
            /*给实体添加前缀*/
            const datasource = getDatasouce(
              dataSourceName,
              dataSourceNameType,
              ruleContext
            )
            if (null == datasource) {
              throw vds.exception.newConfigException(
                '实体【' + dataSourceName + '】不存在，请检查配置.'
              )
            }
            const newFieldMappings = []
            const fileMappings = dataSourceMapping['dataMap']
            if (fileMappings instanceof Array) {
              for (let j = 0, len = fileMappings.length; j < len; j++) {
                const map = fileMappings[j]
                let field = map.colName
                if (field.indexOf('.') != -1) {
                  field = field.split('.')[1]
                }
                const value = map.colValue
                // if(value.indexOf(".") !=-1){//表达式不能切[entity].[code]
                // 	value = value.split(".")[1];
                // }
                let type = map.valueType
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
            const tableCode = dataSourceMapping['destTab']
            const config = {
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
        const promise = vds.rpc.saveData(configs, ruleContext, {
          isAsync: true,
          ruleContext: ruleContext
        })
        //@ts-ignore
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
function getDatasouce(
  entityName: string,
  entityType: string,
  ruleContext: RuleContext
) {
  let dbName = entityName
  let type = ''
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
