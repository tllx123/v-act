import { ParamConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { ComponentInit as componentInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

const token = 'ApplicationParam_Token_Key'
const WindowMappingKey = 'ApplicationParam_Token_Window_Mapping'

const getStorage = function (depth: string[], isCreate: boolean) {
  let rs,
    s = storageManager.get(storageManager.TYPES.MAP, token)
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    } else {
      return null
    }
  }
  return rs
}

const addRuleSetInputs = function (
  componentCode: string,
  windowCode: string,
  metaCode: string,
  inputs: any
) {
  let storage = getStorage([componentCode, windowCode], true)
  let params = ParamConfigFactory.unSerialize(inputs)
  storage.put(metaCode, params)
}

const getRuleSetInputs = function (
  componentCode: string,
  windowCode: string,
  metaCode: string
) {
  let storage = getStorage([componentCode, windowCode], false)
  if (storage && storage.containsKey(metaCode)) {
    return storage.get(metaCode)
  }
  return null
}

const exists = function (
  componentCode: string,
  windowCode: string,
  metaCode: string
) {
  let storage = getStorage([componentCode, windowCode], false)
  return storage && storage.containsKey(metaCode) ? true : false
}

const getRuleSetInput = function (
  componentCode: string,
  windowCode: string,
  metaCode: string,
  paramCode: string
) {
  let inputs = getRuleSetInputs(componentCode, windowCode, metaCode)
  if (inputs) {
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      if (input.getCode() == paramCode) {
        return input
      }
    }
  }
  return null
}

/**
 * 获取窗体映射仓库
 */
let _getWindowMappingStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, WindowMappingKey)
}

const initWindowMapping = function (mappings) {
  if (mappings && mappings.length > 0) {
    let _storage = _getWindowMappingStorage()
    //目标树,如果没有_parent节点，则为最底层的父窗体
    let targetTree = parseTree(mappings)
    _storage.put('source', mappings) //原始映射信息
    _storage.put('parent', targetTree.parent) //父窗体为根，子窗体为child节点
    _storage.put('child', targetTree.child) //子窗体为根，父窗体为parent节点
    //		   for(var i =0,l=mappings.length;i<l;i++){
    //			   var map = mappings[i];
    //			   var sourceWindowInfo = map.sourceComponentCode + "$_$" + map.sourceWindowCode;
    //			   if(_storage.containsKey(sourceWindowInfo)){//已经存在key
    //				   logUtil.warn("已替换存在的映射关系，key：" + sourceWindowInfo +",原值："+_storage.get(sourceWindowInfo) + ",目标值：" + map.targetComponentCode + "$_$" + map.targetWindowCode);
    //			   }
    //			   _storage.put(sourceWindowInfo,{
    //				   componentCode : map.targetComponentCode,
    //				   windowCode : map.targetWindowCode,
    //				   series:map.targetSeries
    //			   });
    //		   }
  }
}

const addWindowMapping = function (mappings) {
  if (mappings && mappings.length > 0) {
    let _storage = _getWindowMappingStorage()
    let exist = _storage.get('source') //已经存在的映射信息
    if (exist) {
      mappings = mappings.concat(exist)
    }
    //目标树,如果没有_parent节点，则为最底层的父窗体
    let targetTree = parseTree(mappings)
    _storage.put('source', mappings) //原始映射信息
    _storage.put('parent', targetTree.parent) //父窗体为根，子窗体为child节点
    _storage.put('child', targetTree.child) //子窗体为根，父窗体为parent节点
  }
}

const getWindowMapping = function (sourceWindowInfo) {
  //console.log("[getWindowMapping]获取映射关系：" + JSON.stringify(sourceWindowInfo));
  let obj = sourceWindowInfo
  if (check(obj)) {
    let sKey = obj.componentCode + '$_$' + obj.windowCode
    let key = getKey(obj.componentCode, obj.windowCode)
    let _storage = _getWindowMappingStorage()

    let baseNode
    let nodeName

    if (obj.isTarget === true) {
      baseNode = _storage.get('child')
      nodeName = '_parent'
    } else {
      baseNode = _storage.get('parent')
      nodeName = '_child'
    }
    if (null == baseNode) {
      return null
    }
    let exist = true
    let current = baseNode[key]
    if (current) {
      while (exist) {
        let node = current[nodeName]
        if (node) {
          current = node
        } else {
          exist = false
        }
      }
      if (!simple(current, obj)) {
        return current
      }
    }

    //			if(obj.isTarget === true){
    //				baseNode = _storage.get("child")
    //				var infos = parseMappings(_storage).target;
    //				return infos[sKey];
    //			}else if(_storage.containsKey(sKey)){
    //				var arr = _storage.get(sKey);
    //				var result = {
    //					componentCode : arr.componentCode,
    //					windowCode : arr.windowCode,
    //					series: arr.series
    //				}
    //				return result;
    //			}
  }
  return null
}

const getWindowMappingSync = function (sourceWindowInfo) {
  //console.log("[getWindowMappingSync]获取映射关系：" + JSON.stringify(sourceWindowInfo));
  let dtd = $.Deferred()
  let cb = (function (infos, func, _d) {
    return function () {
      let datas = func(infos)
      _d.resolve(datas)
    }
  })(sourceWindowInfo, getWindowMapping, dtd)
  if (sourceWindowInfo.componentCode) {
    componentInit.initComponent({
      componentCode: sourceWindowInfo.componentCode,
      success: cb,
      error: cb
    })
  } else {
    setTimeout(cb, 1)
  }
  return dtd
}

function simple(
  info1: { componentCode: string; windowCode: string },
  info2: { componentCode: string; windowCode: string }
) {
  if (
    info1 &&
    info2 &&
    info1.componentCode == info2.componentCode &&
    info1.windowCode == info2.windowCode
  ) {
    return true
  }
  return false
}
/**
 * 检查参数合法并且刷新窗体映射信息
 * */
let check = function (params: { componentCode: string; windowCode: string }) {
  if (params && params.componentCode && params.windowCode) {
    /* 先刷新配置映射信息 */
    refreshWindowMapping()
    return true
  }
  return false
}

const existWindowMapping = function (params: {
  componentCode: string
  windowCode: string
  isTarget?: boolean
}) {
  if (check(params)) {
    let _storage = _getWindowMappingStorage()
    let key = getKey(params.componentCode, params.windowCode)
    let nodeName
    let baseNode
    if (params.isTarget === true) {
      baseNode = _storage.get('child')
      nodeName = '_parent'
    } else {
      baseNode = _storage.get('parent')
      nodeName = '_child'
    }
    if (baseNode && baseNode[key] && baseNode[key][nodeName]) {
      return true
    }
  }
  return false
}

/**
 * 刷新窗体映射，因为每次访问前都有可能修改了配置信息
 * */
let refreshWindowMapping = function () {
  if (typeof window != 'undefined') {
    //@ts-ignore
    let projectMapping = window._$V3PlatformWindowMapping
    if (projectMapping) {
      let _storage = _getWindowMappingStorage()
      /* 是否新定制的版本 */
      //@ts-ignore
      let newVersion = window._$V3PlatformWindowMapping_iden
      if (true === newVersion) {
        /* 另一个项目定制的窗体映射  */
        if (projectMapping.length > 0) {
          for (let i = 0, l = projectMapping.length; i < l; i++) {
            let mapping = projectMapping[i]
            let sKey =
              mapping.sourceComponentCode + '$_$' + mapping.sourceWindowCode
            _storage.put(sKey, {
              componentCode: mapping.targetComponentCode,
              windowCode: mapping.targetWindowCode,
              series: mapping.series
            })
          }
        }
      } else {
        /* 旧版本窗体映射，只有一个项目定制 */
        let separ = '__' /* 项目定制使用的分隔符 */
        let len = 4 //key根据分隔符切分后的数组长度
        let componentCodeIndex = 1
        let windowCodeIndex = 2
        for (let source in projectMapping) {
          let arr = source.split(separ)
          if (arr && arr.length == len) {
            let sKey = arr[componentCodeIndex] + '$_$' + arr[windowCodeIndex]
            let tKey = projectMapping[source]
            _storage.put(sKey, tKey)
          }
        }
      }
    }
  }
}
let getKey = function (componentCode: string, windowCode: string) {
  return componentCode + '$_$' + windowCode
}
let parseKey = function (key: string) {
  let result = key.split('$_$')
  return {
    componentCode: result[0],
    windowCode: result[1]
  }
}
let parseMappings = function (mappings) {
  let target = {}
  let source = {}
  if (mappings) {
    mappings.iterate(function (key, value) {
      source[key] = value
      let targetKey = getKey(value.componentCode, value.windowCode)
      target[targetKey] = parseKey(key)
    })
  }
  return {
    target: target,
    source: source
  }
}
let getData = function (mapping, treeData, type) {
  let componentCode = mapping[type + 'ComponentCode']
  let windowCode = mapping[type + 'WindowCode']
  let series = mapping[type + 'Series']
  let key = getKey(componentCode, windowCode)
  //子窗体信息
  let result
  if (treeData[key]) {
    result = treeData[key]
  } else {
    result = {
      componentCode: componentCode,
      windowCode: windowCode,
      series: series
    }
    treeData[key] = result
  }
  return result
}
function putData(mapping, datas, type) {
  let baseNode //当前窗体对象
  let nodeName //父/子节点名称
  let targetNode //父/子节点对象
  switch (type) {
    case 'source':
      baseNode = getData(mapping, datas, 'source')
      nodeName = '_child'
      targetNode = getData(mapping, datas, 'target')
      break
    case 'target':
      baseNode = getData(mapping, datas, 'target')
      nodeName = '_parent'
      targetNode = getData(mapping, datas, 'source')
      break
  }

  //父子节点处理
  let sourceNode = baseNode[nodeName]
  if (sourceNode) {
    if (
      sourceNode.componentCode != targetNode.componentCode ||
      sourceNode.windowCode != targetNode.windowCode
    ) {
      //				var e=exceptionFactory.create({
      //					message : "窗体映射信息重复，请检查."
      //				});
      //				e.handle();
      try {
        logUtil.warn(
          '已替换存在的映射关系，' +
            ',原值：' +
            sourceNode.componentCode +
            '.' +
            sourceNode.windowCode +
            ',目标值：' +
            targetNode.componentCode +
            '.' +
            targetNode.windowCode
        )
      } catch (e) {}
    }
  }
  baseNode[nodeName] = targetNode
}
/**
 * 将映射关系转成树结构
 * */
function parseTree(sMaps) {
  let targetTree = {}
  let sourceTree = {}
  if (sMaps && sMaps.length > 0) {
    let removeArray = function (nowMappings, newMappings) {
      for (let i = 0, len = nowMappings.length; i < len; i++) {
        let mapping = nowMappings[i]
        if (mapping instanceof Array) {
          removeArray(mapping, newMappings)
        } else {
          newMappings.push(mapping)
        }
      }
    }
    let mappings = []
    removeArray(sMaps, mappings) //后台生成窗体映射信息时，多嵌套了一层数组Task20200903009
    for (let i = 0, len = mappings.length; i < len; i++) {
      let mapping = mappings[i]
      let componentCode = mapping.targetComponentCode
      let windowCode = mapping.targetWindowCode
      let sourceComponentCode = mapping.sourceComponentCode
      let sourceWindowCode = mapping.sourceWindowCode
      let tKey = getKey(componentCode, windowCode)
      let sKey = getKey(sourceComponentCode, sourceWindowCode)
      putData(mapping, targetTree, 'target')
      putData(mapping, sourceTree, 'source')
    }
  }
  return {
    parent: sourceTree,
    child: targetTree
  }
}
export {
  addRuleSetInputs,
  addWindowMapping,
  exists,
  existWindowMapping,
  getRuleSetInput,
  getRuleSetInputs,
  getWindowMapping,
  getWindowMappingSync,
  initModule,
  initWindowMapping
}
