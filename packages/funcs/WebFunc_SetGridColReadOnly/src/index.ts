/**
 *  设置表格列是否只读
    代码示例：
    SetGridColReadOnly("JGDataGrid1","name,code",true)
    返回值为：无
    参数1：表格控件编码，必填（字符串类型）
    参数2：需要修改的实体字段名，必填（字段串类型，多个字段用英文逗号分隔）
    参数3：是否只读，必填（布尔类型）
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, object, widget }

const main = function (widgetCode: string, fieldStr: string, readOnly: any) {
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
  if (vds.object.isUndefOrNull(readOnly) || readOnly === '') {
    var exception =
      vds.exception.newConfigException('需要设置的只读值不能为空！')
    throw exception
  }

  var fieldList = fieldStr.split(',')
  if (readOnly == 'false' || readOnly == false) {
    readOnly = false
  } else {
    readOnly = true
  }

  const config = vds.widget.getConfigs(widgetCode)
  const controls = config.controls
  for (var i = 0; i < controls.length; i++) {
    const dataBindings = controls[i].dataBindings
    const value = dataBindings[0].dataMembers[0].value
    for (var i = 0; i < fieldList.length; i++) {
      if (fieldList[i] == value) {
        vds.widget.setProperty(value, 'canEdit', readOnly)
      }
    }
  }
}
export { main }
