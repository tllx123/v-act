;(function (ctx) {
  var vdk = ctx.vdk

  if (!vdk) {
    vdk = {}
    ctx.vdk = vdk
  }
  ctx.head_conf = {
    head: '_$vplatformMatrix'
  }
  var res = vdk.resource
  if (!res) {
    res = function (params) {
      this.id = params.id
      this.paths = params.paths
      this.deps = params.deps
      this.success = params.success
      this.faild = params.faild
    }
    vdk.resource = res
  }

  var basePath = ''

  if (window.GlobalVariables) {
    basePath = window.GlobalVariables.getServerUrl()
    if (basePath && basePath.substr(basePath.length - 1) != '/') {
      basePath += '/'
    }
  }

  // 资源基础路径
  res.basePath = basePath

  var isIE9 = false
  try {
    var isIE = navigator.appName == 'Microsoft Internet Explorer'
    isIE9 =
      isIE &&
      navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE9.0'
  } catch (e) {}

  var isAy = function (a) {
    return '[object Array]' == Object.prototype.toString.call(a)
  }

  var getSubfix = function (path) {
    path = path.split('?')[0]
    var index = path.lastIndexOf('.')
    return index == -1 ? 'js' : path.substring(index + 1)
  }

  var isScript = function (path) {
    return getSubfix(path) == 'js'
  }

  var isCss = function (path) {
    return getSubfix(path) == 'css'
  }

  var toAbsPath = function (relativePath) {
    var path = window.location.href
    var s = path.match(/.*(?=\/.*$)/)
    return (s ? s[0] : '.') + '/' + relativePath.split('?')[0]
  }

  var isAbsPath = function (path) {
    if (path) {
      return /^(http|ftp|https):\/\//.test(path)
    }
    return true
  }

  var removePaths = function (paths, loaded) {
    if (loaded.length > 0 && paths.length > 0) {
      var index = []
      for (var i = 0, l = paths.length; i < l; i++) {
        if (loaded.indexOf(toAbsPath(paths[i])) != -1) {
          index.push(i)
        }
      }
      for (var i = 0, l = index.length; i < l; i++) {
        paths.splice(index[i] - i, 1)
      }
    }
  }

  var filterLoadedCss = function (cssPaths) {
    removePaths(cssPaths, getTagAttr('link', 'href'))
  }

  var filterLoadedScript = function (scriptPaths) {
    removePaths(scriptPaths, getTagAttr('script', 'src'))
  }

  var put = function (path, fn, lib) {
    var rs = false
    if (fn(path)) {
      if (lib.indexOf(path) == -1) {
        lib.push(path)
      }
      rs = true
    }
    return rs
  }

  var parseArgs = function (args, css, script) {
    if (isAy(args)) {
      for (var i = 0, l = args.length; i < l; i++) {
        parseArgs(args[i], css, script)
      }
    } else if (typeof args == 'string') {
      put(args, isScript, script) || put(args, isCss, css)
    }
  }
  /**
   * 移除相同路径资源，否则会出现不执行回调情况
   */
  var removeRepeat = function (paths) {
    if (paths && paths.length > 0) {
      var temp = {}
      for (var i = 0, l = paths.length; i < l; i++) {
        var path = paths[i]
        if (typeof path == 'string') {
          var arr = path.split('?')
          if (temp.hasOwnProperty(arr[0])) {
            var index = temp[arr[0]]
            var pre = paths[index]
            var list = pre.split('?')
            var idex = list.length > arr.length ? i : index
            paths.splice(idex, 1)
            i--
          } else {
            temp[arr[0]] = i
          }
        }
      }
    }
    return paths
  }

  var loadRes = function (paths) {
    var arg = paths[paths.length - 1]
    var hasCb = typeof arg == 'function'
    var success = (function (cb) {
      return function () {
        ctx.head = ctx._$vplatformMatrix
        if (cb != null) {
          cb()
        }
      }
    })(hasCb ? arg : null)
    if (hasCb) {
      paths[paths.length - 1] = success
    } else {
      paths.push(success)
    }
    if (paths.length == 1) {
      paths[0]()
    } else {
      removeRepeat(paths)
      if (window.cordova && window.head && window.head.js) {
        window.head.js.apply(window.head, paths)
      } else {
        ctx._$vplatformMatrix.js.apply(ctx._$vplatformMatrix, paths)
      }
    }
  }

  /**
   * 获取标签属性值
   *
   * @param {String}
   *            标签名称
   * @param {String}
   *            属性名称
   */
  var getTagAttr = function (tagName, attrName) {
    var results = []
    var tags = $(tagName)
    if (tags && tags.length > 0) {
      for (var i = 0, len = tags.length; i < len; i++) {
        var src = $(tags[i]).attr(attrName)
        if (src) {
          results.push(src)
        }
      }
    }
    return results
  }
  var dealResId = function (id) {
    //处理二次开发标签和二次开发资源构件id无法匹配问题，例子：v3-vdk的资源id为v3-vdk,vjs如果需依赖v3-vdk则需添加依赖vjs.framework.extension.platform.custom.resource.v3-vdk，引发id无法匹配
    if (
      id &&
      id.length > 47 &&
      id.substring(0, 40) == 'vjs.framework.extension.platform.custom.'
    ) {
      return id.split('.').pop()
    }
    return id
  }

  var isResMatch = function (id, compare) {
    if (id && compare) {
      return dealResId(id) == dealResId(compare)
    }
    return false
  }

  var mapResourceByKey = function (keys) {
    var resources = []
    for (var i = 0, l = keys.length; i < l; i++) {
      for (var j = 0, len = res.unLoadRes.length; j < len; j++) {
        var resource = res.unLoadRes[j]
        if (isResMatch(resource.id, keys[i])) {
          resources.push(resource)
          break
        }
      }
    }
    return resources
  }

  var hasResource = function (orderList, res) {
    for (var i = 0, l = orderList.length; i < l; i++) {
      if (isResMatch(res.id, orderList[i].id)) {
        return true
      }
    }
    return false
  }

  var visitDeps = function (resource, orderList) {
    if (!resource) {
      return
    }
    if (hasResource(orderList, resource)) {
      return
    }
    var deps = resource.deps
    if (deps && deps.length > 0) {
      var resources = mapResourceByKey(deps)
      // 对resource的每个依赖都去总资源表中查找对应的资源对象
      for (var i = 0, l = resources.length; i < l; i++) {
        visitDeps(resources[i], orderList)
      }
    }
    orderList.push(resource)
  }

  var getOrderResource = function () {
    var result = []
    if (res.unLoadRes && res.unLoadRes.length > 0) {
      var map = {}
      for (var i = 0, l = res.unLoadRes.length; i < l; i++) {
        visitDeps(res.unLoadRes[i], result)
      }
    }
    return result
  }

  var getOrderPaths = function () {
    var result = []
    var resources = getOrderResource()
    for (var i = 0, l = resources.length; i < l; i++) {
      for (var j = 0; j < resources[i].paths.length; j++) {
        if (!isAbsPath(resources[i].paths[j])) {
          resources[i].paths[j] = res.basePath + resources[i].paths[j]
        }
      }
      result = result.concat(resources[i].paths)
    }
    return result
  }

  res.unLoadRes = []

  /**
   * 添加资源
   */
  res.add = function (resource) {
    res.unLoadRes.push(resource)
  }

  res.load = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    var resPaths, cb
    // 设置加载后回调
    if (args.length > 0) {
      var last = args.pop()
      if (typeof last == 'function') {
        cb = last
      } else {
        args.push(last)
      }
    }
    var success = (function (callback, resList) {
      return function () {
        for (var i = 0, l = resList.length; i < l; i++) {
          var func = resList[i].success
          if (func) {
            func()
          }
        }
        if (callback) {
          callback()
        }
      }
    })(cb, res.unLoadRes.concat([]))
    var iter = function (paths) {
      var result = []
      for (var i = 0, l = paths.length; i < l; i++) {
        var path = paths[i]
        if (isAy(path)) {
          result = result.concat(iter(path))
        } else if (path) {
          //路径必须存在，否则在ie下会存在不执行回调问题
          result.push(isAbsPath(path) ? path : res.basePath + path)
        }
      }
      return result
    }
    resPaths = iter(args)
    var paths = getOrderPaths()
    resPaths = paths.concat(resPaths)
    if (isIE9) {
      // ie9下css和js不能同时请求，否则会造成回调很久之后才会被执行
      var css = [],
        script = []
      parseArgs(resPaths, css, script)
      filterLoadedCss(css)
      filterLoadedScript(script)
      if (success) {
        script.push(success)
      }
      var cssLoaded = (function (lib) {
        return function () {
          loadRes(lib)
        }
      })(script)
      if (css.length > 0) {
        var loader = ctx._$vplatformMatrix
        while (css.length > 1) {
          loader = loader.js(css.shift())
        }
        loader.js(css.shift(), cssLoaded)
      } else {
        cssLoaded()
      }
    } else {
      resPaths.push(success)
      loadRes(resPaths)
    }
    res.unLoadRes.length = 0
    return res
  }
})(window)
