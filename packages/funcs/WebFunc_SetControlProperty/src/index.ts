/**
函数，根据控件编码修改控件属性
SetControlProperty("ControlCodeList","ControlPropertyCode","Value")
参数1：字符串，必填，多个控件编码逗号间隔
参数2：字符串，必填，例如Visible、ReadOnly、Enable、Lable、Value==
参数3：字符串，必填
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { exception, log, widget, object }

const main = function (controls:string, propertyName:string, propertyValue:string) {
  if (vds.object.isUndefOrNull(controls)) {
    var exception = vds.exception.newConfigException('控件编码不能为空！')
    throw exception
  }
  controls = controls.trim()

  if (vds.object.isUndefOrNull(propertyName)) {
    var exception = vds.exception.newConfigException('属性名称不能为空！')
    throw exception
  }
  propertyName = propertyName.trim()

  if (vds.object.isUndefOrNull(propertyValue)) {
    var exception = vds.exception.newConfigException('属性值不能为空！')
    throw exception
  }

  var widget
  var widgetCode = ''
  var ControlList = controls.split(',')
  for (var i = 0; i < ControlList.length; i++) {
    widgetCode = ControlList[i].trim()
    widget = vds.widget.getProperty(widgetCode, 'widgetObj')
    if (widget) {
      try {
        vds.widget.execute(widgetCode, 'set' + propertyName, [propertyValue])
      } catch (e) {
        var widgetType = vds.widget.getType(widgetCode)
        var chineseTitleName = vds.widget.execute(
          widgetCode,
          'SimpleChineseTitle'
        )
        vds.log.warn(
          '[webfunc_SetControlProperty]:设置' +
            widgetCode +
            '(' +
            widgetType +
            ')属性' +
            propertyName +
            '值' +
            propertyValue +
            '出错。'
        )
      }
    }
  }
}
export { main }
