import * as Exception from '../impl/Exception'

let handlers = {}

const onBeforeHandler = function (params: any) {
  let handler = params.handler
  // @ts-ignore
  Exception.prototype.onBeforeHandler(handler)
}

const onHandleFunction = function (params: any) {
  handlers[params.type] = params.handler
}

const _getHandler = function (type: any) {
  return handlers[type]
}

export {
  _getHandler,
  // create,
  // getExceptionHtml,
  // handle,
  // isException,
  onBeforeHandler,
  onHandleFunction
}
