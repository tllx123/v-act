/**
 * 是否为绝对路径
 */
var isAbsolute = function (path: string) {
  return path.charAt(0) === '/'
}

var normalizeArray = function (parts: string | any[], allowAboveRoot: boolean) {
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

var normalize = function (path: string) {
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

export function join(...vals: string[]) {
  var paths = []
  for (var i = 0; i < vals.length; i++) {
    var arg = vals[i]
    if (!(typeof arg == 'string')) {
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
