let sb:any
let scopeManager

export function initModule(sandbox:any) {
  sb = sandbox
}

const bind = function () {
  let observerManager = sb.getService(
    'vjs.framework.extension.platform.data.manager.runtime.observer.DatasourceObserverManager'
  )
  let vmManager = sb.getService(
    'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
  )
  let datasourceManager = sb.getService(
    'vjs.framework.extension.platform.data.manager.runtime.datasource.WindowDatasource'
  )
  scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  let dsNames = vmManager.getWindowDataSources()
  let handler = scopeManager.createScopeHandler({
    handler: function (params:any) {
      observerManager.fire(params)
    }
  })
  for (let i = 0, len = dsNames.length; i < len; i++) {
    let dsName = dsNames[i]
    let ds = datasourceManager.lookup({ datasourceName: dsName })
    let events = ds.Events
    for (let eventName in events) {
      if (events.hasOwnProperty(eventName)) {
        ds.on({ eventName: eventName, handler: handler })
      }
    }
  }
}

const bindByDatasourceName = function (datasourceName:string) {
  let observerManager = sb.getService(
    'vjs.framework.extension.platform.data.manager.runtime.observer.DatasourceObserverManager'
  )
  let vmManager = sb.getService(
    'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
  )
  let datasourceManager = sb.getService(
    'vjs.framework.extension.platform.data.manager.runtime.datasource.WindowDatasource'
  )
  let handler = function (params:any) {
    observerManager.fire(params)
  }
  let datasource = datasourceManager.lookup({
    datasourceName: datasourceName
  })
  if (datasource) {
    let events = datasource.Events
    for (let eventName in events) {
      if (events.hasOwnProperty(eventName)) {
        datasource.on({
          eventName: eventName,
          handler: handler
        })
      }
    }
  }
}

export { bind, bindByDatasourceName }
