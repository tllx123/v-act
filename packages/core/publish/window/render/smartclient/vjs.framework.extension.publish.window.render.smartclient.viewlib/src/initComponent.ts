import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import { ComponentInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { IParams } from './interfase/initComponentInterface'
import { logicType } from './interfase/ruleSetInterFace'
import { parseLogic, parseData } from './utils'

const addRoute = (componentCode: string, logic: logicType) => {
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

const init = function ({ componentCode, componentSchema }: IParams) {
  // 判断是否已经初始化
  if (ComponentInfo.isComponentSchemaInited(componentCode)) return

  let { variants, options, logics } = componentSchema

  if (Array.isArray(variants)) {
    for (let item of variants) {
      ComponentParam.addVariantDefines(componentCode, parseData(item.variant))
    }
  } else {
    ComponentParam.addVariantDefines(componentCode, parseData(variants.variant))
  }

  if (Array.isArray(options)) {
    for (let item of options) {
      ComponentParam.addOptionDefines(componentCode, parseData(item.option))
    }
  } else {
    ComponentParam.addOptionDefines(componentCode, parseData(options.option))
  }

  let { logic } = logics
  // 如果是数组，则添加多个Route
  if (Array.isArray(logic)) {
    for (let item of logic) {
      addRoute(componentCode, item)
    }
  } else {
    addRoute(componentCode, logic)
  }

  // 标记初始化
  ComponentInfo.markComponentSchemaInited('vact')
}
export { init }
