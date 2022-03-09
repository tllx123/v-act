/**
 * @namespace DefaultProcessor
 * @module DefaultProcessor
 * @desc 默认属性处理器<br/>
 * vjs名称：vjs.framework.extension.platform.services.view.window.property.processor<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.view.window.property.DefaultProcessor<br/>
 * @author liangzc
 * */

var sandbox
var propertyHandle

var DefaultPropertyHandler = function (params) {
  if (!params) {
    params = {}
  }
  this.properties = params
}
DefaultPropertyHandler.prototype = {
  initModule: function (sBox) {
    if (sBox) {
      sandbox = sBox
      propertyHandle = sandbox.getService(
        'vjs.framework.extension.platform.window.property.handle.PropertyHandle'
      )
    }
  },

  process: function () {
    if (propertyHandle) {
      return propertyHandle.process(this.properties)
    }
  },

  getOrder: function () {
    var properties = this.properties
    return properties.hasOwnProperty('order') ? properties.order : 1
  },

  get: function (key) {
    return this.properties[key]
  },

  set: function (key, value) {
    this.properties[key] = value
  }
}

return DefaultPropertyHandler
