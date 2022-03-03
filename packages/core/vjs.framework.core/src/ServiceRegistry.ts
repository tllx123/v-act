function ServiceRegistry(config) {
  this._ref = config.ref
  this._serviceProviders = config.extensions
  this.extensionRegistry = config.extensionRegistry

  this._serviceRefs = this.extensionRegistry.getServiceRefsByExtensions(
    this._serviceProviders
  )

  return this
}

ServiceRegistry.prototype.getServiceByAlias = function (alias, filter) {
  let serviceName = this.extensionRegistry.getRefByAlias(alias)
  return this.getService(serviceName, filter)
}

ServiceRegistry.prototype.getService = function (serviceName, filter) {
  let service = null

  //TODO-后续调整回此方案，按需过滤服务
  //		var serviceArray = this._serviceRefs[serviceName];

  //TODO-临时解决方案,能访问所有服务
  let serviceArray = this.extensionRegistry.getAllServiceRefs()[serviceName]

  if (serviceArray && serviceArray.length > 0) {
    if (filter && typeof filter === 'object') {
      let filterKeys = Object.keys(filter)
      if (filterKeys.length > 0) {
        for (let i = 0; i < serviceArray.length; i++) {
          let flag = true
          //TODO - serviceReference考虑类型化，通过API操作?
          let serviceReference =
            this.extensionRegistry.getServiceReferenceByRef(serviceArray[i])
          let properties = serviceReference.properties
          for (let k = 0; k < filterKeys.length; k++) {
            if (properties[filterKeys[k]] !== filter[filterKeys[k]]) {
              flag = false
              break
            }
          }
          if (flag) {
            //TODO-找到符合过滤条件的随机版本实现，当存在符合条件的多版本实现？
            service = serviceReference.implementation
            break
          }
        }
      } else {
        service = this.extensionRegistry.getServiceImplByRef(serviceArray[0])
      }
    } else {
      service = this.extensionRegistry.getServiceImplByRef(serviceArray[0])
    }
  }

  return service
}

return ServiceRegistry
