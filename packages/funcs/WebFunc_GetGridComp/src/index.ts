/**
 *  根据实体名获取表格控件(列表+树表)编码
    代码示例：
    GetGridComp("book",1)
    返回值为："JGDataGrid1"
    参数1：实体名，必填(字符串类型)
    参数2：下标，选填(整型,不填的话默认为0)
    返回值为字符串类型
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { exception, widget }

const main = function (
  entityName: string,
  indexNum: string | number | undefined
) {
  if (entityName == undefined || entityName === '') {
    var exception = vds.exception.newConfigException('实体名不能为空！')
    throw exception
  }

  if (indexNum == undefined) {
    indexNum = 0
  }
  indexNum = parseInt(indexNum as string, 10)
  if (isNaN(indexNum)) {
    indexNum = 0
  }
  if (Number(indexNum) < 0) indexNum = 0

  var widgetCodes = []
  var gridlists = []
  var widgetCode = ''
  var widget

  //@ts-ignore
  widgetCodes = vds.widget.getWidgetCodes(entityName)

  if (widgetCodes.length > 0) {
    widgetCodes.sort()
    for (var i = 0; i < widgetCodes.length; i++) {
      widget = vds.widget.getProperty(widgetCodes[i], 'widgetObj')
      if (
        widget.type.toUpperCase() == 'JGDataGrid'.toUpperCase() ||
        widget.type.toUpperCase() == 'JGTreeGrid'.toUpperCase()
      ) {
        gridlists.push(widgetCodes[i])
      }
    }
  }
  if (gridlists.length > 0) {
    if (Number(indexNum) > 0) {
      if (Number(indexNum) < gridlists.length - 1) {
        widgetCode = gridlists[indexNum]
      } else {
        widgetCode = gridlists[gridlists.length - 1]
      }
    } else {
      widgetCode = gridlists[0]
    }
  }
  return widgetCode
}
export { main }
