/**
 * 传入带有动态标签的模版字符串，从当前数据源中获取数据并填充到模版中，返回填充后的文本字符串。 约定格式：实体表为${table1.name}，系统变量为${test2}，组件变量为${test3} 例如：模版字符串: "你好${table1.name}" 当前拥有数据源table1,当前行中name这一列的数据为"张三" 则该函数的返回值为"你好张三"
 *
 * 代码示例1: GenerateTextByTemplate("你好${table1.name}") 代码示例2: GenerateTextByTemplate([Table1].[FieldData1])，[表名].[字段名]表达式的内容为模版字符串 参数--模版字符串 (字符串类型)； 返回值类型为字符串类型。
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, exception, expression, string }

const main = function (templateStr) {
  if (!templateStr) return ''

  // 在模板中提取所有要替换的串，${tableName.fieldName}
  var regex = /\$\{(.+?)\}/g
  var arr = templateStr.match(regex) // 返回数组
  // 记录数据集
  var data = {}
  var tableNamesMap = {}
  // 提取所有的数据源tableNames
  if (arr && arr.length > 0) {
    for (var i = 0, len = arr.length; i < len; i++) {
      var sourceStr = arr[i]
      if (sourceStr.indexOf('.') != -1) {
        // 为实体表${table1.name}
        var tableName = ''
        var matchs = sourceStr.match(
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
              var datasource = vds.ds.lookup(tableName)
              if (null == datasource) {
                throw vds.exception.newConfigException(
                  '实体【' + tableName + '】不存在'
                )
              }
              var currentRecord = datasource.getCurrentRecord()
              if (currentRecord) data[tableName] = currentRecord.toMap()
              else data[tableName] = {}

              // 把所有记录加载进来，模版中使用 表名[行号-1].字段名 获取
              var allRecord = datasource.getAllRecords().toArray()
              if (allRecord && allRecord.length) {
                for (var i = 0; i < allRecord.length; i++)
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
        var otherVar = sourceStr.substring(2, sourceStr.length - 1)
        if (otherVar) {
          try {
            var expressionTemp = '@' + otherVar
            var expressionTemp2 = '@@' + otherVar
            var value = vds.expression.execute(expressionTemp)
            var value2 = vds.expression.execute(expressionTemp2)
            data[otherVar] = value || value2 || ''
          } catch (e) {
            throw new Error(
              '请检查模版的html内容，检查形如${定义的串}是否被html样式隔开了!'
            )
          }
        }
      }
    }
  }

  // 用模板引擎进行替换值
  var content = vds.string.template(templateStr, data)

  return content.toString()
}
export { main }
