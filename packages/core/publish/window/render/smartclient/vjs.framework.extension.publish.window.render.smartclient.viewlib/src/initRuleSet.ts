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
      extraFuncs: ['I18nExpression'],
      languageItem: [
        {
          value: null,
          id: null,
          defaultValue: 'asdfasdf',
          code: 'lang.var6a204bd89f3c8348afd5c77c717a097a',
          desc: '\u8868\u8fbe\u5f0f\u914d\u7f6e\uff1a"asdfasdf"',
          componentInstance: null,
          translatedValue: 'asdfasdf',
          translated: false
        }
      ],
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

const renderRoute = (logics: any[] | { logic: logicType }): routeParamsType => {
  let routeParamsType: routeParamsType = {
    handler: null,
    ruleInstances: {},
    transactionInfo: {}
  }
  if (Array.isArray(logics)) {
    for (let logic of logics) {
      if (logic['$'].type == 'client') {
        routeParamsType = madeData(logic.ruleSets.ruleSet, logic.ruleInstances)
      }
    }
  } else {
    let { logic } = logics
    if (logic['$'].type == 'client') {
      routeParamsType = madeData(logic.ruleSets.ruleSet, logic.ruleInstances)
    }
  }
  function madeData(
    ruleSet: { ruleInstances: any; ruleRoute: any },
    ruleInstances: any
  ): routeParamsType {
    let { ruleRoute } = ruleSet
    return {
      handler: Array.isArray(ruleRoute['_']) ? run(ruleRoute['_']) : null,
      ruleInstances: getRuleInstances(ruleInstances),
      transactionInfo: {}
    }
  }

  return routeParamsType
}

const addRoute = (
  componentCode: string,
  windowCode: string,
  windowDatas: { logics: { logic: logicType } | logicType[] }
) => {
  let { handler, ruleInstances, transactionInfo } = renderRoute(
    windowDatas.logics
  )

  let $addRoute = WindowRoute.addRoute

  let routeParams = {
    componentCode: componentCode,
    windowCode: windowCode,
    route: {
      routeCode: 'JGButton1_OnClick',
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
  console.log('最终结构', routeParams)
  $addRoute(routeParams)
}

const init = function (params: {
  componentCode: string
  windowCode: string
  winDatas: { logics: { logic: logicType } | logicType[] }
}) {
  const { componentCode, windowCode, winDatas } = params
  addRoute(componentCode, windowCode, winDatas)
}

export { init }
