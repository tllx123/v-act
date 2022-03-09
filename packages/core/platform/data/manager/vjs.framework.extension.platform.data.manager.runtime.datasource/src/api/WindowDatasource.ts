import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowVMMapping as windowVM } from '@v-act/vjs.framework.extension.platform.data.storage.schema.vmmapping'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { DatasourcePuller as puller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DefaultValueGenerator as DefaultValueGenerator } from '@v-act/vjs.framework.extension.platform.services.view.logic.defaultvalue'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WindowVMMappingManager as vmmappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { WindowMappingManager as windowMappingManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.mapping'
import { Environment as environmentUtil } from '@v-act/vjs.framework.extension.platform.interface.environment'
3

let token = 'WINDOW_INSTANCE_DATASOURCE'
let sandbox

const initModule = function (sb) {
  sandbox = sb
}

let _getJsonFromCfg = function (dsName, cfg) {
  let defaultValues = cfg.defaultValues
  for (let i = 0; i < defaultValues.length; i++) {
    let fieldCode = defaultValues[i].name
    let fieldDefaultValue = defaultValues[i].defaultValue

    for (let j = 0; j < cfg.initMetaFields.length; j++) {
      if (cfg.initMetaFields[j].code == fieldCode)
        cfg.initMetaFields[j].defaultValue = fieldDefaultValue
    }
  }
  return {
    metadata: {
      model: [
        {
          datasourceName: dsName,
          fields: cfg.initMetaFields,
          chineseName: cfg.chineseName
        }
      ]
    }
  }
}

let _getWindowVM = function () {
  let windowScope = scopeManager.getScope()
  let componentCode = windowScope.getComponentCode()
  let windowCode = windowScope.getWindowCode()
  return windowVM.getVMMapping(componentCode, windowCode)
}

let _initDsInfo = function () {
  let currentScope = scopeManager.getWindowScope()
  let componentCode = currentScope.getComponentCode()
  let windowCode = currentScope.getWindowCode()
  //var props = sandbox.getService("vjs.framework.extension.publish." + componentCode + "." + windowCode + ".widget.property");
  let serverName1 =
    'vjs.framework.extension.publish.' +
    componentCode +
    '.' +
    windowCode +
    '.widget.property'
  let domain = environmentUtil.getDomain()
  let props
  if (domain) {
    let serverName2 = serverName1 + '.' + domain
    props = sandbox.getService(serverName2)
  }
  if (!props) {
    props = sandbox.getService(serverName1)
  }
  let vmmapping = {}
  if (props && props.getDatasourceMapping) {
    vmmapping.dataSources = props.getDatasourceMapping()
    vmmapping.widgets = props.getWidgetDSMapping()
    windowVM.addVMMapping(componentCode, windowCode, vmmapping)
    currentScope.markInitedDatasource && currentScope.markInitedDatasource()
  }
}

const init = function () {
  let windowScope = scopeManager.getWindowScope()
  if (
    windowScope &&
    windowScope.isInitedDatasource &&
    windowScope.isInitedDatasource()
  ) {
    return //已经注册过的就不需要重复注册
  }
  let vmInfo = _getWindowVM()
  if (null == vmInfo) {
    //网页窗体继承普通窗体，补偿初始化
    _initDsInfo()
    vmInfo = _getWindowVM()
  }
  if (vmInfo && vmInfo.dataSources) {
    let dsCfg = vmInfo.dataSources
    for (let ds in dsCfg) {
      let cfg = dsCfg[ds]
      let json = _getJsonFromCfg(ds, cfg)
      let datasource = datasourceFactory.unSerialize(json)
      _initDefaultValueGenerator(datasource)
      exports.register({ datasourceName: ds, datasource: datasource })
    }
  }
}

/**
 * 初始化各个字段的默认值生成器
 *
 * @param datasource
 *            {Object} 数据源实例
 */
let _initDefaultValueGenerator = function (datasource) {
  let metadata = datasource.getMetadata()
  let datasourceName = metadata.getDatasourceName()
  let fields = metadata.getFields()
  for (let i = 0; i < fields.length; i++) {
    fields[i].setDefaultValueGenerator(
      new DefaultValueGenerator(datasourceName, fields[i].getCode())
    )
  }
}

const initDefaultDatas = function () {
  let vmInfo = _getWindowVM()
  let dsCfg = vmInfo.dataSources
  if (dsCfg) {
    for (let ds in dsCfg) {
      let cfg = dsCfg[ds]
      let datas = cfg.initDefaultData
      if (datas && datas.length > 0) {
        let records = puller.createRecords({ datasourceName: ds, datas: datas })
        pusher.loadRecords({
          datasourceName: ds,
          records: records,
          isAppend: false
        })
      }
      let isVirtualDatasource = vmmappingManager.isVirtualDataSource({
        datasourceName: ds
      })
      if (isVirtualDatasource == true) {
        let virtualDatasource = this.lookup({
          datasourceName: ds
        })
        let record = virtualDatasource.createRecord()
        virtualDatasource.insertRecords({
          records: [record]
        })
      }
    }
  }
}

const lookup = function (params) {
  let dsName = params.datasourceName
  let datasource = windowMappingManager.getDataSource(dsName)
  //		var windowScope = scopeManager.getScope();
  //		var extendId = windowScope.getExtendId();
  //		if(extendId != null){
  //			var newDsName = windowMappingManager.getDataSource({
  //				componentCode : windowScope.getComponentCode(),
  //				windowCode : windowScope.getWindowCode(),
  //				dsName : code
  //			});
  //			if(newDsName){
  //				return scopeManager.createScopeHand
  //			}
  //		}
  //		if(windowScope.has(token)){
  //			var storage = windowScope.get(token);
  //			result = storage.get(dsName);
  //		}
  //		var findSource = params.findSource === false ? false : true;
  //		var noFindError = params.noFindError === false ? false : true;
  ////		if(result == null && findSource){
  ////			var extendId = windowScope.getExtendId();
  ////			if(extendId != null){
  ////				result = scopeManager.createScopeHandler({
  ////					scopeId:extendId,
  ////					handler:function(){
  ////						return exports.lookup(params);
  ////					}
  ////				})();
  ////			}
  ////		}
  /*if(!datasource){
        var e=exceptionFactory.create({
            message : "实体["+dsName+"]不存在, 请检查."
        });
        e.handle();
    }
    return datasource;*/
  return datasource ? datasource : null
}

const register = function (params) {
  let windowScope = scopeManager.getScope()
  let storage = windowScope.has(token)
    ? windowScope.get(token)
    : storageManager.newInstance(storageManager.TYPES.MAP)
  storage.put(params.datasourceName, params.datasource)
  windowScope.set(token, storage)
}

const unRegister = function (params) {
  let dsName = params.datasourceName
  let windowScope = scopeManager.getScope()
  if (windowScope.has(token)) {
    let storage = windowScope.get(token)
    storage.remove(dsName)
  }
}

const exists = function (params) {
  let dsName = params.datasourceName
  let windowScope = scopeManager.getScope()
  if (windowScope.has(token)) {
    let storage = windowScope.get(token)
    return storage.containsKey(dsName)
  }
  return false
}

const getAll = function () {
  let windowScope = scopeManager.getScope()
  let result = []
  if (windowScope && windowScope.has(token)) {
    let storage = windowScope.get(token)
    storage.iterate(function (key, val) {
      result.push(val)
    })
  }
  return result
}

export {
  initModule,
  init,
  initDefaultDatas,
  lookup,
  register,
  unRegister,
  exists,
  getAll
}
