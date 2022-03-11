import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { ConfigDataUtil as configDataUtil } from '@v-act/vjs.framework.extension.platform.util.config.data'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'

import DefaultProcessor from './DefaultProcessor'

/**
 * @namespace ProcessorManager
 * @module ProcessorManager
 * @desc 处理器管理模块<br/>
 * vjs名称：vjs.framework.extension.platform.services.view.window.property.processor<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.view.window.property.ProcessorManager<br/>
 * @author xiedh
 */
var token = 'PROTOTYPE_METADATA_DATA'

/**
 * 获取原型元信息仓库
 */
var _getStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

export function addDatas(key, value) {
  _getStorage().put(key, value)
}

export function getDatas(key) {
  return _getStorage().get(key)
}

export function genDefaultProcessor(params) {
  return new DefaultProcessor(params)
}

export function getProcessors() {}
export function getWindowProperty(params) {
  if (!params) {
    return
  }
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var controlInfo = params.controlInfo
  if (!componentCode || !windowCode || !controlInfo) {
    return controlInfo
  }
  //优先取配置数据
  var filter = null
  var windowScope = scopeManager.getWindowScope()
  var cond = {}
  if (windowScope) {
    var vjsContext = windowScope.getVjsContext()
    if (vjsContext) {
      filter = {}
      for (var key in vjsContext) {
        if (vjsContext.hasOwnProperty(key)) {
          cond[key] = vjsContext[key]
        }
      }
    }
  }
  cond[configDataUtil.KEYS.COMPONENTCODE] = componentCode
  cond[configDataUtil.KEYS.WINDOWCODE] = windowCode
  var pros = {}
  var allDatas = configDataUtil.getDataSync('WebDesign', cond)
  if (allDatas) {
    for (var i = 0; i < allDatas.length; i++) {
      var allData = allDatas[i]
      if (!allData.datas) {
        continue
      }
      var _data = allData.datas
      var condition = allData.conditions
      var allow = false
      if (filter && jsonUtils.obj2json(filter) != '{}') {
        if (condition) {
          /*with (filter) {
            allow = eval('(' + condition + ')')
          }*/
          throw Error('TODO:未处理异常！')
        }
      } else if (!condition) {
        allow = true
      }
      if (allow) {
        var _data = allData.datas
        for (var key in _data) {
          if (_data.hasOwnProperty(key)) pros[key] = _data[key]
        }
      }
    }
  }
  //打平控件属性集合
  var allControls = {}
  for (var key in pros) {
    var item = pros[key]
    allControls[key] = item
    if (item.fields && item.fields.length > 0) {
      for (var i = 0; i < item.fields.length; i++) {
        var fieldControl = item.fields[i]
        var fCode = fieldControl.code
        var labelText =
          fieldControl.SimpleChineseTitle || fieldControl.simpleChineseTitle
        allControls[fCode] = fieldControl
      }
    }
  }
  var controlObjs = controlInfo.controlsInfo
  for (var key in controlObjs) {
    var controlCode = key
    var valueObj = controlObjs[key]
    var type = valueObj.type
    //格式化小数
    if (allControls[controlCode]) {
      var newName = ''
      if (type == 'JGGroupPanel' || type == 'JGFormLayout') {
        newName = allControls[controlCode].GroupTitle
      } else {
        newName =
          allControls[controlCode].SimpleChineseTitle ||
          allControls[controlCode].simpleChineseTitle
      }
      if (newName) {
        controlObjs[key].LabelText = newName
      }
    }
    if (type == 'JGDataGrid') {
      //处理列表字段标题
      var fields = valueObj.fields
      for (var dkey in fields) {
        var code = fields[dkey].code
        if (allControls[code]) {
          var newControlName =
            allControls[code].SimpleChineseTitle ||
            allControls[code].simpleChineseTitle
          if (newControlName) {
            fields[dkey].name = newControlName
          }
        }
      }
    } else if (type == 'JGTreeGrid') {
      var titleMapping = valueObj.titleMapping
      for (var dkey in titleMapping) {
        var code = titleMapping[dkey].code
        if (allControls[code]) {
          var newControlName =
            allControls[code].SimpleChineseTitle ||
            allControls[code].simpleChineseTitle
          if (newControlName) {
            titleMapping[dkey].name = newControlName
          }
        }
      }
    }
  }
  return controlInfo
}
