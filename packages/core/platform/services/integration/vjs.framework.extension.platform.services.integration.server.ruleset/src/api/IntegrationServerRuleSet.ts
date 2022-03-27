let _instance: Record<string, any>

const _putInstance = function (instance: Record<string, any>) {
  _instance = instance
}

const invoke = function (params: any) {
  _instance.invoke(params)
}

const invokeV3Webapi = function (params: any) {
  _instance.invokeV3Webapi(params)
}

export { _putInstance, invoke, invokeV3Webapi }
