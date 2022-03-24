let WIDGET_I18N = {}

const init = function (params: any) {
  let series = params.series,
    widgetType = params.widgetType
  let seriesPool = WIDGET_I18N[series]
  if (!seriesPool) {
    seriesPool = {}
    WIDGET_I18N[series] = seriesPool
  }
  seriesPool[widgetType] = params.items
}

const get = function (params: any) {
  let seriesPool = WIDGET_I18N[params.series]
  if (seriesPool) {
    let widgetPool: any = seriesPool[params.widgetType]
    if (widgetPool) {
      // @ts-ignore
      return widgetPool[code] || params.defaultVal
    }
  }
  return params.defaultVal
}

const getAll = function (params: any) {
  let seriesPool = WIDGET_I18N[params.series],
    result = {}
  if (seriesPool) {
    let widgetPool: any = seriesPool[params.widgetType]
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

const has = function (params: any) {
  let seriesPool = WIDGET_I18N[params.series]
  let widgetType = params.widgetType
  // @ts-ignore
  if (seriesPool && widgetPool.hasOwnProperty(widgetType)) {
    let widgetPool = seriesPool[widgetType]
    // @ts-ignore
    if (widgetPool && widgetPool.hasOwnProperty(code)) {
      return true
    }
  }
  return false
}

export {
  // initResourcePackage,

  // initExp,
  // getResourcePackage,
  // getExpLanguage,

  // hasResourcePackage,
  // hasExpLanguage,
  has,
  init,
  get,
  getAll
}
