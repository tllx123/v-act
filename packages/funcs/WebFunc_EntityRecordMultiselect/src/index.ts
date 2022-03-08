/**
 *
 *
 */
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'

const vds = { ds }

const main = function (dsName, recordVals, fileCode, separator, type) {
  ERRORNAME = '函数[实体记录多选]'
  //获取参数
  if (!separator) {
    //获取函数第四个参数
    separator = ''
  }
  if (type != 'unselect') {
    //参数5：操作类型，select：选中匹配的记录，unselect：取消选中匹配的记录，该参数忽略时，默认值为select（字符串类型）；
    type = 'select'
  }

  if (vds.object.isUndefOrNull(recordVals)) {
    vds.log.warn(ERRORNAME + '需要选中的记录为空，所以不作任何处理！')
    return null
  } else {
    //判断参数是否为空
    if (vds.object.isUndefOrNull(dsName)) {
      throw vds.exception.newConfigException('第一个参数不能为空')
    }
    if (vds.object.isUndefOrNull(fileCode)) {
      throw vds.exception.newConfigException('第三个参数不能为空')
    }
    //函数目前只支持界面实体
    var datasource = vds.ds.lookup(dsName)
    if (!datasource) {
      throw vds.exception.newConfigException(
        '实体【' + dsName + '】不存在，请检查配置!'
      )
    }
    var sourceRecordArray = datasource.getAllRecords().toArray()
    if (sourceRecordArray && sourceRecordArray.length > 0) {
      var selectRecodeArray = []
      if (!vds.object.isUndefOrNull(separator)) {
        selectRecodeArray = recordVals.split(separator)
      } else {
        selectRecodeArray.push(recordVals)
      }
      if (selectRecodeArray) {
        if (selectRecodeArray.length > 1) {
          datasource.markMultipleSelect(true) //设置数据源为多选
        }
        var needRecords = [] //保存需要选中的记录
        var recordIndex = 0 //记录数，做下标用
        for (var i = 0; i < sourceRecordArray.length; i++) {
          var targetFileValue = sourceRecordArray[i].get(fileCode)
          if (targetFileValue == null || targetFileValue == '') {
            vds.log.log(
              ERRORNAME +
                '匹配的数据为空，不作处理。该数据id：' +
                sourceRecordArray[i].getSysId()
            )
          } else {
            if (selectRecodeArray.indexOf(targetFileValue) != -1) {
              needRecords[recordIndex] = sourceRecordArray[i]
              recordIndex++
            }
          }
        }
        var resultParam = {}
        resultParam['records'] = needRecords
        resultParam['isSelect'] = type == 'select'
        datasource.selectRecords(resultParam)
      }
    } else {
      vds.log.warn(ERRORNAME + '实体没有记录,不做处理！')
      return null
    }
  }
  return null
}
export { main }
