/**
 * 函数，根据控件编码获取控件属性值 GetControlProperty("ControlCode","ControlPropertyCode")
 * 参数1：字符串，必填，单个控件编码 参数2：字符串，必填，例如Visible、ReadOnly、Enable、Lable、Value==
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
const vds = { exception, widget, log }

const main = function (widgetCode, propertyName) {
  if (widgetCode == undefined || widgetCode === '') {
    var exception = vds.exception.newConfigException('控件编码不能为空！')
    throw exception
  }
  widgetCode = widgetCode.trim()

  if (propertyName == undefined || propertyName === '') {
    var exception = vds.exception.newConfigException('属性名称不能为空！')
    throw exception
  }
  propertyName = propertyName.trim()

  var widget

  widget = vds.widget.getProperty(widgetCode, 'widgetObj')

  if (widget) {
    var widgetType = vds.widget.getType(widgetCode)

    var PropertyValue = vds.widget.execute(widgetCode, 'get' + propertyName)
    if (PropertyValue == null) {
      var ErrorMsg =
        '[webfunc_GetControlProperty]:获取' +
        widgetCode +
        '(' +
        widgetType +
        ')未找到属性' +
        propertyName +
        '！'
      vds.log.error(ErrorMsg)
    } else {
      return PropertyValue
    }
  } else {
    var ErrorMsg = '[webfunc_GetControlProperty]:未找到控件' + widgetCode + '！'
    vds.log.error(ErrorMsg)
  }
}
export { main }
