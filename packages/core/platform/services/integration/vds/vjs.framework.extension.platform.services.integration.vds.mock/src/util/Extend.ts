define('./Extend', function (require, exports, module) {
  exports.extend = function (subClass, superClass, sandbox) {
    var initFunc = superClass.prototype.initModule
    if (initFunc) {
      initFunc.call(subClass, sandbox)
    }
    var prototype = {}
    sandbox.util.object.extend(prototype, superClass.prototype)
    prototype.constructor = subClass
    sandbox.util.object.extend(prototype, subClass.prototype)
    subClass.prototype = prototype
  }
})
