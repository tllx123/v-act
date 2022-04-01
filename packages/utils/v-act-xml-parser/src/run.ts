import type { XMLElementObj } from './parse'
import { ExpressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

let context = new FunctionContext()

// 获取Ele列表中指定标签
const filterTagEle = (
  target: XMLElementObj[],
  tagName: string
): XMLElementObj => {
  return target.filter((item) => item.tagName === tagName)[0]
}

export const run = (resources: XMLElementObj[]): Function => {
  return (ruleEngine: any, routeRuntime: any) => {
    runFun(resources)
    function runFun(resources: XMLElementObj[]) {
      let index = 0
      runTag(resources[0])
      function runTag(resource: XMLElementObj) {
        // if else状态开关
        let elseMark = false

        switch (resource.tagName) {
          case 'if':
            parseIf(resource)
            break
          case 'else':
            parseElse(resource)
            break
          case 'foreach':
            parseForEach(resource)
            break
          case 'evaluateRule':
            ruleEngine.executeWithRouteCallback(
              {
                ruleCode: resource.attrs.code,
                routeContext: routeRuntime
              },
              function () {
                index++
                if (index < resources.length) return runTag(resources[index])
              }
            )
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
            runFun(<XMLElementObj[]>sequence.children)
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
            runFun(<XMLElementObj[]>sequence.children)
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
            runFun(<XMLElementObj[]>sequence.children)
          }
        }
      }
    }
  }
}
