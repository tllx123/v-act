import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as widgetMapping } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

let undefined
let undefined
let undefined

exports.initModule = function (sb) {
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let entityName
  let indexNum = 0
  entityName = args[0]
  if (args.length > 1) {
    indexNum = args[1]
  }
  if (entityName == undefined || entityName === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体名不能为空！'
    })
    throw exception
  }

  if (indexNum == undefined) {
    indexNum = 0
  }
  indexNum = parseInt(indexNum, 10)
  if (isNaN(indexNum)) {
    indexNum = 0
  }
  if (Number(indexNum) < 0) indexNum = 0

  let widgetCodes = []
  let gridlists = []
  let widgetCode = ''
  let widget

  widgetCodes = widgetMapping.getWidgetCodesByDatasourceName({
    datasourceName: entityName
  })

  if (widgetCodes.length > 0) {
    widgetCodes.sort()
    for (let i = 0; i < widgetCodes.length; i++) {
      widget = widgetContext.get(widgetCodes[i], 'widgetObj')
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
