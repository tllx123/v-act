/**
 * 实体字段属性处理器
 * */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetModule as widgetModule } from '@v-act/vjs.framework.extension.ui.plugin.manager'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

var componentDisplayFormat = {}

var getComponentDisplayFormat = function (componentCode) {
  var dtd = $.Deferred()
  var format = componentDisplayFormat[componentCode]
  if (format) {
    setTimeout(function () {
      dtd.resolve(format)
    }, 1)
  } else {
    $.ajax({
      url: 'webapi/innersysapi/frontend/getComponentDisplayFormat',
      data: {
        componentCodes: componentCode
      },
      success: function (datas) {
        if (datas && datas.data && datas.data.data && datas.data.data[0]) {
          var format = datas.data.data[0].displayFormatSettings
          if (format) {
            componentDisplayFormat[componentCode] = format
            format = jsonUtils.json2obj(format)
          }
          dtd.resolve(format)
        } else {
          dtd.resolve(null)
        }
      },
      error: function (msg) {
        logUtil.error('获取构件格式的api执行失败：' + msg && msg.statusText)
        dtd.resolve(null)
      }
    })
  }
  return dtd
}

/**
 * 处理显示格式(兼容旧版，等业务构件全部重新发布后，可以删除调用此方法的调用逻辑)
 * params	{Object}	生成vjs的数据
 * */
export function process(params) {
  var windowScope = scopeManager.getWindowScope()
  var componentCode = windowScope.getComponentCode()
  var windowCode = windowScope.getWindowCode()
  var propertys = params.propertys
  var widgets = windowScope.getWidgets()
  var renderDatas = params.renderDatas
  if (
    params.componentCode == componentCode &&
    windowCode == params.windowCode &&
    renderDatas &&
    widgets
  ) {
    return exports.processNew({
      componentCode: componentCode,
      windowCode: windowCode,
      datas: renderDatas
    })
  } else {
    var dtd = $.Deferred()
    setTimeout(function () {
      dtd.resolve()
    }, 1)
    return dtd
  }
}

/**
 * 处理显示格式
 * params	{Object}	生成vjs的数据
 * {
 * 	componentCode : "构件编码",//为空时从当前域获取
 * 	windowCode	: "窗体编码",//为空时从当前域获取
 * 	datas  :	货币格式数据
 * 		{
 * 			entityCode : {
 * 				currentFieldCode : "unitPrice/currency/quantity"
 * 			}
 * 		}
 * }
 * */
export function processNew(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var windowScope = scopeManager.getWindowScope()
  if (!componentCode || !windowCode) {
    componentCode = windowScope.getComponentCode()
    windowCode = windowScope.getWindowCode()
  }
  var renderDatas = params.datas
  var propertys = params.propertys
  var widgets = windowScope.getWidgets()
  var dtd = $.Deferred()
  if (renderDatas && widgets) {
    var d = getComponentDisplayFormat(componentCode)
    var callback = scopeManager.createScopeHandler({
      handler: function (format) {
        var currencyFields = {}
        for (var code in renderDatas) {
          var rd = renderDatas[code]
          if (typeof rd != 'string') {
            //可能有字符串的componentCode和windowCode
            var entity = {}
            for (var key in rd) {
              entity[key] = getFormatInfo(rd[key], format)
            }
            currencyFields[code] = entity
          }
        }
        //保存起来，等SetToolBarText处理
        windowScope.setCurrencyField(currencyFields)
        for (var widgetCode in widgets) {
          var widget = widgets[widgetCode]
          var type = widget.type
          if (!type) {
            continue
          }
          switch (type) {
            case 'JGDataGrid':
              var tableName = widget.SourceTableName
              if (currencyFields.hasOwnProperty(tableName)) {
                processDataGrid(widget, currencyFields[tableName])
              }
              break
            case 'JGTreeGrid':
              var tableName = widget.SourceTableName
              if (currencyFields.hasOwnProperty(tableName)) {
                processTreeGrid(widget, currencyFields[tableName])
              }
              break
            case 'JGFormLayout':
            case 'JGQueryConditionPanel':
              var widgetType = widget.type
              if (
                window.isc &&
                window.isc[widgetType] &&
                window.isc[widgetType].processFormLayout
              ) {
                window.isc[widgetType].processFormLayout(widget, currencyFields)
                break
              }
              var initor = getWidgetRender(widgetType)
              if (!initor) continue
              if (initor && initor.processFormLayout) {
                initor.processFormLayout(widget, renderDatas)
              } else {
                processFormLayout(widget, currencyFields)
              }
              break
            case 'JGChart':
              var tableName = widget.SourceTableName
              if (currencyFields.hasOwnProperty(tableName)) {
                processJGChart(widget, currencyFields[tableName])
              }
              break
            case 'JGFloatBox':
              var fieldData = currencyFields[widget.SourceTableName]
              if (
                fieldData &&
                fieldData[widget.ColumnName] &&
                widget.DisplayFormat
              ) {
                var data = fieldData[widget.ColumnName]
                widget.DisplayFormat.numType = data.numType
                widget.DisplayFormat.displayFormat = data.displayFormat
              }
              break
            default:
              break
          }
        }
        dtd.resolve()
      }
    })
    d.then(callback)
  } else {
    setTimeout(function () {
      dtd.resolve()
    }, 1)
  }
  return dtd
}

var getWidgetRender = function (widgetType) {
  var initor = widgetModule.get(widgetType)
  /* 不存在render或者控件已经经过二开改造的，都统一用静态方法 */
  if (!initor || (initor.isNewDevelopMode && initor.isNewDevelopMode())) {
    initor = isc[widgetType]
  }
  return initor
}
//	var getForamtInfoOld = function (type, formats) {
//		var info = null;
//		var datas = {}
//		if(formats){
//			for(var i = 0,len = formats.length;i<len;i++){
//				var format = formats[i];
//				if(format.type){
//					datas[format.type] = format;
//				}
//			}
//		}
//		var numType;
//		var displayFormat;
//		var data = datas[type];
//		var thousandChar = data && data.showThousandChar || type != "quantity" ? "#,##0" : "#0";
//		var showTail = data && data.showTail ? "#" : "0";
//		var currencyChar = data && data.currencyChar ? data.currencyChar : "";
//		var decimalDigit = data && data.decimalDigit
//		switch (type) {
//			case "quantity":
//				var displayFormat = "#0.000;-#0.000|0";
//				info = {
//					numType: 1,
//					displayFormat: displayFormat
//				};
//				break;
//			case "unitPrice":
//			case "currency":
//				info = {
//					numType: 2,
//					displayFormat: "#,##0.00;-#,##0.00|0"
//				};
//				break;
//			case "T10DCurrency":
//				info = {
//					numType: 9,
//					displayFormat: "#,##0.0000;-#,##0.0000|0"
//				};
//		}
//		return info;
//	}
var getFormatInfo = function (type, formats) {
  var info = null
  var datas = {}
  if (formats) {
    for (var i = 0, len = formats.length; i < len; i++) {
      var format = formats[i]
      if (format.type) {
        datas[format.type] = format
      }
    }
  }
  var numType //类型
  var thousandChar //千分位值
  var showTail = '0' //小数位字符
  var decimalDigit //小数位数
  var currencyChar = '' //货币符号
  switch (type) {
    case 'quantity':
      //			displayFormat = "#0.000;-#0.000|0";
      numType = 1
      thousandChar = '#0'
      decimalDigit = 3
      break
    case 'unitPrice':
    case 'currency':
      numType = 2
      //			displayFormat = "#,##0.00;-#,##0.00|0";
      thousandChar = '#,##0'
      decimalDigit = 2
      break
    case 'T10DCurrency':
      numType = 9
      //			displayFormat = "#,##0.0000;-#,##0.0000|0";
      thousandChar = '#,##0'
      decimalDigit = 4
  }
  var data = datas[type]
  if (numType) {
    if (data) {
      if (false === data.showThousandChar) {
        thousandChar = '#0'
      } else {
        thousandChar = '#,##0'
      }
      if (false === data.showTail) {
        showTail = '#'
      }
      if (data.currencyChar) {
        currencyChar = data.currencyChar
      }
      if (typeof data.decimalDigit == 'number') {
        decimalDigit = data.decimalDigit
      }
    }
    var xs = []
    for (var i = 0; i < decimalDigit; i++) {
      xs.push(showTail)
    }
    var displayFormat = currencyChar + thousandChar + '.' + xs.join('')
    info = {
      numType: numType,
      displayFormat: displayFormat + ';-' + displayFormat + '|0'
    }
  }
  return info
}
/**
 * 处理列表子列的显示格式
 * */
var processDataGrid = function (widget, infos) {
  //后续可抽提到每个控件
  var fields = widget.fields
  if (!fields) {
    return
  }
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i]
    var format = infos[field.name]
    if (format) {
      //				format = format["displayFormat"];
      var _displayFormatCfg = field._displayFormatCfg
      if ('' != _displayFormatCfg && typeof _displayFormatCfg == 'object') {
        field._displayFormatCfg.displayFormat = format['displayFormat']
        field._displayFormatCfg.numType = format.numType
        //					if (format === "#,##0.0000;-#,##0.0000|0") {
        //						field._displayFormatCfg.numType = 9;
        //					} else {
        //						field._displayFormatCfg.numType = format == "quantity" ? 1 : 2;
        //					}
      }
    }
  }
}

/**
 * 处理树表子列的显示格式
 * */
var processTreeGrid = function (widget, infos) {
  //后续可抽提到每个控件
  var fields = widget.fields
  if (!fields) {
    return
  }
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i]
    //			var format = getFormatInfo(infos[field.name]);
    var format = infos[field.name]
    if (format) {
      //				format = format["displayFormat"];
      var _displayFormatCfg = field._displayFormatCfg
      if ('' != _displayFormatCfg && typeof _displayFormatCfg == 'object') {
        field._displayFormatCfg.displayFormat = format['displayFormat']
        field._displayFormatCfg.numType = format.numType
        //					if (format === "#,##0.0000;-#,##0.0000|0") {
        //						field._displayFormatCfg.numType = 9;
        //					} else {
        //						field._displayFormatCfg.numType = format == "quantity" ? 1 : 2;
        //					}
      }
    }
  }
}

/**
 * 处理表单子列的显示格式
 * */
var processFormLayout = function (widget, infos) {
  //后续可抽提到每个控件
  var fields = widget.fields
  if (!fields) {
    return
  }
  for (var i = 0, len = fields.length; i < len; i++) {
    var field = fields[i]
    var info = infos[field.SourceTableName]
    if (!info) continue
    //			var format = getFormatInfo(info[field.ColumnName]);
    var format = info[field.ColumnName]
    if (format) {
      //				format = format["displayFormat"];
      var _displayFormatCfg = field.DisplayFormat
      if ('' != _displayFormatCfg && typeof _displayFormatCfg == 'object') {
        field._displayFormatCfg.displayFormat = format['displayFormat']
        field._displayFormatCfg.numType = format.numType
        //					if (format === "#,##0.0000;-#,##0.0000|0") {
        //						field._displayFormatCfg.numType = 9;
        //					} else {
        //						field._displayFormatCfg.numType = format == "quantity" ? 1 : 2;
        //					}
      }
    }
  }
}

var processJGChart = function (widget, infos) {
  //后续可抽提到每个控件
  var fields = []
  for (var key in infos) {
    fields.push({
      name: key,
      pattern: infos[key].displayFormat,
      numType: infos[key].numType
    })
  }
  widget.fields = fields
}
/**
 * 单个控件的场景
 * */
var defaultProcess = function (widget, info) {}
