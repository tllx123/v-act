import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { EasyTemplateUtil as easyTemplateUtil } from '@v-act/vjs.framework.extension.util.easytemplate'

export function initModule(sb) {}

const main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    arg1 = argsLen >= 1 ? args[0] : null

  let templateStr = arg1
  if (!templateStr) return ''

  // 在模板中提取所有要替换的串，${tableName.fieldName}
  let regex = /\$\{(.+?)\}/g
  let arr = templateStr.match(regex) // 返回数组
  // 记录数据集
  let data = {}
  let tableNamesMap = {}
  // 提取所有的数据源tableNames

  let context = new ExpressionContext()

  if (arr && arr.length > 0) {
    for (let i = 0, len = arr.length; i < len; i++) {
      let sourceStr = arr[i]
      if (sourceStr.indexOf('.') != -1) {
        // 为实体表${table1.name}
        let tableName = ''
        let matchs = sourceStr.match(
          /\${(.*)\[([0-9]+)\]\.[^ ]+}|\${(.*)\.[^ ]+}/
        )
        if (matchs && matchs.length > 1) {
          if (matchs[1]) {
            tableName = matchs[1] // 表名[数字].字段名
            recordCount = matchs[2]
          } else if (matchs[3]) tableName = matchs[3] // 表名.字段名

          if (tableName != '') {
            // 获取不到表名就不管了，下面直接取表
            if (!tableNamesMap[tableName]) {
              // 之前已经获取过数据了就不重复获取
              // var tableName = tableNamesMap[key];
              let datasource = manager.lookup({
                datasourceName: tableName
              })
              let currentRecord = datasource.getCurrentRecord()
              if (currentRecord) data[tableName] = currentRecord.toMap()
              else data[tableName] = {}

              // 把所有记录加载进来，模版中使用 表名[行号-1].字段名 获取
              let allRecord = datasource.getAllRecords().toArray()
              if (allRecord && allRecord.length) {
                for (let i = 0; i < allRecord.length; i++)
                  data[tableName][i] = allRecord[i].toMap()
              }

              // 如果模版中指定的记录不存在，默认添加一个空行，防止报错
              if (matchs[1]) {
                if (!data[tableName][recordCount])
                  data[tableName][recordCount] = {}
              }
            }

            // 如果模版中指定的记录不存在，默认添加一个空行，防止报错
            if (matchs[1]) {
              if (!data[tableName][recordCount])
                data[tableName][recordCount] = {}
            }
          }
        } else {
          // 不是表名字段名形式
        }

        if (tableName != '' && !tableNamesMap[tableName])
          tableNamesMap[tableName] = tableName
      } else {
        // 先按组件变量来取@test,再看没有系统变量@@test,若再没有就置为空串“”
        // 其它不支持的变量定义串，其值设置为“”空串
        let otherVar = sourceStr.substring(2, sourceStr.length - 1)
        if (otherVar) {
          try {
            let expressionTemp = '@' + otherVar
            let expressionTemp2 = '@@' + otherVar
            let value = engine.execute({
              expression: expressionTemp,
              context: context
            })
            let value2 = engine.execute({
              expression: expressionTemp2,
              context: context
            })
            data[otherVar] = value || value2 || ''
          } catch (e) {
            throw new Error(
              '请检查模版的html内容，检查形如${定义的串}是否被html样式隔开了!'
            )
            return ''
          }
        }
      }
    }
  }

  // 用模板引擎进行替换值
  let content = easyTemplateUtil.easyTemplate(templateStr, data)

  return content.toString()
}

export { main }
