/**
 * GetWidgetSize("WidgetCode", "height/width") 返回数值
 * 暂时只支持普通窗体面板和流布局
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { exception, widget, object }

const main = function (widgetCode: string, valueCode: string) {
  if (!widgetCode)
    throw vds.exception.newConfigException(
      '函数 GetWidgetSize 第一个参数，控件Code不能为空！'
    )

  if (!valueCode || (valueCode !== 'height' && valueCode !== 'width'))
    throw vds.exception.newConfigException(
      '函数 GetWidgetSize 第二个参数，属性 Code 必须为 height 或者 width！'
    )

  if (vds.object.isUndefOrNull(valueCode)) return 0
  else return vds.widget.execute(widgetCode, _genActionMethodName(valueCode))
}
export { main }

var _genActionMethodName = function (codeName: string) {
  return 'get' + codeName.substring(0, 1).toUpperCase() + codeName.substring(1)
}
