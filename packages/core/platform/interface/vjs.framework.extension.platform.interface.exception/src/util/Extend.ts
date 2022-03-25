const extend = function (subClass: any, superClass: any, sandbox: any) {
  let initFunc = superClass.prototype.initModule
  if (initFunc) {
    initFunc.call(subClass, sandbox)
  }
  let prototype = {}
  sandbox.util.object.extend(prototype, superClass.prototype)
  prototype.constructor = subClass
  sandbox.util.object.extend(prototype, subClass.prototype)
  subClass.prototype = prototype
}

export {
  // create,
  // isException,
  // handle,
  // getExceptionHtml,
  // onBeforeHandler,
  // onHandleFunction,
  // _getHandler,
  // showDialog,
  // callCommand,
  extend
}
