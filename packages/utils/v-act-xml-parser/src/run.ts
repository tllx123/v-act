import type { XMLElementObj } from './parse'
import { ExpressionEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

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
      // if else状态开关
      let elseMark = false

      runTag(resources[0])
      function runTag(resource: XMLElementObj) {
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
            runTag(resources[index++])
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
          const define: XMLElementObj = filterTagEle(
            <XMLElementObj[]>target.children,
            'define'
          )

          const sequence: XMLElementObj = filterTagEle(
            <XMLElementObj[]>target.children,
            'sequence'
          )
          const varCode: XMLElementObj = filterTagEle(
            <XMLElementObj[]>define.children,
            'varCode'
          )
          const entityType: XMLElementObj = filterTagEle(
            <XMLElementObj[]>define.children,
            'entityType'
          )
          const entityCode: XMLElementObj = filterTagEle(
            <XMLElementObj[]>define.children,
            'entityCode'
          )

          // 开域
          ScopeManager.openScope(routeRuntime.__scopeId__)

          let datasource = DatasourceManager.lookup({
            datasourceName: entityCode.children[0]
          })

          // 关域
          ScopeManager.closeScope()

          if (null == datasource) {
            routeRuntime.handleException(
              new Error(
                'Foreach\u7684\u5b9e\u4f53\u3010' +
                  entityCode.children[0] +
                  '\u3011\u4e0d\u5b58\u5728'
              )
            )
            return false
          }
          let values = datasource.getAllRecords().toArray()
          for (let i = 0, l = values.length; i < l; i++) {
            routeRuntime.setForEachVar({
              code: varCode.children[0] as string,
              value: values[i],
              datasource: datasource
            })
            runFun(<XMLElementObj[]>sequence.children)
          }
        }
      }
    }
  }
}
