//皮肤变量数据
let SkinVariableDatas: Record<string, any> = {}

const put = function (params: Record<string, any>) {
  if (params && params.id && params.vars) {
    let id = params.id
    let vars = params.vars
    let less = params.less
    let datas = SkinVariableDatas[id]
    if (!datas) {
      datas = SkinVariableDatas[id] = { vars: {}, less: null }
    }
    datas.less = less
    for (let key in vars) {
      if (!vars.hasOwnProperty(key)) {
        continue
      }
      let val = vars[key]
      if (null != val) {
        val = (val + '').trim()
        if (val.length < 1 || ';' != val.substring(val.length - 1)) {
          val = val + ';'
        }
      } else {
        val = ';'
      }
      datas.vars[key] = val
    }
  }
}

const getVarScript = function (params: Record<string, any>) {
  if (params && params.id) {
    let id = params.id
    let datas = SkinVariableDatas[id]
    if (datas) {
      let vars = datas.vars,
        arr = []
      if (vars) {
        for (let key in vars) {
          if (!vars.hasOwnProperty(key)) {
            continue
          }
          arr.push(key + ':' + vars[key])
        }
      }
      let less = datas.less
      if (less) {
        arr.push(less)
      }
      return arr.join('')
    }
  }
  return ''
}

const getVarValue = function (params: Record<string, any>) {
  let id = params.id
  let code = params.code
  let value = params.defaultValue
  if (!id || !code) {
    return value
  }
  if (SkinVariableDatas[id]) {
    let datas = SkinVariableDatas[id]
    let vars = datas.vars
    if (vars.hasOwnProperty(code)) {
      return vars[code]
    }
  }
  return value
}

export { getVarScript, getVarValue, put }
