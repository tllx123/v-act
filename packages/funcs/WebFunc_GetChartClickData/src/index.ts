/**
 * GetChartClickData(获取图表点击时的数据,用于2D图表) 
 代码示例:GetChartClickData("JGChart2","value")  返回值为：119
 参数数量:2
 参数1(字符串类型，必填，图表构件编码)
 参数2(字符串类型，必填，需要的字段编码）
 返回值为字符串类型
 注意：参数2中可以使用到的字段编码包括：
      seriesName ：图例值
      value：纵坐标值
      name: 横坐标值
      data: 纵坐标值
      color:条码颜色
 * 
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, widget }

const main = function (widgetCode, fieldCode) {
  //图表构件编码
  if (!widgetCode || '' == widgetCode) {
    var exception = vds.exception.newConfigException(
      '函数第一个参数,图表控件编码不能为空!'
    )
    throw exception
  }
  //实体字段编码
  if (!fieldCode || '' == fieldCode) {
    var exception = vds.exception.newConfigException(
      '函数第二个参数,图表的字段编码不能为空!'
    )
    throw exception
  }
  var relValue = ''
  var widget = vds.widget.getProperty(widgetCode, 'widgetObj')
  var barClickData = widget.clickBarData
  if (barClickData && barClickData != null && barClickData != undefined) {
    for (var barCode in barClickData) {
      if (barCode == fieldCode) {
        relValue = barClickData[barCode]
        break
      }
    }
  }

  return relValue
}
export { main }
