import * as ParamConfig from './api/ParamConfig'

let undefined

exports.initModule = function (sb) {}

let createParam = function (json) {
  let param = new ParamConfig(json.code, json.name, json.type, json.initValue)
  let configs = json.configs
  if (configs && configs.length > 0) {
    for (let i = 0, len = configs.length; i < len; i++) {
      let pm = createParam(configs[i])
      param.appendConfig(pm)
    }
  }
  return param
}

const unSerialize = function (jsonArray) {
  let params = []
  for (let i = 0, json; (json = jsonArray[i]); i++) {
    params.push(createParam(json))
  }
  return params
}

export { unSerialize }
