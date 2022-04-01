import { WindowRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import { WindowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { logicType } from './interfase/ruleSetInterFace'
import { parseLogic, parseData } from './utils'

const addRoute = (
  componentCode: string,
  windowCode: string,
  logic: logicType
) => {
  const result = parseLogic(logic)
  if (result != null) {
    let { handler, ruleInstances, transactionInfo } = result
    let routeParams = {
      componentCode: componentCode,
      windowCode: windowCode,
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
    WindowRoute.addRoute(routeParams)
  }
}

const init = function (params: {
  componentCode: string
  windowCode: string
  winDatas: {
    logics: { logic: logicType | logicType[] }
    windowOutputs: any
    windowVariants: any
  }
}) {
  const { componentCode, windowCode, winDatas } = params

  let outputVariables = winDatas.windowOutputs.variables
  let inputVariables = winDatas.windowVariants.variables

  if (inputVariables) {
    if (Array.isArray(outputVariables)) {
      for (let item of outputVariables) {
        item.variable &&
          WindowParam.addOutputDefines(
            componentCode,
            windowCode,
            parseData(item.variable)
          )
      }
    } else {
      outputVariables.variable &&
        WindowParam.addOutputDefines(
          componentCode,
          windowCode,
          parseData(outputVariables.variable)
        )
    }
  }
  if (inputVariables) {
    if (Array.isArray(inputVariables)) {
      for (let item of inputVariables) {
        item.variable &&
          WindowParam.addInputDefines(
            componentCode,
            windowCode,
            parseData(item.variable)
          )
      }
    } else {
      inputVariables.variable &&
        WindowParam.addInputDefines(
          componentCode,
          windowCode,
          parseData(inputVariables.variable)
        )
    }
  }
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
