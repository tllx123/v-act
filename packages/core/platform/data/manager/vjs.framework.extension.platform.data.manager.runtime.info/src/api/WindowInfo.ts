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

const markWindowSchemaInited = function (
  componentCode: string,
  windowCode: string
) {
  _getPool()['schemaInited'] = true
}

const isWindowSchemaInited = function (
  componentCode: string,
  windowCode: string
) {
  return !!_getPool()['schemaInited']
}

const hasPermission = function (componentCode: string, windowCode: string) {
  return !!_getPool()['permission']
}

const markWindowPermission = function (
  componentCode: string,
  windowCode: string,
  permission: string
) {
  _getPool()['permission'] = permission
}

const clearWindowPermission = function (
  componentCode: string,
  windowCode: string
) {
  _remove()
}

const isWindowPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool()
  return pool.hasOwnProperty('permission')
}

const markWidgetPermission = function (
  componentCode: string,
  windowCode: string,
  info: any
) {
  _getPool()['widgetPermission'] = info
}

const getWidgetPermission = function (
  componentCode: string,
  windowCode: string
) {
  return _getPool()
}

const markWidgetPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  _getPool()
}

const isWidgetPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool()
  return pool.hasOwnProperty('widgetPermission')
}

const clearWidgetPermission = function (
  componentCode: string,
  windowCode: string
) {
  _remove()
}

const setWindowSeries = function (
  componentCode: string,
  windowCode: string,
  series: string
) {
  _getPool()['series'] = series
}

const getWindowSeries = function (componentCode: string, windowCode: string) {
  return _getPool()['series']
}

const isWindowSeriesIntied = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool()
  return pool.hasOwnProperty('series')
}

export {
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
