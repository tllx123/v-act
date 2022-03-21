import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'

const getLessPlugin = function () {
  return {
    plugins: [
      {
        install: function (
          less: any,
          pluginManager: {
            addVisitor: (root: {
              isPreEvalVisitor: boolean
              run: (root: { rules: any }) => void
            }) => void
          }
        ) {
          let _options = {
            viewportWidth: 750,
            viewportHeight: 568,
            unitPrecision: 5,
            viewportUnit: 'rem',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: true
          }
          let rpxMatch = /(\d*\.?\d+)rpx/gi
          let keyFrameMatch = /^@[-\w]*?keyframes$/i
          /**
           * 遍历访问根节点的less规则
           */
          let vistRootRules = function (rootRules: string | any[]) {
            if (!rootRules) {
              return
            }
            for (let i = 0, len = rootRules.length; i < len; i++) {
              let currentRules = rootRules[i].rules
              let currentFeatures = rootRules[i].features
              vistRules(currentRules)
              vistFeatures(currentFeatures)
            }
          }
          /**
           * 遍历less语句块内部的每一条具体规则
           */
          let vistRules = function (rules: string | any[]) {
            if (!rules || rules.length === 0) {
              return
            }
            for (let i = 0, len = rules.length; i < len; i++) {
              let rule = rules[i]
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
          let vistFeatures = function (featureRules: {
            value: { value: any }
          }) {
            if (!featureRules || !featureRules.value) {
              return
            }
            let result = featureRules.value
            if (arrayUtil.isArray(result)) {
              replaceValue(result)
            } else {
              let featureValue = featureRules.value.value
              featureRules.value.value = replaceValue([featureValue])[0]
            }
          }
          /**
           * 将rpx单位转换为rem单位
           */
          let replaceValue = function (ruleValue: any) {
            if (!ruleValue) {
              return ruleValue
            }
            if (Array.isArray(ruleValue)) {
              for (let index = 0; index < ruleValue.length; index++) {
                let valueItem = ruleValue[index]
                if (!valueItem.value) {
                  continue
                }
                if (Array.isArray(valueItem.value)) {
                  replaceValue(valueItem.value)
                }
                let valUnit = valueItem.unit
                if (valUnit) {
                  let unitIndex = valUnit.numerator
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
                return rpxToRem($1) + _options.viewportUnit
              })
            }
            return ruleValue
          }
          /**
           * 将给定的rpx数值转换为对应的em数值
           */
          let rpxToRem = function (number: string | number) {
            if (!number) {
              return number
            }

            number = parseFloat(String(number))

            number = (number * 10) / _options.viewportWidth
            let multiplier = Math.pow(10, _options.unitPrecision + 1),
              wholeNumber = Math.floor(number * multiplier)
            return (Math.round(wholeNumber / 10) * 10) / multiplier
          }

          pluginManager.addVisitor({
            isPreEvalVisitor: false,
            run: function (root: { rules: any }) {
              vistRootRules(root.rules)
            }
          })
        }
      }
    ]
  }
}

export { getLessPlugin }
