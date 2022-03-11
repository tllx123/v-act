/**
 *
 *
 */
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { widget }

const main = function (widgetId: string, columnName: string) {
  var widget = vds.widget.getProperty(widgetId, 'widgetObj')
  if (widget && columnName) {
    var field = widget.lastClickField
    if (field && field.remark && field.remark.identityValues) {
      return field.remark.identityValues[columnName]
    }
  }
  return null
  //...
  //根据参数实现函数处理逻辑
  //todo:
}
export { main }
