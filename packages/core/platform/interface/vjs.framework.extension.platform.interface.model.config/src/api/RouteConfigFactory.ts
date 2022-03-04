import RouteConfig from './RouteConfig'
import * as ParamConfigFactory from './ParamConfigFactory'
import ParamConfig from './ParamConfig'
import { TransactionInfo, RuleInstances } from './types'

interface Param {
  routeCode: string
  handler: (...args: any[]) => void
  transactionType: string
  transactionInfo: TransactionInfo
  inputs: Array<ParamConfig>
  outputs: Array<ParamConfig>
  variables: Array<ParamConfig>
  ruleInstances: RuleInstances
}

let createParam = function (params: Array<ParamConfig>) {
  if (params) {
    return ParamConfigFactory.unSerialize(params)
  }
  return null
}

const unSerialize = function (json: Param) {
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

export { unSerialize }
