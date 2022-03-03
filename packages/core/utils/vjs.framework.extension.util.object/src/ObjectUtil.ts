let sandbox

exports.initModule = function (sBox) {
  if (sBox) {
    sandbox = sBox
    let objectUtils = sBox.util.object
    for (let methodName in objectUtils) {
      if (
        objectUtils.hasOwnProperty(methodName) &&
        methodName.charAt(0) != '_'
      ) {
        exports[methodName] = objectUtils[methodName]
      }
    }
  }
}

const extend = function () {
  return sandbox.util.object.extend.apply(sandbox.util.object, arguments)
}

export { extend }
