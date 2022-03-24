let pool = {}

let _getPool = function (...args: string[]) {
  let rs,
    parent = pool
  for (let i = 0, l = args.length; i < l; i++) {
    let key = args[i]
    rs = parent[key]
    if (!rs) {
      rs = {}
      parent[key] = rs
    }
    parent = rs
  }
  return rs
}

let _remove = function (...args: string[]) {
  let parent = pool
  for (let i = 0, l = args.length; i < l; i++) {
    let key = args[i]
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
  _getPool(componentCode, windowCode)['schemaInited'] = true
}

const isWindowSchemaInited = function (
  componentCode: string,
  windowCode: string
) {
  return !!_getPool(componentCode, windowCode)['schemaInited']
}

const hasPermission = function (componentCode: string, windowCode: string) {
  return !!_getPool(componentCode, windowCode)['permission']
}

const markWindowPermission = function (
  componentCode: string,
  windowCode: string,
  permission: string
) {
  _getPool(componentCode, windowCode)['permission'] = permission
}

const clearWindowPermission = function (
  componentCode: string,
  windowCode: string
) {
  _remove(componentCode, windowCode, 'permission')
}

const isWindowPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool(componentCode, windowCode)
  return pool.hasOwnProperty('permission')
}

const markWidgetPermission = function (
  componentCode: string,
  windowCode: string,
  info: any
) {
  _getPool(componentCode, windowCode)['widgetPermission'] = info
}

const getWidgetPermission = function (
  componentCode: string,
  windowCode: string
) {
  return _getPool(componentCode, windowCode, 'widgetPermission')
}

const markWidgetPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  _getPool(componentCode, windowCode, 'widgetPermission')
}

const isWidgetPermissionInited = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool(componentCode, windowCode)
  return pool.hasOwnProperty('widgetPermission')
}

const clearWidgetPermission = function (
  componentCode: string,
  windowCode: string
) {
  _remove(componentCode, windowCode, 'widgetPermission')
}

const setWindowSeries = function (
  componentCode: string,
  windowCode: string,
  series: string
) {
  _getPool(componentCode, windowCode)['series'] = series
}

const getWindowSeries = function (componentCode: string, windowCode: string) {
  return _getPool(componentCode, windowCode)['series']
}

const isWindowSeriesIntied = function (
  componentCode: string,
  windowCode: string
) {
  let pool = _getPool(componentCode, windowCode)
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
