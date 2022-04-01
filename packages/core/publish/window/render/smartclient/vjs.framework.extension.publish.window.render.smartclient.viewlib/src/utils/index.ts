import {
  logicType,
  routeParamsSchema,
  ruleInstanceSchema
} from '../interfase/ruleSetInterFace'
import { run } from '@v-act/xml-parser'

const setInstances = (
  instance: ruleInstanceSchema,
  instances: { [code: string]: any }
): void => {
  let {
    ruleConfig,
    $: {
      instanceCode,
      isEnabled,
      ruleCode,
      isNeedLog,
      instanceName,
      transactionType,
      ruleName
    }
  } = instance

  instances[instanceCode] = {
    enable: isEnabled === 'True',
    condition: '',
    ruleCode: ruleCode,
    instanceCode: instanceCode,
    needLog: isNeedLog === 'True',
    instanceName: instanceName,
    transactionType: transactionType,
    ruleName: ruleName,
    inParams: ruleConfig
  }
}
const getRuleInstances = (ruleInstances: ruleInstanceSchema[]): object => {
  let instances = {}
  for (let instance of ruleInstances) {
    setInstances(instance, instances)
  }
  return instances
}

const parseLogic = (logic: logicType): routeParamsSchema | null => {
  if (logic['$'].type == 'client') {
    const ruleSet = logic.ruleSets.ruleSet
    const ruleRoute = ruleSet.ruleRoute
    const ruleInstances = ruleSet.ruleInstances.ruleInstance
    const ruleInstanceList = ruleInstances
      ? Array.isArray(ruleInstances)
        ? ruleInstances
        : [ruleInstances]
      : []
    if (logic.ruleInstances && logic.ruleInstances.ruleInstance) {
      if (Array.isArray(logic.ruleInstances.ruleInstance)) {
        logic.ruleInstances.ruleInstance.forEach((inst) => {
          ruleInstanceList.push(inst)
        })
      } else {
        ruleInstanceList.push(logic.ruleInstances.ruleInstance)
      }
    }
    let route: routeParamsSchema = {
      handler: Array.isArray(ruleRoute['_']) ? run(ruleRoute['_']) : null,
      ruleInstances: getRuleInstances(ruleInstanceList),
      transactionInfo: {}
    }
    return route
  } else {
    return null
  }
}

const parseData = (data: { $: any }[]): any[] => {
  const newArr: any[] = []
  data.forEach((item) => newArr.push(item['$']))
  return newArr
}

export { parseLogic, parseData }
