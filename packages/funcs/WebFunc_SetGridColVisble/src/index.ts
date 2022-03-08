/** 
 * 设置表格列显示/隐藏
 * 代码示例：
 * SetGridColVisble("JGDataGrid1","name,code",true)
 * 返回值为：无
    参数1：表格控件编码，必填（字符串类型）
    参数2：需要修改的实体字段名，必填（字段串类型，多个字段用英文逗号分隔）
    参数3：是否显示，必填（布尔类型）
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, object, widget }

const main = function (widgetCode, fieldStr, visible) {
  //获取函数传入的参数
  if (vds.object.isUndefOrNull(widgetCode) || widgetCode === '') {
    var exception = vds.exception.newConfigException('列表控件名不能为空！')
    throw exception
  }
  if (vds.object.isUndefOrNull(fieldStr) || fieldStr === '') {
    var exception =
      vds.exception.newConfigException('需要设置的字段名不能为空！')
    throw exception
  }
  if (vds.object.isUndefOrNull(visible) || visible === '') {
    var exception =
      vds.exception.newConfigException('需要设置的显示值不能为空！')
    throw exception
  }
  var widget = vds.widget.getProperty(widgetCode, 'widgetObj')
  var fieldList = fieldStr.split(',')
  if (visible == 'false' || visible == false) {
    visible = false
  } else {
    visible = true
  }
  for (var i = 0; i < fieldList.length; i++) {
    var field = widget.getFieldByName(fieldList[i])
    if (field) {
      if (visible) {
        widget._widget.showField(field)
      } else {
        widget._widget.hideField(field)
      }
    }
  }
}
export { main }
