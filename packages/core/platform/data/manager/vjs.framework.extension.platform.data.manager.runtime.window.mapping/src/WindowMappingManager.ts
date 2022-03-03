import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let Datasource_Token = 'WINDOW_MAPPING_DATASOURCE',
  Inputs_Token = 'WINDOW_MAPPING_INPUTS',
  Outputs_Token = 'WINDOW_MAPPING_OUTPUTS',
  Controls_Token = 'WINDOW_MAPPING_CONTROLS',
  token = 'WINDOW_INSTANCE_DATASOURCE',
  Ruleset_Token = 'WINDOW_MAPPING_RULESET'

exports.initModule = function (sb) {}
/**
 * 获取数据源映射仓库
 */
let _getDatasourceStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, Datasource_Token)
}

/**
 * 获取规则链映射仓库
 */
let _getRulesetStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, Ruleset_Token)
}

/**
 * 获取窗体输入映射仓库
 */
let _getInputsStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, Inputs_Token)
}

/**
 * 获取控件属性映射仓库
 */
let _getControlsStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, Controls_Token)
}

/**
 * 获取窗体输出映射仓库
 */
let _getOutputsStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, Outputs_Token)
}

exports.TYPE = {
  DATASOURCE: 'datasource', //实体信息
  RULESET: 'ruleset', //规则链信息
  CONTROLS: 'controls', //控件属性
  INPUTS: 'inputs', //窗体输入变量
  OUTPUTS: 'outputs' //窗体输出变量
}

const existMapping = function (params) {
  let scope = scopeManager.getWindowScope()
  let extendId = scope.getExtendId()
  if (null == extendId) {
    //如果没有父级，就没有映射
    return false
  }
  let key = scope.getComponentCode() + '$_$' + scope.getWindowCode()
  let storage
  let type = params.type
  switch (type) {
    case exports.TYPE.DATASOURCE:
      storage = _getDatasourceStorage()
      break
    case exports.TYPE.RULESET:
      storage = _getRulesetStorage()
      break
    case exports.TYPE.CONTROLS:
      storage = _getControlsStorage()
      break
    case exports.TYPE.INPUTS:
      storage = _getInputsStorage()
      break
    case exports.TYPE.OUTPUTS:
      storage = _getOutputsStorage()
      break
  }
  if (storage && storage.containsKey(key)) {
    let infos = storage.get(key)
    let newCode = findCode(infos, params.code)
    if (null != newCode) {
      return true
    }
  }
  return false
}

const init = function (params) {
  //格式：构件编号$_$窗体编号
  let key = getKey(params)
  // 处理数据源映射信息
  put(_getDatasourceStorage(), key, params.datasource)

  //处理规则方法映射信息
  put(_getRulesetStorage(), key, params.rulesets)

  // 处理窗体输入变量映射信息
  put(_getInputsStorage(), key, params.inputs)

  //处理方法输出变量映射信息
  put(_getOutputsStorage(), key, params.outputs)

  //处理控件属性映射信息
  put(_getControlsStorage(), key, params.controls)
}

/**
 * 获取映射信息
 * @param 类型
 * @param {Object} params
 * @returns 存在映射，返回映射的规则编码，不存在，则返回空
 * */
let _get = function (type, params) {
  let result
  let storage
  switch (type) {
    case exports.TYPE.RULESET:
      storage = _getRulesetStorage()
      break
    case exports.TYPE.INPUTS:
      storage = _getInputsStorage()
      break
    case exports.TYPE.OUTPUTS:
      storage = _getOutputsStorage()
      break
  }
  if (storage) {
    let key = getKey(params)
    if (storage.containsKey(key)) {
      let infos = storage.get(key)
      let code = params.code
      return findCode(infos, code)
    }
  }
  return result
}

const getRuleset = function (params) {
  params.code = params.ruleSetCode
  return _get(exports.TYPE.RULESET, params)
  //		var key = getKey(params);
  //		var storage = _getRulesetStorage();
  //		if(storage.containsKey(key)){
  //			var infos = storage.get(key);
  //			var ruleSetCode = params.ruleSetCode;
  //			return findCode(infos, ruleSetCode);
  //		}
  //		return null;
}

const getInput = function (params) {
  params.code = params.inputCode
  return _get(exports.TYPE.INPUTS, params)
  //		var key = getKey(params);
  //		var storage = _getInputsStorage();
  //		if(storage.containsKey(key)){
  //			var infos = storage.get(key);
  //			var inputCode = params.inputCode;
  //			return findCode(infos, inputCode);
  //		}
  //		return null;
}

const getOutput = function (params) {
  params.code = params.outputCode
  return _get(exports.TYPE.OUTPUTS, params)
  //		var key = getKey(params);
  //		var storage = _getOutputsStorage();
  //		if(storage.containsKey(key)){
  //			var infos = storage.get(key);
  //			var outputCode = params.outputCode;
  //			return findCode(infos, outputCode);
  //		}
  //		return null;
}

const existPropertyMapping = function (params) {
  let widgetCode = params.widgetCode
  let key = getKey(params)
  let storage = _getControlsStorage()
  if (storage.containsKey(key)) {
    let infos = storage.get(key)
    if (infos.hasOwnProperty(widgetCode)) {
      let propertys = infos[widgetCode]
      if (propertys && propertys.indexOf(params.propertyCode) != -1) {
        return true
      }
    }
  }
  return false
}

const getDataSource = function (datasourceName) {
  let dsName = datasourceName
  let scope = scopeManager.getScope()
  //liangzc：处理移动窗体替换后，图片控件更改了图片资源，导致页面打不开的情况，测试过之前的问题【处理窗体替换中控件不绑定实体时给控件赋值无效的问题】，也能通过。
  //		//暂且以此开头作为虚拟实体
  //		if(false&&datasourceName && datasourceName.indexOf("virtualDB_") == 0){
  //			var childId = scope.getChildId();
  //			if(childId != null){
  //				scope = scopeManager.getScope(childId);
  //			}
  //		}else{
  //		}
  let key = scope.getComponentCode() + '$_$' + scope.getWindowCode()
  let extendId = scope.getExtendId()
  //不存在父窗体
  if (extendId != null) {
    //获取数据源映射信息
    let storage = _getDatasourceStorage()
    //如果映射信息中，包含有
    if (storage.containsKey(key)) {
      let infos = storage.get(key)
      let newDsName = findCode(infos, dsName)
      if (newDsName) {
        return scopeManager.createScopeHandler({
          scopeId: extendId,
          handler: function (name) {
            return exports.getDataSource(name)
          }
        })(newDsName)
      }
    }
  }
  //当前域中找数据源实例
  if (scope.has(token)) {
    let storage = scope.get(token)
    return storage.get(dsName)
  }
  return null
}

const getScopeId = function (datasourceName) {
  let dsName = datasourceName
  let scope = scopeManager.getScope()
  let key = scope.getComponentCode() + '$_$' + scope.getWindowCode()
  let extendId = scope.getExtendId()
  //如果不存在父窗体,数据源一定在当前域
  if (extendId != null) {
    //获取数据源映射信息
    let storage = _getDatasourceStorage()
    //如果有数据源映射信息，则数据源一定在父窗体
    if (storage.containsKey(key)) {
      let infos = storage.get(key)
      let newDsName = findCode(infos, dsName)
      if (newDsName) {
        return scopeManager.createScopeHandler({
          scopeId: extendId,
          handler: function (name) {
            return exports.getScopeId(name)
          }
        })(newDsName)
      }
    }
  }
  return scope.getInstanceId()
}

let put = function (storage, key, value) {
  if (value) {
    storage.put(key, value)
  } else {
    storage.remove(key)
  }
}
let findCode = function (infos, refCode) {
  if (infos && infos.length > 0) {
    for (let i = 0, len = infos.length; i < len; i++) {
      let info = infos[i]
      if (info.code == refCode) {
        return info.refCode
      }
    }
  }
  return null
}
let getKey = function (scope) {
  return scope.componentCode + '$_$' + scope.windowCode
}
export {
  existMapping,
  init,
  getRuleset,
  getInput,
  getOutput,
  existPropertyMapping,
  getDataSource,
  getScopeId
}
