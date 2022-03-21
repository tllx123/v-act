const getLessPlugin = function (scopedId: string | number) {
  return {
    plugins: [
      {
        install: function (less: ILess, pluginManager: IPluginManager) {
          var _options = {
            viewportWidth: 750,
            viewportHeight: 568,
            unitPrecision: 5,
            viewportUnit: 'rem',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: true
          }
          var rpxMatch = /(\d*\.?\d+)rpx/gi
          var keyFrameMatch = /^@[-\w]*?keyframes$/i
          /**
           * 遍历访问根节点的less规则
           */
          var vistRootRules = function (rootRules: rootRule[], params: IParam) {
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
            for (var i = 0, len = rootRules.length; i < len; i++) {
              context.currentRootRule = rootRules[i]
              context.rootRulesIndex = i
              var currentSelectors = rootRules[i].selectors
              var currentRules = rootRules[i].rules
              var currentFeatures = rootRules[i].features
              vistRules(currentRules, context)
              vistSelectors(currentSelectors, context)
              vistFeatures(currentFeatures, context)
            }
          }
          /**
           * 遍历less语句块内部的每一条具体规则
           */
          var vistRules = function (rules: any[], context: IContext) {
            if (!rules || rules.length === 0) {
              return
            }
            for (var i = 0, len = rules.length; i < len; i++) {
              var rule = rules[i]
              if (rule.rules) {
                vistRules(rule.rules, context)
              }
              if (rule.selectors) {
                vistSelectors(rule.selectors, context)
              }
              if (rule.value && rule.value.value) {
                rule.value.value = replaceValue(rule.value.value)
              }
            }
          }
          /**
           * 媒体查询等特性语句会在features节点
           */
          var vistFeatures = function (
            featureRules: { value: { value: any } },
            context: IContext
          ) {
            if (!featureRules || !featureRules.value) {
              return
            }
            var featureValue = featureRules.value.value
            featureRules.value.value = replaceValue([featureValue])[0]
          }
          /**
           * 将rpx单位转换为rem单位
           */
          var replaceValue = function (ruleValue: string | any[]) {
            if (!ruleValue) {
              return ruleValue
            }
            if (Array.isArray(ruleValue)) {
              for (var index = 0; index < ruleValue.length; index++) {
                var valueItem = ruleValue[index]
                if (!valueItem.value) {
                  continue
                }
                if (Array.isArray(valueItem.value)) {
                  replaceValue(valueItem.value)
                }
                var valUnit = valueItem.unit
                if (valUnit) {
                  var unitIndex = valUnit.numerator
                    ? valUnit.numerator.indexOf('rpx')
                    : -1
                  if ('rpx' === valUnit.backupUnit || unitIndex > -1) {
                    valueItem.value = rpxToRem(valueItem.value)
                    valUnit.backupUnit = _options.viewportUnit
                    valUnit.numerator[unitIndex] = _options.viewportUnit
                  }
                }
              }
            } else if (typeof ruleValue === 'string') {
              ruleValue = ruleValue.replace(rpxMatch, function (match, $1) {
                if (!$1) {
                  return match
                }
                var pixels = parseFloat($1)
                return rpxToRem($1) + _options.viewportUnit
              })
            }
            return ruleValue
          }
          /**
           * 将给定的rpx数值转换为对应的em数值
           */
          var rpxToRem = function (number: string | number) {
            if (!number) {
              return number
            }
            number = parseFloat(String(number))
            number = (number * 10) / _options.viewportWidth
            var multiplier = Math.pow(10, _options.unitPrecision + 1),
              wholeNumber = Math.floor(number * multiplier)
            return (Math.round(wholeNumber / 10) * 10) / multiplier
          }
          /**
           * 遍历当前节点的全部选择器
           */
          var vistSelectors = function (selectors, context) {
            if (!selectors || selectors.length === 0) {
              return
            }
            for (var i = 0; i < selectors.length; i++) {
              context.currentElements = selectors[i].elements
              context.selectorIndex = i
              vistSelectorElements(context)
            }
          }
          /**
           * 深度选择器位置，如果未找到，则返回-1
           */
          var deepSelectorIndex = function (elements) {
            for (var i = 0; i < elements.length; i++) {
              var element = elements[i]
              if (
                typeof element.value === 'object' &&
                element.value.value &&
                element.value.value === '>>>'
              ) {
                return i
              }
            }
            return -1
          }
          /**
           * 遍历选择器上的每一个元素
           */
          var vistSelectorElements = function (context) {
            var currentElements = context.currentElements
            if (
              !currentElements ||
              currentElements.length === 0 ||
              !context.params.scopedId
            ) {
              return
            }
            var index = deepSelectorIndex(currentElements)
            var endIndex = index != -1 ? index : currentElements.length
            while (--endIndex >= 0) {
              var el = currentElements[endIndex]
              if (el.nodeVisible && !el.isVariable) {
                var currentSelector = context.currentSelector
                var attrEle = new less.tree.Element(
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
          }

          pluginManager.addVisitor({
            isPreEvalVisitor: false,
            run: function (root) {
              var params = {
                scopedId: scopedId
              }
              vistRootRules(root.rules, params)
            }
          })
        }
      }
    ]
  }
}

export { getLessPlugin, getLessPlugin }
