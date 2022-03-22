const getLessPlugin = function (scopedId: string, newVDeepSelector: string) {
  return {
    plugins: [
      {
        install: function (less: ILess, pluginManager: IPluginManager) {
          /**
           * 遍历访问根节点的less规则
           */
          let vistRootRules = function (rootRules: rootRule[], params: IParam) {
            if (!rootRules) {
              return
            }
            let context: IContext = {
              currentSelector: undefined,
              currentElements: undefined,
              selectorIndex: 0,
              params: params || {},
              $rootRules: [],
              currentRootRule: null
            }
            context.$rootRules = rootRules
            for (let i = 0, len = rootRules.length; i < len; i++) {
              context.currentRootRule = rootRules[i]
              context.rootRulesIndex = i
              let currentSelectors = rootRules[i].selectors
              let currentRules = rootRules[i].rules
              let currentFeatures = rootRules[i].features
              vistRules(currentRules, context)
              vistSelectors(currentSelectors, context)
            }
          }
          /**
           * 遍历less语句块内部的每一条具体规则
           */
          let vistRules = function (rules: any[], context: IContext) {
            if (!rules || rules.length === 0) {
              return
            }
            for (let i = 0, len = rules.length; i < len; i++) {
              let rule = rules[i]
              if (rule.rules) {
                vistRules(rule.rules, context)
              }
              if (rule.selectors) {
                vistSelectors(rule.selectors, context)
              }
            }
          }
          /**
           * 遍历当前节点的全部选择器
           */
          let vistSelectors = function (selectors: any[], context: IContext) {
            if (!selectors || selectors.length === 0) {
              return
            }
            for (let i = 0; i < selectors.length; i++) {
              context.currentElements = selectors[i].elements
              context.selectorIndex = i
              vistSelectorElements(context)
            }
          }
          /**
           * 深度选择器位置，如果未找到，则返回-1
           */
          let deepSelectorIndex = function (
            elements: any[],
            newVDeepSelector: string
          ) {
            let result = {
              vDeepSelectorIndex: -1, //深度选择器下标
              pseudoClassIndex: -1 //伪类下标
            }
            for (let i = 0; i < elements.length; i++) {
              let element = elements[i]
              let value
              if (typeof element.value === 'object' && element.value.value) {
                value = element.value.value
                while (true) {
                  if (typeof value === 'object' && null != value) {
                    value = value.value
                  } else {
                    break
                  }
                }
              } else if (typeof element.value === 'string') {
                value = element.value
              }
              if (!value) {
                continue
              }
              if (value === newVDeepSelector) {
                result.vDeepSelectorIndex = i
                break
              } else if (value.startsWith(':')) {
                result.pseudoClassIndex = i
              }
            }
            return result
          }
          /**
           * 遍历选择器上的每一个元素
           */
          let vistSelectorElements = function (context: IContext) {
            let currentElements = context.currentElements
            if (
              !currentElements ||
              currentElements.length === 0 ||
              !context.params.scopedId
            ) {
              return
            }
            let newVDeepSelector = context.params.newVDeepSelector
            let indexDatas = deepSelectorIndex(
              currentElements,
              newVDeepSelector
            )
            if (
              indexDatas.vDeepSelectorIndex != -1 ||
              indexDatas.pseudoClassIndex == -1
            ) {
              //有深度选择器或者没有伪元素的执行原来的逻辑
              let index = indexDatas.vDeepSelectorIndex
              let endIndex = index != -1 ? index : currentElements.length
              while (--endIndex >= 0) {
                let el = currentElements[endIndex]
                if (el.nodeVisible && !el.isletiable) {
                  let currentSelector = context.currentSelector
                  // @ts-ignore
                  let attrEle = new less.tree.Element(
                    '',
                    new less.tree.Attribute(context.params.scopedId),
                    false
                  )
                  attrEle.parent = currentSelector
                  currentElements.splice(
                    endIndex + 1,
                    index != -1 ? 1 : 0,
                    attrEle
                  )
                  break
                }
              }
            } else {
              //没有深度选择器并且有伪元素的逻辑
              let endIndex = indexDatas.pseudoClassIndex
              while (--endIndex >= 0) {
                let el = currentElements[endIndex]
                if (el.nodeVisible && !el.isletiable) {
                  let currentSelector = context.currentSelector
                  // @ts-ignore
                  let attrEle = new less.tree.Element(
                    '',
                    new less.tree.Attribute(context.params.scopedId),
                    false
                  )
                  attrEle.parent = currentSelector
                  currentElements.splice(endIndex + 1, 0, attrEle)
                  break
                }
              }
            }
          }

          pluginManager.addVisitor({
            isPreEvalVisitor: false,
            run: function (root) {
              let params = {
                scopedId: scopedId,
                newVDeepSelector: newVDeepSelector
              }
              vistRootRules(root.rules, params)
            }
          })
        }
      }
    ]
  }
}

export { getLessPlugin }
