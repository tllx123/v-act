define('./Path', function (require, exports, module) {
  /**
   * 是否为绝对路径
   */
  var isAbsolute = function (path) {
    return path.charAt(0) === '/'
  }

  var normalizeArray = function (parts, allowAboveRoot) {
    var res = []
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i]
      if (!p || p === '.') {
        continue
      }
      if (p === '..') {
        if (res.length && res[res.length - 1] !== '..') {
          res.pop()
        } else if (allowAboveRoot) {
          res.push('..')
        }
      } else {
        res.push(p)
      }
    }
    return res
  }

  var normalize = function (path) {
    var isAbs = isAbsolute(path),
      trailingSlash = path && path[path.length - 1] === '/'
    path = normalizeArray(path.split('/'), !isAbs).join('/')
    if (!path && !isAbs) {
      path = '.'
    }
    if (path && trailingSlash) {
      path += '/'
    }
    return (isAbs ? '/' : '') + path
  }

  exports.join = function () {
    var paths = []
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      if (!typeof arg == 'string') {
        throw new TypeError('Arguments to path.join must be strings')
      }
      if (arg) {
        paths.push(arg)
      }
    }
    var joined = paths.join('/')
    if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
      joined = joined.replace(/^[\\\/]{2,}/, '/')
    }
    return normalize(joined)
  }
})
