/**
    函数FindControl(EntityName，FieldName, ControlType，Index）获取控件编码
    参数1：字符串，必填，实体名
    参数2：字符串，必填，字段名
    参数3：字符串，选填，控件类型，例如TGButton\TGTreeView.....
    参数4：整型，选填，下标从0开始，如果找到多个控件，返回第X个，需要容错处理，如果下标超过实际匹配的控件个数时，返回最后一个，小于0时，返回所有找到的控件且控件编码逗号分割		
    注意：如果没符合条件的控件，返回""空字符串，如果找到多个符合条件的控件，指按照下标返回第N个（注意容错），如果未指定下标，返回多个控件编码，逗号间隔
    实例：
    FindControl("UserInfo","","TGTextBox",0) --获取界面上绑定UserInfo实体的第1个TGTextBox控件
    FindControl("UserInfo","UserCode","TGTextBox",0) --获取界面上绑定UserInfo实体字段名UserCode的第2个TGTextBox控件，如果界面上仅找到1个符合条件的控件返回第1个控件编码
    FindControl("UserInfo","UserCode","TGTextBox",99) --获取界面上绑定UserInfo实体字段名UserCode的TGTextBox控件，如果未找到返回空，如果符合条件控件但是小于99个，返回最后一个控件
    FindControl("UserInfo","UserCode","",0) --获取界面上绑定UserInfo实体字段名UserCode的第2个控件，如果界面上仅找到1个符合条件的控件返回第1个控件编码
    FindControl("UserInfo","UserCode",-1) --获取界面上绑定UserInfo实体字段名UserCode的第一个控件，不区分控件类型，如果未指定下标，返回多个控件编码，逗号间隔
    FindControl("UserInfo","UserCode") --等效FindControl("UserInfo","UserCode") 
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { exception }

vds.import('vds.widget.*')
const main = function (entityName, fieldName, controlType, indexNum) {
  if (entityName == undefined || entityName === '') {
    var exception = vds.exception.newConfigException('实体名不能为空！')
    throw exception
  }

  if (fieldName == undefined) {
    fieldName = ''
  }
  fieldName = fieldName.trim()
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

  var widgetCodes = []
  var controlList = []
  var ControlCode = ''
  var widget

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

  // widgetCodes = widgetMapping.getWidgetCodesByFieldCode({
  //     "datasourceName": entityName,
  //     "fieldCode": fieldName
  // });

  widgetCodes = vds.widget.getWidgetCodes(entityName, fieldName)

  //modify by zhangLazarus 2019-11-27 不指定控件类型
  widgetCodes.sort()
  if (controlType === '') {
    controlList = widgetCodes
  } else if (widgetCodes.length > 0) {
    for (var i = 0; i < widgetCodes.length; i++) {
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
