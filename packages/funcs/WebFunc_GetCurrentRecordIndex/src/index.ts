import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
/**
 *
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'

const vds = { exception, ds, expression }

const main = function (tableName: string) {
  /*
   * 先根据参数获取数据眼
   * 再调用数据源的getSelectedRecords方法获取选中行
   * 最后调用选中行的getSysId方法获取Id的值
   * */
  //获取函数传入的参数
  if (tableName == null || tableName == '') {
    throw vds.exception.newConfigException(
      '函数[GetCurrentRecordIndex]参数不能为空'
    )
  }
  var result = ''
  //获取数据源
  var datasource = GetDataSource(tableName)
  //获取选中行记录
  var records = datasource.getSelectedRecords().toArray()
  if (records.length > 0) {
    result = records[0].getSysId()
  } else {
    throw vds.exception.newConfigException(
      '函数[GetCurrentRecordIndex]获取不到选中记录，选中记录行数：' +
        records.length
    )
  }
  return result
}

/*
 * 获取对应数据源
 * dsName 实体编码
 * */
function GetDataSource(dsName: string) {
  //获取数据源
  /*
   * 先根据名称直接判断是不是属于数据源对象
   * 再判断是否是活动集实体
   * */
  var datasource = null
  if (vds.ds.isDatasource(dsName)) {
    //判断是否已经属于数据源对象
    datasource = dsName
  } else {
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      //不是活动集实体
      datasource = vds.ds.lookup(dsName)
    } else {
      //是活动集实体
      //@ts-ignore
      datasource = vds.expression.excute(dsName)
    }
  }
  if (!datasource) {
    throw vds.exception.newConfigException(
      '找不到函数[GetCurrentRecordIndex]参数中的实体！'
    )
  }
  return datasource
}
export { main }
