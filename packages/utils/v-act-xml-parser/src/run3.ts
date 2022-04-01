import type { XMLElementObj } from './parse'
import { ExpressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

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
  let context = new FunctionContext()
  let codes: string[] = []

  // if else状态开关
  let elseMark = false

  return function (
    ruleEngine: {
      executeWithRouteCallback: (
        config: {
          ruleCode: string
          routeContext: any
        },
        func: (index: number) => any
      ) => any
    },
    routeRuntime: any
  ) {
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

        context.routeContext = routeRuntime

        let judgment = ExpressionEngine.execute({
          context: context,
          expression: expression.children[0]
        })
        if (judgment) {
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
        console.log('进入for循环')
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

    function runFun(index: number) {
      if (routeRuntime.isInterrupted()) {
        routeRuntime.fireRouteCallBack()
        return
      }
      ruleEngine.executeWithRouteCallback(
        {
          ruleCode: codes[index],
          routeContext: routeRuntime
        },
        function () {
          index++
          if (index < codes.length) return runFun(index)
        }
      )
    }

    return runFun(0)
  }
}
