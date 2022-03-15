import { run } from '../../../../../../../utils/v-act-xml-parser/src/index'
import { WindowRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'

type logicType = {
  $: { type: string }
  ruleInstances: any
  ruleSets: { ruleSet: any }
}

type XMLElementObj = {
  tagName: string
  attrs: { [key: string]: string | number | undefined }
  children: Array<string | number | boolean | undefined | XMLElementObj>
}

type routeParamsType = {
  handler: Function | null
  ruleInstances: {}
  transactionInfo: {}
}

type ruleInstanceType = {
  $: {
    instanceCode: string
    instanceName: string
    isEnabled: string
    isNeedLog: string
    ruleCode: string
    ruleName: string
    transactionType: string
  }
  condition: string
  ruleConfig: string
}

const getRuleInstances = (ruleInstances: {
  ruleInstance: ruleInstanceType | ruleInstanceType[]
}): object => {
  let instances = {}
  const setInstances = (instance: ruleInstanceType): void => {
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

  if (Array.isArray(ruleInstances.ruleInstance)) {
    for (let instance of ruleInstances.ruleInstance) {
      setInstances(instance)
    }
  } else {
    setInstances(ruleInstances.ruleInstance)
  }
  return instances
}

const renderRoute = (logic: logicType): routeParamsType => {
  let routeParamsType: routeParamsType = {
    handler: null,
    ruleInstances: {},
    transactionInfo: {}
  }
  if (logic['$'].type == 'client') {
    routeParamsType = madeData(logic.ruleSets.ruleSet, logic.ruleInstances)
  }

  function madeData(
    ruleSet: { ruleInstances: any; ruleRoute: any },
    ruleInstances: any
  ): routeParamsType {
    let { ruleRoute } = ruleSet
    return {
      handler: Array.isArray(ruleRoute['_']) ? run(ruleRoute['_']) : null,
      ruleInstances: getRuleInstances(ruleSet.ruleInstances),
      transactionInfo: {}
    }
  }

  return routeParamsType
}

const addRoute = (
  componentCode: string,
  windowCode: string,
  logic: logicType
) => {
  let { handler, ruleInstances, transactionInfo } = renderRoute(logic)

  let $addRoute = WindowRoute.addRoute

  let routeParams = {
    componentCode: componentCode,
    windowCode: windowCode,
    route: {
      routeCode: logic.ruleSets.ruleSet.$.code,
      outputs: null,
      transactionType: 'TRANSACTION',
      handler: function (
        ruleEngine: {
          executeWithRouteCallback: (config: {
            ruleCode: string
            routeContext: any
          }) => void
        },
        routeRuntime: any
      ) {
        handler && handler(ruleEngine, routeRuntime)
      },
      variables: [],
      inputs: null,
      ruleInstances: ruleInstances,
      transactionInfo: transactionInfo
    }
  }
  console.log('添加route，结构：', routeParams)
  $addRoute(routeParams)
}

const init = function (params: {
  componentCode: string
  windowCode: string
  winDatas: { logics: { logic: logicType | logicType[] } }
}) {
  console.log('初始化')

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
