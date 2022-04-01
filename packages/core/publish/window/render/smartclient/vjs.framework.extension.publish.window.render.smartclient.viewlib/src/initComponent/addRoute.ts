import { parseLogic } from '../utils'
import { ComponentRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import { ILogic, ILogics } from '../interfase/initComponentInterface'

const addRoute = (componentCode: string, logic: ILogic) => {
  const result = parseLogic(logic)
  if (result != null) {
    let { handler, ruleInstances, transactionInfo } = result
    let routeParams = {
      componentCode: componentCode,
      route: {
        routeCode: logic.ruleSets.ruleSet['$'].code,
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
    ComponentRoute.addRoute(routeParams)
  }
}

export default (componentCode: string, logics: ILogics) => {
  if (Array.isArray(logics)) {
    for (let item of logics) {
      addRoute(componentCode, item)
    }
  } else {
    addRoute(componentCode, logics.logic)
  }
}
