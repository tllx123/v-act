const calculateAsciiCode = function (url:string, data:any) {
  let params = []
  let ecodeNum = 0
  /* 分析url的参数 */
  if (undefined != url && url.indexOf('?') != -1) {
    let urlParamArr = url.split('?')[1].split('&')
    for (let i = 0, len = urlParamArr.length; i < len; i++) {
      let param = urlParamArr[i]
      if (param.indexOf('=') != -1) {
        let paramArr = param.split('=')
        params.push(paramArr[0])
        params.push(paramArr[1] + '')
      }
    }
  }
  /* 分析data的参数 */
  if (data) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let value = data[key]
        /* 前台发请求时，会过滤掉undefined参数，所以忽略掉 */
        if (value === undefined) {
          continue
        }
        params.push(key)
        /* 后台接收null或者空字符串时，值都是空字符串，不处理 */
        if (value === null || value === '') {
          continue
        }
        if (key == 'token') {
          let token = data.token
          let isContinue = true
          while (isContinue) {
            if (token.indexOf(':') != -1) {
              isContinue = false
            } else {
              token = decodeURIComponent(token)
              ecodeNum++
            }
          }
          params.push(encodeURIComponent(token))
        } else {
          params.push(data[key] + '')
        }
      }
    }
  }
  let count = 0
  if (params.length > 0) {
    for (let i = 0, len = params.length; i < len; i++) {
      let val = params[i]
      for (let j = 0, l = val.length; j < l; j++) {
        if (typeof val[j].codePointAt == 'function') {
          /* ES6的方法 */
          count += val[j].codePointAt()
        } else {
          count += val[j].charCodeAt()
        }
      }
    }
  }
  count += ''
  if (count.length > 16) count = count.substring(0, 16)
  return count
}

export { calculateAsciiCode }
