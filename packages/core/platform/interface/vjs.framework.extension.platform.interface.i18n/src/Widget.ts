let WIDGET_I18N = {}

const init = function (params) {
  let series = params.series,
    widgetType = params.widgetType
  let seriesPool = WIDGET_I18N[series]
  if (!seriesPool) {
    seriesPool = {}
    WIDGET_I18N[series] = seriesPool
  }
  seriesPool[widgetType] = params.items
}

const get = function (params) {
  let seriesPool = WIDGET_I18N[params.series]
  if (seriesPool) {
    let widgetPool = seriesPool[params.widgetType]
    if (widgetPool) {
      return widgetPool[code] || params.defaultVal
    }
  }
  return params.defaultVal
}

const getAll = function (params) {
  let seriesPool = WIDGET_I18N[params.series],
    result = {}
  if (seriesPool) {
    let widgetPool = seriesPool[params.widgetType]
    if (widgetPool) {
      for (let attr in widgetPool) {
        if (widgetPool.hasOwnProperty(attr)) {
          result[attr] = widgetPool[attr]
        }
      }
    }
  }
  return result
}

const has = function (params) {
  let seriesPool = WIDGET_I18N[params.series]
  let widgetType = params.widgetType
  if (seriesPool && widgetPool.hasOwnProperty(widgetType)) {
    let widgetPool = seriesPool[widgetType]
    if (widgetPool && widgetPool.hasOwnProperty(code)) {
      return true
    }
  }
  return false
}

export {
  initResourcePackage,
  init,
  initExp,
  getResourcePackage,
  getExpLanguage,
  get,
  hasResourcePackage,
  hasExpLanguage,
  has,
  init,
  get,
  has,
  init,
  get,
  getAll,
  has
}
