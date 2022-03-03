let sb

exports.initModule = function (sandbox) {
  sb = sandbox
}

let getDBServiceWithType = function (type) {
  let dbService = sb.getService(
    'vjs.framework.extension.platform.datasource.db',
    { type: type }
  )
  if (!dbService) {
    dbService = sb.getService(
      'vjs.framework.extension.platform.datasource.db',
      { type: 'default' }
    )
  }
  return dbService
}

let _getSeries = function () {
  let scopeManager = sb.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  let windowScope = scopeManager.getWindowScope()
  return windowScope.getSeries()
}

let newInstance = function () {
  let widgetSeries = _getSeries()
  return getDBServiceWithType(widgetSeries).DB()
}

let getDBService = function () {
  let widgetSeries = _getSeries()
  return getDBServiceWithType(widgetSeries)
}

/**
 *数据源反序列化
 * @param {Object} input
 * @param {String} dbType
 * @return DataSource
 */
let unSerialize = function (input, dbType) {
  let widgetSeries = dbType ? dbType : _getSeries()
  if (typeof input == 'string') {
    input = eval('(' + input + ')')
  }

  return getDBServiceWithType(widgetSeries).unSerialize(input)
}

let isDB = function (db, dbType) {
  let widgetSeries = dbType ? dbType : _getSeries()
  return getDBServiceWithType(widgetSeries).isDB(db)
}

let getDBConstructor = function () {
  let widgetSeries = _getSeries()
  //TODO
  let service = getDBServiceWithType(widgetSeries)
  return service.getConstructor()
}

export {
  newInstance,
  unSerialize,
  isDB,
  getDBServiceWithType,
  getDBService,
  getDBConstructor
}
