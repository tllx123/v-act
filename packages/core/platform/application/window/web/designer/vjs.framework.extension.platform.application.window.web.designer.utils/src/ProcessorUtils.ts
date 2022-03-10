/**
 * 窗体设计器工具类
 * vjs：vjs.framework.extension.platform.application.window.web.designer.utils
 * serverName ： vjs.framework.extension.platform.application.window.web.designer.utils
 * */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetRelation as widgetRelation } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.relation'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'

export function copyMethod(export1, export2) {
  for (var key in export1) {
    if (
      !key ||
      key == 'initModule' ||
      !export1.hasOwnProperty(key) ||
      typeof export1[key] != 'function' ||
      export2.hasOwnProperty(key)
    ) {
      continue
    }
    export2[key] = export1[key]
  }
}
/**
 * 获取默认的设计器属性
 * params
 * {
 * 	series	插件体系
 * 	type	控件类型
 * 	propertyCode	指定属性
 * }
 * */
export function getDefaultDesignProps(params) {
  var datas = {}
  var series = params.series
  var type = params.type
  var metadataService = sandbox.getService(
    'vjs.framework.extension.ui.plugin.' + series + '.metadata.' + type
  )
  if (!metadataService) {
    return datas
  }
  var metadata = metadataService.getMetadata()
  if (!metadata || !metadata.properties) {
    return datas
  }
  var metadataPropertys = metadata.properties
  if (
    typeof metadataService.isNewDevelopMode == 'function' &&
    metadataService.isNewDevelopMode()
  ) {
    metadataPropertys = convert(metadataPropertys) //二次开发格式转换成控件所需的格式
  }
  var propertyCode = params.propertyCode
  if (propertyCode) {
    return metadataPropertys[propertyCode]
  }
  for (var key in metadataPropertys) {
    if (
      !metadataPropertys.hasOwnProperty(key) ||
      !metadataPropertys[key] ||
      !metadataPropertys[key].editor
    ) {
      continue
    }
    datas[key] = metadataPropertys[key]['default']
  }
  return datas
}

/**
 * 窗体设计器转换运行时数据
 * param
 * {
 * widgetNode	控件节点
 * series			插件体系
 * defaultProps ： 指定默认值
 * }
 * */
export function toRuntimeDataByDesign(params) {
  //基础属性
  var widgetPropertys = params.widgetNode
  var propertys = widgetPropertys.Properties
  var datas = {}
  if (propertys) {
    var defaultDesignProp = params.defaultProps
      ? params.defaultProps
      : getDefaultDesignProps({
          series: params.series,
          type: widgetPropertys.WidgetType
        })
    var viewPropData = params.viewlibPropData ? params.viewlibPropData : {}
    for (var key in propertys) {
      if (!defaultDesignProp.hasOwnProperty(key)) {
        continue
      }
      var val = viewPropData.hasOwnProperty(key)
        ? viewPropData[key]
        : defaultDesignProp[key]
      if (val != propertys[key].Value) {
        datas[key] = propertys[key].Value
        if (propertys[key].EditorProperties.Type == 'CriteriaActionSetting') {
          datas[key] = JSON.stringify(datas[key])
        }
      }
    }
    //			for(var key in propertys){
    //				datas[key] = propertys[key].Value;
    //			}
  }
  return datas
}

/**
 * 数组排序
 * */
var arrSort = function (source, target, key, sortCfg) {
  var sort = source
  var sourceDataCodes = []
  var sourceDataMaps = {}
  for (var i = 0, len = sort.length; i < len; i++) {
    var code = sort[i][key]
    if (!code) {
      break
    }
    sourceDataMaps[code] = sort[i]
    sourceDataCodes.push(code)
  }
  target.sort(function (a, b) {
    var ac = a[key]
    var bc = b[key]
    if (!ac || !bc) {
      return 0
    }
    var i = sourceDataCodes.indexOf(ac)
    var i1 = sourceDataCodes.indexOf(bc)
    if (i == -1 || i1 == -1) {
      return 0
    } else {
      return i - i1
    }
  })
  for (var i = 0, len = target.length; i < len; i++) {
    var targetVal = target[i]
    var code = targetVal[key]
    var sourceVal = sourceDataMaps[code]
    if (sourceVal) {
      cloneProps(sourceVal, targetVal, sortCfg)
    }
  }
}

/**
 * 复制属性
 * @param	{Object}	source 来源
 * @param	{Object}	target 目标
 * @param	{Object}	sortCfg 数组排序配置
 * {
 * 	[key]: [code]  "key是需要排序的编码，如tabs、fields...，code是用于排序的编码, 如Code"
 * }
 * */
export function cloneProps(obj, newObj, sortCfg) {
  var newObj = newObj || {}
  if (newObj.constructor == Array) {
    for (var i = 0, len = obj.length; i < len; i++) {
      var val = obj[i]
      if (typeof val == 'object') {
        if (!newObj[i]) {
          newObj[i] = val.constructor === Array ? [] : {}
        }
        if (val.constructor === Array && sortCfg[key]) {
          arrSort(val, newObj[i], sortCfg[key], sortCfg)
        } else {
          cloneProps(val, newObj[i], sortCfg)
        }
      } else {
        newObj[i] = val
      }
    }
  } else {
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue
      }
      if (null != obj[key] && typeof obj[key] == 'object') {
        if (!newObj[key]) {
          newObj[key] = obj[key].constructor === Array ? [] : {}
        }
        if (obj[key].constructor === Array && sortCfg[key]) {
          arrSort(obj[key], newObj[key], sortCfg[key], sortCfg)
        } else {
          cloneProps(obj[key], newObj[key], sortCfg)
        }
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}
/**
 * 处理默认值 防止引用
 * */
export function handleDefaultValue(value) {
  if (value && typeof value == 'object') {
    value = jsonUtils.json2obj(jsonUtils.obj2json(value))
    if (value.constructor != Array && value.editor) {
      value = value['default']
    }
  }
  return value
}
export function genIden(code) {
  var windowScope = scopeManager.getWindowScope()
  return (
    windowScope.getComponentCode() +
    '$_$' +
    windowScope.getWindowCode() +
    '$_$' +
    code
  )
}
/**
 * 获取数据所在的域 统一key使用的地方
 * @param	{Object}	data		设计器的一层数据
 * @param	{Object}	mappings	设计器的全部节点数据
 * @returns	{String}	scopeId		窗体域id
 * */
export function getDataScopeId(data, mappings) {
  var iden = data['_$iden']
  if (mappings[iden]) {
    return mappings[iden].scopeId
  }
  return 'default'
}
/**
 * 根据key获取映射数据，若不传key，则返回相应的映射数据
 * */
export function getDataByKey(data, mappings, key) {
  var iden = data['_$iden']
  var data = mappings[iden]
  if (key) {
    if (data) {
      return data[key]
    }
    return null
  } else {
    return data
  }
}
/**
 * 生成父级格式
 * */
export function genParentFormat(property, assignParentCode) {
  var propertys = genParentFormats([property], assignParentCode)
  return propertys[0]
}
/**
 * 生成父级格式(批量)
 * */
export function genParentFormats(propertys, assignParentCode) {
  var datas = []
  for (var i = 0, len = propertys.length; i < len; i++) {
    var property = propertys[i]
    if (property.iden && property.scopeId && property.property) {
      //已经处理过的节点
      datas.push(property)
      continue
    }
    var code = property.code || property.WidgetCode
    var windowScope = scopeManager.getWindowScope()
    var iden = genIden(code)
    if (property) {
      property['_$iden'] = iden
      if (property.WidgetCode.indexOf(iden) == -1) {
        //此处修改WidgetCode是因为左侧树能同时展示多个窗体
        property.SourceWidgetCode = property.WidgetCode
        property.WidgetCode = iden
      }
    }
    var data = {
      property: property,
      scopeId: windowScope.getInstanceId(),
      iden: iden
    }
    datas.push(data)
    if (assignParentCode) {
      data.parent = assignParentCode
    } else {
      var parent = widgetRelation.getParent(code)
      if (parent) {
        data.parent = genIden(parent)
      }
    }
  }
  return datas
}
/**
 * 还原控件编码
 * */
export function resetWidgetCode(datas) {
  var reset = function (widgets) {
    if (widgets && widgets.length > 0) {
      for (var i = 0, len = widgets.length; i < len; i++) {
        var widget = widgets[i]
        widget.WidgetCode = widget.SourceWidgetCode
        reset(widget.Widgets)
      }
    }
  }
  if (datas && datas.Forms && datas.Forms[0]) {
    reset(datas.Forms[0].Widgets)
  }
}
/**
 * 复制编辑器对象
 * @param {Object} editor
 * */
var copyEditor = function (editor) {
  if (!editor) {
    return editor
  }
  var newEditor = {}
  var editorMap = {
    select: 'Select',
    radioGroup: 'RadioGroup',
    boolean: 'Boolean',
    integer: 'Integer',
    text: 'Text',
    date: 'Date',
    validator: 'Validator'
  }
  for (var key in editor) {
    if (editor.hasOwnProperty(key)) {
      var value = editor[key]
      if (key == 'type' && editorMap.hasOwnProperty(value)) {
        value = editorMap[value]
      } else if (key == 'optionType') {
        key = 'valueMapType'
        value = 'Theme'
      }
      newEditor[key] = value
    }
  }
  return newEditor
}
var genDefine = function (defines) {
  var datas = []
  if (!(defines instanceof Array)) {
    defines = [defines]
  }
  var exist = []
  for (var i = 0, len = defines.length; i < len; i++) {
    var define = defines[i]
    var code = define.code
    if (exist.indexOf(code) != -1) {
      continue
    }
    exist.push(code)
    var propertys = convert(define.properties)
    datas.push(propertys)
  }
  return datas
}
/**
 * 新版二次开发规则的metadata.json数据转换成旧格式
 * @param {Array<Object>} 新配置的属性
 * */
export function convert(propertys) {
  if (!propertys || !(propertys instanceof Array)) {
    return {}
  }
  var newPropertys = {}
  for (var i = 0, len = propertys.length; i < len; i++) {
    var property = propertys[i]
    var code = property.code
    var defaultValue = property['default']
    var editor = property.editor
    if (
      property.access &&
      property.access.webDesigner &&
      property.access.webDesigner.writable === true
    ) {
      defaultValue = {
        default: defaultValue,
        title: property.name,
        editor: copyEditor(editor ? editor : { type: 'text' })
      }
      if (
        property.compatible &&
        property.compatible.enhanceType === 'language'
      ) {
        code = property.compatible.target
          ? property.compatible.target
          : 'SimpleChineseTitle'
      }
    } else if (editor && editor.type == 'children') {
      defaultValue = genDefine(editor.define)
    }
    newPropertys[code] = defaultValue
  }
  return newPropertys
}
