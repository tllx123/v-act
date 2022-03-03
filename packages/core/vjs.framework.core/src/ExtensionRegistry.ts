function ExtensionRegistry() {
  this._currentServiceId = 0
  this._serviceReferences = {}
  this._extensionReferences = {}
  this._serviceRefCache = {}
  this._aliasMap = {}
  return this
}

ExtensionRegistry.prototype.getServiceImplByRef = function (refId) {
  if (this._serviceReferences[refId]) {
    return this._serviceReferences[refId]['implementation']
  } else {
    return null
  }
}

ExtensionRegistry.prototype.getServiceReferenceByRef = function (refId) {
  if (this._serviceReferences[refId]) {
    return this._serviceReferences[refId]
  } else {
    return null
  }
}
//add by xiedh 2016-03-24
ExtensionRegistry.prototype.getRefByAlias = function (alias) {
  return this._aliasMap[alias]
}

ExtensionRegistry.prototype.getServiceRefsByExtensions = function (extensions) {
  let serviceUriRefs = {}

  //TODO -是否存在获取同一扩展bundle的不同版本服务？
  for (let i = 0; i < extensions.length; i++) {
    let extRef
    let extVersion
    if (typeof extensions[i] === 'object') {
      extRef = Object.keys(extensions[i])[0]
      extVersion = extensions[i][extRef]
    } else {
      extRef = extensions[i]
    }

    if (this._extensionReferences[extRef]) {
      //TODO -如果不指定依赖bundle的版本，将随机取其中一个版本的bundle服务
      if (!extVersion) {
        extVersion = Object.keys(this._extensionReferences[extRef])[0]
      }

      if (this._extensionReferences[extRef][extVersion]) {
        let serviceRefs = this._extensionReferences[extRef][extVersion]

        for (let k = 0; k < serviceRefs.length; k++) {
          let service = this._serviceReferences[serviceRefs[k]]
          let serviceName = service['serviceName']
          if (!serviceUriRefs[serviceName]) {
            serviceUriRefs[serviceName] = []
          }
          //TODO -目前相同服务名和过滤条件,存在多版本服务时，随机取?
          serviceUriRefs[serviceName].push(serviceRefs[k])
        }
      }
    }
  }
  return serviceUriRefs
}

ExtensionRegistry.prototype.getAllServiceRefs = function () {
  return this._serviceRefCache
}

ExtensionRegistry.prototype.registerExtensionProvider = function (
  extensionProvider
) {
  let extRef = extensionProvider.getRef()
  let extVersion = extensionProvider.getVersion()
  let serviceRefs = []
  let extServices = extensionProvider.getExtensionServices()
  for (let i = 0; i < extServices.length; i++) {
    //获取服务索引号
    let currentServiceId = this._currentServiceId
    this._serviceReferences[currentServiceId] = extServices[i]
    serviceRefs.push(currentServiceId)

    //更新扩展注册服务的全局缓存区
    let serviceName = extServices[i]['serviceName']
    if (!this._serviceRefCache[serviceName]) {
      this._serviceRefCache[serviceName] = []
    }
    this._serviceRefCache[serviceName].push(currentServiceId)

    //更新服务全局索引号
    this._currentServiceId++

    //add by xiedh 2016-03-24 添加服务及别名映射
    let alias = extServices[i].alias
    if (alias) {
      this._aliasMap[alias] = serviceName
    } //end
  }
  if (!this._extensionReferences[extRef]) {
    this._extensionReferences[extRef] = {}
  }
  this._extensionReferences[extRef][extVersion] = serviceRefs
}

return ExtensionRegistry
