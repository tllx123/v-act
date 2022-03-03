import * as RouteConfig from './api/RouteConfig'
import * as ParamConfigFactory from './api/ParamConfigFactory'

let undefined

exports.initModule = function (sb) {}

let createParam = function (params) {
  if (params) {
    return ParamConfigFactory.unSerialize(params)
  }
  return null
}

const unSerialize = function (json) {
  let inputs = createParam(json.inputs)
  let outputs = createParam(json.outputs)
  let vars = createParam(json.variables)
  return new RouteConfig(
    json.routeCode,
    json.handler,
    inputs,
    outputs,
    vars,
    json.transactionInfo,
    json.ruleInstances,
    json.transactionType
  )
}

export { unSerialize, unSerialize }
