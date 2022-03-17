import { run } from '@v-act/xml-parser'
import { WindowRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import {
  logicType,
  routeParamsSchema,
  ruleInstanceSchema
} from './interfase/ruleSetInterFace'

const setInstances = (
  instance: ruleInstanceSchema,
  instances: { [key: string]: any }
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

const getRuleInstances = (ruleInstances: Array<ruleInstanceSchema>): object => {
  let instances = {}
  for (let instance of ruleInstances) {
    setInstances(instance, instances)
  }
  return instances
}

const parseLogic = (logic: logicType): routeParamsSchema | null => {
  if (logic['$'].type == 'client') {
    const ruleSet2 = logic.ruleSets.ruleSet
    const ruleRoute = ruleSet2.ruleRoute
    const ruleInstances = ruleSet2.ruleInstances.ruleInstance
    const ruleInstanceList = Array.isArray(ruleInstances)
      ? ruleInstances
      : [ruleInstances]
    if (logic.ruleInstances && logic.ruleInstances.ruleInstance) {
      if (Array.isArray(logic.ruleInstances.ruleInstance)) {
        logic.ruleInstances.ruleInstance.forEach((inst: ruleInstanceSchema) => {
          ruleInstanceList.push(inst)
        })
      } else {
        ruleInstanceList.push(logic.ruleInstances.ruleInstance)
      }
    }
    let route = {
      handler: Array.isArray(ruleRoute['_']) ? run(ruleRoute['_']) : null,
      ruleInstances: getRuleInstances(ruleInstanceList),
      transactionInfo: {}
    }
    return route
  } else {
    return null
  }
}

const addRoute = (
  componentCode: string,
  windowCode: string,
  logic: logicType
) => {
  const result = parseLogic(logic)
  if (result != null) {
    let { handler, ruleInstances, transactionInfo } = result
    let routeParams = {
      componentCode,
      windowCode,
      route: {
        routeCode: logic.ruleSets.ruleSet['$'].code,
        outputs: null,
        transactionType: 'TRANSACTION',
        handler: function (ruleEngine: any, routeRuntime: any) {
          handler && handler(ruleEngine, routeRuntime)
        },
        variables: [],
        inputs: null,
        ruleInstances,
        transactionInfo
      }
    }
    WindowRoute.addRoute(routeParams)
  }
}

const init = function (params: {
  componentCode: string
  windowCode: string
  winDatas: { logics: { logic: logicType | logicType[] } }
}) {
  const { componentCode, windowCode, winDatas } = params
  let { logic } = winDatas.logics
  // 如果是数组，则添加多个Route
  if (Array.isArray(logic)) {
    for (let item of logic) {
      addRoute(componentCode, windowCode, item)
    }
  } else {
    addRoute(componentCode, windowCode, logic)
  }
}

export { init }
