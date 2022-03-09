import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'

let sandbox

export function initModule(sandbox) {}

const getLessPlugin = function () {
  return {
    plugins: [
      {
        install: function (less, pluginManager) {
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
          var vistRootRules = function (rootRules) {
            if (!rootRules) {
              return
            }
            for (var i = 0, len = rootRules.length; i < len; i++) {
              var currentRules = rootRules[i].rules
              var currentFeatures = rootRules[i].features
              vistRules(currentRules)
              vistFeatures(currentFeatures)
            }
          }
          /**
           * 遍历less语句块内部的每一条具体规则
           */
          var vistRules = function (rules) {
            if (!rules || rules.length === 0) {
              return
            }
            for (var i = 0, len = rules.length; i < len; i++) {
              var rule = rules[i]
              if (rule.rules) {
                vistRules(rule.rules)
              }
              if (rule.value && rule.value.value) {
                rule.value.value = replaceValue(rule.value.value)
              }
            }
          }
          /**
           * 媒体查询等特性语句会在features节点
           */
          var vistFeatures = function (featureRules) {
            if (!featureRules || !featureRules.value) {
              return
            }
            var result = featureRules.value
            if (arrayUtil.isArray(result)) {
              replaceValue(result)
            } else {
              var featureValue = featureRules.value.value
              featureRules.value.value = replaceValue([featureValue])[0]
            }
          }
          /**
           * 将rpx单位转换为rem单位
           */
          var replaceValue = function (ruleValue) {
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
          var rpxToRem = function (number) {
            if (!number) {
              return number
            }
            number = parseFloat(number)
            number = (number * 10) / _options.viewportWidth
            var multiplier = Math.pow(10, _options.unitPrecision + 1),
              wholeNumber = Math.floor(number * multiplier)
            return (Math.round(wholeNumber / 10) * 10) / multiplier
          }

          pluginManager.addVisitor({
            isPreEvalVisitor: false,
            run: function (root) {
              vistRootRules(root.rules)
            }
          })
        }
      }
    ]
  }
}

export { getLessPlugin, render }
