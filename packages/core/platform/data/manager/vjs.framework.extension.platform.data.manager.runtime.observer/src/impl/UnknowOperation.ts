let Operation = function () {}

Operation.prototype = {}

return Operation

export {
  addObserver,
  fire,
  _callAsyncObservers,
  getBindedDatasourceNames,
  destroy,
  addOperation,
  create
}
