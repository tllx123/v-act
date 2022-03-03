let pool = {}

let _getPool = function () {
  let rs,
    parent = pool
  for (let i = 0, l = arguments.length; i < l; i++) {
    let key = arguments[i]
    rs = parent[key]
    if (!rs) {
      rs = {}
      parent[key] = rs
    }
    parent = rs
  }
  return rs
}

let _remove = function () {
  let parent = pool
  for (let i = 0, l = arguments.length; i < l; i++) {
    let key = arguments[i]
    let rs = parent[key]
    if (rs) {
      if (i < l - 1) {
        parent = rs
      } else {
        parent[key] = null
        delete parent[key]
      }
    }
  }
}

const markWindowSchemaInited = function (componentCode, windowCode) {
  _getPool(componentCode, windowCode)['schemaInited'] = true
}

const isWindowSchemaInited = function (componentCode, windowCode) {
  return !!_getPool(componentCode, windowCode)['schemaInited']
}

const hasPermission = function (componentCode, windowCode) {
  return !!_getPool(componentCode, windowCode)['permission']
}

const markWindowPermission = function (componentCode, windowCode, permission) {
  _getPool(componentCode, windowCode)['permission'] = permission
}

const clearWindowPermission = function (componentCode, windowCode) {
  _remove(componentCode, windowCode, 'permission')
}

const isWindowPermissionInited = function (componentCode, windowCode) {
  let pool = _getPool(componentCode, windowCode)
  return pool.hasOwnProperty('permission')
}

const markWidgetPermission = function (componentCode, windowCode, info) {
  _getPool(componentCode, windowCode)['widgetPermission'] = info
}

const getWidgetPermission = function (componentCode, windowCode) {
  return _getPool(componentCode, windowCode, 'widgetPermission')
}

const markWidgetPermissionInited = function (componentCode, windowCode) {
  _getPool(componentCode, windowCode, 'widgetPermission')
}

const isWidgetPermissionInited = function (componentCode, windowCode) {
  let pool = _getPool(componentCode, windowCode)
  return pool.hasOwnProperty('widgetPermission')
}

const clearWidgetPermission = function (componentCode, windowCode) {
  _remove(componentCode, windowCode, 'widgetPermission')
}

const setWindowSeries = function (componentCode, windowCode, series) {
  _getPool(componentCode, windowCode)['series'] = series
}

const getWindowSeries = function (componentCode, windowCode) {
  return _getPool(componentCode, windowCode)['series']
}

const isWindowSeriesIntied = function (componentCode, windowCode) {
  let pool = _getPool(componentCode, windowCode)
  return pool.hasOwnProperty('series')
}

export {
  markAppSchemaInited,
  isAppSchemaInited,
  markComponentSchemaInited,
  isComponentSchemaInited,
  markWindowSchemaInited,
  isWindowSchemaInited,
  hasPermission,
  markWindowPermission,
  clearWindowPermission,
  isWindowPermissionInited,
  markWidgetPermission,
  getWidgetPermission,
  markWidgetPermissionInited,
  isWidgetPermissionInited,
  clearWidgetPermission,
  setWindowSeries,
  getWindowSeries,
  isWindowSeriesIntied
}
