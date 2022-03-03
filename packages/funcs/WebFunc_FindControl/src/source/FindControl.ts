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
  //debugger;

  //获取函数传入的参数
  let args = param.getArgs()

  if (param == undefined || args.length < 2) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message:
        '函数FindControl参数不能少于2个，当前' +
        args.length +
        '个！' +
        args.toString()
    })
    throw exception
  }

  let entityName = args[0] //实体编码
  let fieldName = args[1] //字段编码
  let controlType = args[2] //控件类型
  let indexNum = args[3] //下标

  if (entityName == undefined || entityName === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '实体名不能为空！'
    })
    throw exception
  }

  if (fieldName == undefined) {
    fieldName = ''
  }
  fieldName = fieldName.trim()

  //modify by zhangLazarus 2019-11-27 允许控件类型为空
  /*if(controlType == undefined || controlType === "") {
        var exception = factory.create({
            "type": factory.TYPES.Dialog,
            "message": "控件类型不能为空！"
        });
        throw exception;
    }
    */

  if (controlType == undefined) {
    controlType = ''
  }

  if (indexNum == undefined) {
    indexNum = -1
  }

  indexNum = parseInt(indexNum, 10)
  if (isNaN(indexNum)) {
    indexNum = -1
  }

  let widgetCodes = []
  let controlList = []
  let ControlCode = ''
  let widget

  //		if(fieldName.length == 0) {
  //			widgetCodes = widgetMapping.getWidgetCodesByDatasourceName({
  //				"datasourceName": entityName
  //			});
  //		} else {
  //			widgetCodes = widgetMapping.getWidgetCodesByFieldCode({
  //				"datasourceName": entityName,
  //				"fieldCode": fieldName
  //			});
  //		}

  widgetCodes = widgetMapping.getWidgetCodesByFieldCode({
    datasourceName: entityName,
    fieldCode: fieldName
  })

  //modify by zhangLazarus 2019-11-27 不指定控件类型
  widgetCodes.sort()
  if (controlType === '') {
    controlList = widgetCodes
  } else if (widgetCodes.length > 0) {
    for (let i = 0; i < widgetCodes.length; i++) {
      ControlCode = widgetCodes[i]
      widget = widgetContext.get(ControlCode, 'widgetObj')

      if (
        widget.type.toUpperCase() == controlType.toUpperCase() ||
        widget.type.toUpperCase() ==
          controlType.toUpperCase().replace('JG', 'V') ||
        'JG' + widget.type.toUpperCase() == controlType.toUpperCase()
      )
        controlList.push(ControlCode)
    }
  }

  //modify by zhangLazarus 2019-11-27 返回所控件编码，逗号间隔
  if (indexNum < 0) {
    ControlCode = controlList.join(',')
    return ControlCode
  }

  ControlCode = ''
  if (controlList.length > 0) {
    if (Number(indexNum) > controlList.length - 1)
      indexNum = controlList.length - 1

    ControlCode = controlList[Number(indexNum)]
  }

  return ControlCode
}

export { main }
