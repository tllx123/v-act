import { WindowVMMapping as windowVM } from '@v-act/vjs.framework.extension.platform.data.storage.schema.vmmapping'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {}

/**
 * 获取子窗体域，如果没有子窗体域，则获取当前窗体域
 * */
let _getChildWindowScope = function () {
  return scopeManager.getChildWindowScope()
}

const getDatasourceNamesByWidgetCode = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getDatasourceNameByWidgetCode(
    componentCode,
    windowCode,
    params.widgetCode
  )
}

const getFieldCodesByWidgetCode = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getFieldCodesByWidgetCode(
    componentCode,
    windowCode,
    params.widgetCode,
    params.datasourceName
  )
}

const getFieldCodeByPropertyCode = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getFieldCodeByPropertyCode(
    componentCode,
    windowCode,
    params.widgetCode,
    params.propertyCode
  )
}

const getPropertyCodeByFieldCode = function (params) {
  let scope = _getChildWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getPropertyCodeByFieldCode(
    componentCode,
    windowCode,
    params.widgetCode,
    params.fieldCode
  )
}

const getWidgetCodesByDatasourceName = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getWidgetCodesByDatasourceName(
    componentCode,
    windowCode,
    params.datasourceName
  )
}

const getWidgetCodesByFieldCode = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getWidgetCodesByField(
    componentCode,
    windowCode,
    params.datasourceName,
    params.fieldCode
  )
}

const isCustomSqlDataSource = function (params) {
  let dsName = params.datasourceName
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let vm = windowVM.getVMMapping(componentCode, windowCode)
  if (vm && vm['dataSources'] && vm['dataSources'][dsName]) {
    let cfg = vm['dataSources'][dsName]
    return cfg.fetchMode == 'SQL'
  } else {
    throw Error(
      '[WindowVMMappingManager.isCustomSqlDataSource]不包含' +
        dataSourceName +
        '数据源'
    )
  }
  return false
}

const isVirtualDataSource = function (params) {
  let dsName = params.datasourceName
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let vm = windowVM.getVMMapping(componentCode, windowCode)
  if (vm && vm['dataSources'] && vm['dataSources'][dsName]) {
    let cfg = vm['dataSources'][dsName]
    return cfg.fetchMode == 'virtual'
  } else {
    throw Error(
      '[WindowVMMappingManager.isCustomSqlDataSource]不包含' +
        dataSourceName +
        '数据源'
    )
  }
  return false
}

const getWindowDataSources = function () {
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let vm = windowVM.getVMMapping(componentCode, windowCode)
  let dsCfg = vm.dataSources
  let dsNames = []
  if (dsCfg) {
    for (let ds in dsCfg) {
      if (dsNames.indexOf(ds) == -1) dsNames.push(ds)
    }
  }
  return dsNames
}

const resetToDefault = function (params) {
  let widgetCode = params.widgetCode,
    dsName = params.datasourceName
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.resetToDefault(componentCode, windowCode, widgetCode, dsName)
}

const removeVMapping = function (params) {
  let widgetCode = params.widgetCode,
    dsName = params.datasourceName
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.removeVMapping(componentCode, windowCode, widgetCode, dsName)
}

const _getVMMapping = function () {
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  return windowVM.getVMMapping(componentCode, windowCode)
}

const putVMMapping = function (vmmapping) {
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode(),
    windowCode = scope.getWindowCode()
  let vm = windowVM.getVMMapping(componentCode, windowCode)
  for (let widgetCode in vmmapping.widgets) {
    vm[widgetCode] = vmmapping.widgets[widgetCode]
  }
  for (let datasourceCode in vmmapping.dataSources) {
    vm[datasourceCode] = vmmapping.dataSources[datasourceCode]
  }
  windowVM.addVMMapping(componentCode, windowCode, vm)
}

export {
  _getVMMapping,
  getDatasourceNamesByWidgetCode,
  getFieldCodeByPropertyCode,
  getFieldCodesByWidgetCode,
  getPropertyCodeByFieldCode,
  getWidgetCodesByDatasourceName,
  getWidgetCodesByFieldCode,
  getWindowDataSources,
  isCustomSqlDataSource,
  isVirtualDataSource,
  putVMMapping,
  removeVMapping,
  resetToDefault
}
