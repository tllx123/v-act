import type { XMLElementObj } from './parse'

const ForInObj = (source: XMLElementObj[], executionRules: Function) => {
  for (let target of source) {
    executionRules && executionRules(target.tagName, target)
  }
}
// 获取Ele列表中指定标签
const filterTagEle = (
  target: XMLElementObj[],
  tagName: string
): XMLElementObj => {
  return target.filter((item) => item.tagName === tagName)[0]
}

export const run = (resources: XMLElementObj[]): Function => {
  let codes: string[] = []

  // if else状态开关
  let elseMark = false

  const executionRules = async (tagName: string, target: XMLElementObj) => {
    switch (tagName) {
      case 'if':
        parseIf(target)
        break
      case 'else':
        parseElse(target)
        break
      case 'foreach':
        parseForEach(target)
        break
      case 'evaluateRule':
        codes.push(String(target.attrs.code))
        break
    }

    function parseIf(target: XMLElementObj) {
      const define: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'define'
      )
      const sequence: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'sequence'
      )
      const expression: XMLElementObj = filterTagEle(
        <XMLElementObj[]>define.children,
        'expression'
      )

      if (expression.children[0] === 'True') {
        ForInObj(<XMLElementObj[]>sequence.children, executionRules)
      } else {
        elseMark = true
      }
    }

    function parseElse(target: XMLElementObj) {
      if (elseMark) {
        elseMark = false
        const sequence: XMLElementObj = filterTagEle(
          <XMLElementObj[]>target.children,
          'sequence'
        )
        ForInObj(<XMLElementObj[]>sequence.children, executionRules)
      }
    }

    function parseForEach(target: XMLElementObj) {
      const sequence: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'sequence'
      )
      const varCode: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'varCode'
      )
      const entityType: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'entityType'
      )
      const entityCode: XMLElementObj = filterTagEle(
        <XMLElementObj[]>target.children,
        'entityCode'
      )

      for (let i = 0; i < 3; i++) {
        ForInObj(<XMLElementObj[]>sequence.children, executionRules)
      }
    }
  }
  ForInObj(resources, executionRules)

  let returnFun = function (
    ruleEngine: {
      executeWithRouteCallback: (config: {
        ruleCode: string
        routeContext: any
      }) => void
    },
    routeRuntime: any
  ) {
    for (let code of codes) {
      if (routeRuntime.isInterrupted()) {
        routeRuntime.fireRouteCallBack()
        break
      }

      ruleEngine.executeWithRouteCallback({
        ruleCode: code,
        routeContext: routeRuntime
      })
    }
  }

  return returnFun
}
