/**
 * @namesapce Callback
 * @class Callback
 * @desc 回调定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.event
 */
let Callback = function (type, handler) {
  this.type = type
  this.handler = handler
}

Callback.prototype = {
  getType: function () {
    return this.type
  },

  getHandler: function () {
    return this.handler
  }
}

return Callback
