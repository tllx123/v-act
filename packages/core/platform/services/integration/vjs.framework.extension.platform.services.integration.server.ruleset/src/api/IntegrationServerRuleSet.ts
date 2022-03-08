let _instance

const _putInstance = function (instance) {
  _instance = instance
}

const invoke = function (params) {
  _instance.invoke(params)
}

const invoke = function (params) {
  _instance.invoke(params)
}

const invokeV3Webapi = function (params) {
  _instance.invokeV3Webapi(params)
}

export { _putInstance, invoke, invoke, invokeV3Webapi }
