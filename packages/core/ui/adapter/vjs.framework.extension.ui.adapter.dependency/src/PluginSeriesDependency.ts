let instance

const loadResources = function (
  componentCode,
  windowCode,
  sandbox,
  scopeId,
  callback,
  errorFun
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

const batchLoadResources = function (wins, callback) {
  if (!instance) {
    throw Error(
      '[PluginSeriesDependency.batchLoadResources]插件体系依赖实例未注入，请检查！'
    )
  }
  instance.loadDependencyLibs(wins, callback)
}

const putInstance = function (ie) {
  instance = ie
}

export { loadResources, batchLoadResources, putInstance }
