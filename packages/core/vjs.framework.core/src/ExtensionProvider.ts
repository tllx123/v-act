let arrayUtil,
  collectionsUtil,
  slice = Array.prototype.slice,
  logger

arrayUtil = require('vjs/framework/core/base/util/api/Arrays')
collectionsUtil = require('vjs/framework/core/base/util/api/Collections')
let Logger = require('vjs/framework/core/base/log/api/Log')
logger = new Logger('ExtensionProvider').enable()

function ExtensionProvider(headers) {
  this._headers = headers
  this._extensionServices = []

  return this
}

ExtensionProvider.prototype = {
  getExtensionServices: function () {
    return this._extensionServices
  },
  getAlias: function () {
    return this._headers.alias
  },
  getRef: function () {
    return this._headers.name
  },
  getVersion: function () {
    return this._headers.version
  },
  getHeader: function () {
    return this._headers
  },
  registerService: function (alias, name, implementation, properties) {
    if (this._injected) {
      throw new Error('Cannot register service. Extension Provider is injected')
    }
    let method = null
    let methods = []
    for (method in implementation) {
      if (typeof implementation[method] === 'function') {
        methods.push(method)
      }
    }
    this._extensionServices.push({
      provider: this.getHeader(),
      alias: alias,
      serviceName: name,
      methods: methods,
      implementation: implementation,
      properties: properties || {}
    })
  },
  inject: function (app) {
    app.extensions.registerExtensionService(this)
    this._injected = true
  }
}

return ExtensionProvider
