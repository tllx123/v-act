import ParamConfig from './ParamConfig'

const createParam = function (json: ParamConfig) {
  const param = new ParamConfig(json.code, json.name, json.type, json.initValue)
  const configs = json.configs
  if (configs && configs.length > 0) {
    for (let i = 0, len = configs.length; i < len; i++) {
      const pm = createParam(configs[i])
      param.appendConfig(pm)
    }
  }
  return param
}

const unSerialize = function (jsonArray: Array<ParamConfig>) {
  const params = []
  for (let i = 0, json; (json = jsonArray[i]); i++) {
    params.push(createParam(json))
  }
  return params
}

export { unSerialize }
