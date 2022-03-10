import * as Exception from '../impl/Exception'

let handlers = {}
Exception.prototype._putManager(exports)

const onBeforeHandler = function (params) {
  let handler = params.handler
  Exception.prototype.onBeforeHandler(handler)
}

const onHandleFunction = function (params) {
  handlers[params.type] = params.handler
}

const _getHandler = function (type) {
  return handlers[type]
}

export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
