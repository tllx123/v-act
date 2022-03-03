exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs()
  let key = args[0]
  //是否解码,默认解码
  let isDeCode = false === args[1] ? false : true
  let retStr = ''
  let url = window.document.location.href.toString()
  let u = url.split('?')
  let get = {}
  if (typeof u[1] == 'string') {
    u = u[1].split('&')
    for (let i = 0; i < u.length; i++) {
      let j = u[i].split('=')
      get[j[0]] = j[1]
    }
  }
  if (get.hasOwnProperty(key)) {
    let val = get[key]
    if (isDeCode && null != val) {
      retStr = decodeURIComponent(val)
    } else {
      retStr = val
    }
  }
  return retStr
}

export { main }
