import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WindowRuntimeManager as windowRuntimeManager } from '@v-act/vjs.framework.extension.platform.services.runtime.manager'

let sandbox

export function initModule(sb) {
  sandbox = sb
  let dependency = sb.getService(
    'vjs.framework.extension.ui.adapter.dependency'
  )
  dependency.putInstance(exports)
}

let genModuleUrl = function (componentCode, windowCode) {
  let url = ''
  if (!window.GlobalVariables) {
    url += 'module-operation!executeOperation?componentCode='
  } else {
    url +=
      window.GlobalVariables.getServerUrl() +
      '/module-operation!executeOperation?componentCode='
  }
  url += componentCode
  url += '&windowCode='
  url += windowCode
  url +=
    '&moduleRequest=true&operation=DependencyLibLoader&moduleName=/dependencyLib'
  return url
}

const loadDependencyLib = function (
  componentCode,
  windowCode,
  sandbox,
  scopeId,
  callback,
  errorFun
) {
  let url = genModuleUrl(componentCode, windowCode)
  let wins = [
    {
      componentCode: componentCode,
      windowCode: windowCode
    }
  ]
  seajs.use(url, function (dependencyLib) {
    if (!dependencyLib) {
      let exception = exceptionFactory.create({
        message: '与服务器通信失败，请重试！',
        type: exceptionFactory.TYPES.Dialog
      })
      if (errorFun) errorFun(exception)
    } else if (dependencyLib.__$isErrorModule) {
      let exception = exceptionFactory.create({
        message: dependencyLib.getMessage(),
        type: dependencyLib.getType(),
        exceptionLib: dependencyLib
      })
      if (errorFun) errorFun(exception)
    } else {
      dependencyLib.loadDependencies(sandbox, scopeId, callback)
    }
  })
}

const loadDependencyLibs = function (wins, cb, ef) {
  let callback = cb
  let errorFun = ef
  let success = function () {
    //var seriesInfo = getSeriesInfo(wins);
    //var seriesDependencyLibs = {};
    let seriesMap = {}
    for (let i = 0, l = wins.length; i < l; i++) {
      let win = wins[i]
      let series = windowRuntimeManager.getWindowSeries(win)
      let list = seriesMap[series]
      if (!list) {
        list = []
        seriesMap[series] = list
      }
      list.push(win)
    }
    let seriesDependencyPaths = []
    /*for (var i = 0; i < seriesInfo.seriesList.length; i++) {
        var dependencyLibPath = "vjs.framework.extension.ui.adapter.dependency." + seriesInfo.seriesList[i];
        seriesDependencyPaths.push(dependencyLibPath);
    }*/
    for (let series in seriesMap) {
      let dependencyLibPath =
        'vjs.framework.extension.ui.adapter.dependency.' + series
      seriesDependencyPaths.push(dependencyLibPath)
    }
    let sandBox = sandbox.create()
    sandBox.use(seriesDependencyPaths)
    sandbox
      .active()
      .done(function (sbox) {
        /*for (var i = 0; i < seriesInfo.seriesList.length; i++) {
            var winseries = seriesInfo.seriesList[i];
            var dependencyLibPath = "vjs.framework.extension.ui.adapter.dependency." + winseries;
            var dependencyLib = sandbox.getService(dependencyLibPath);
            dependencyLib.loadDependencies(null, function (series) {
                return function () {
                    callback(series, seriesInfo.winSeriesList[series]);
                }
            }(winseries))
        }*/
        for (var s in seriesMap) {
          var dependencyLibPath =
            'vjs.framework.extension.ui.adapter.dependency.' + s
          var dependencyLib = sandbox.getService(dependencyLibPath)
          dependencyLib.loadDependencies(
            null,
            (function (series) {
              return function () {
                callback(series, seriesMap[series])
              }
            })(s)
          )
        }
      })
      .fail(function (dependencyLib) {
        let exception = exceptionFactory.create({
          message: dependencyLib.message,
          type: dependencyLib.type,
          exceptionLib: dependencyLib.exceptionLib
        })
        if (typeof errorFunc == 'function') errorFunc(exception)
      })
  }
  windowRuntimeManager.initWindow({
    windows: wins,
    success: success
  })
}

export { loadDependencyLib, loadDependencyLibs }
