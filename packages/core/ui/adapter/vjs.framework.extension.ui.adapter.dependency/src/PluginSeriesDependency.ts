let instance:any

const loadResources = function (
  componentCode:string,
  windowCode:string,
  sandbox:any,
  scopeId:string,
  callback:any,
  errorFun:any
) {
  if (!instance) {
    throw Error(
      '[PluginSeriesDependency.loadResources]插件体系依赖实例未注入，请检查！'
    )
  }
  instance.loadDependencyLib(
    componentCode,
    windowCode,
    sandbox,
    scopeId,
    callback,
    errorFun
  )
}

const batchLoadResources = function (wins:any, callback:any) {
  if (!instance) {
    throw Error(
      '[PluginSeriesDependency.batchLoadResources]插件体系依赖实例未注入，请检查！'
    )
  }
  instance.loadDependencyLibs(wins, callback)
}

const putInstance = function (ie:any) {
  instance = ie
}

export { loadResources, batchLoadResources, putInstance }
