import { run } from '../../../../../../../utils/v-act-xml-parser/src/index'
type logicType = {
  $: { type: string }
  ruleInstances: any
  ruleSets: { ruleSet: any }
}

type XMLElementObj = {
  tagName: string
  attrs: { [key: string]: string | number | undefined }
  children: Array<string | number | boolean | undefined | XMLElementObj>
}

const renderHandlers = (rules: XMLElementObj[]) => {
  let handler: Function = run(rules)

  handler(ruleEngine, routeRuntime)
}

const init = function (params: { winDatas: any }) {
  const windowDatas = params.winDatas
  let logics:
    | {
        logic: logicType
      }
    | logicType[] = windowDatas.logics

  if (Array.isArray(logics)) {
    for (let logic of logics) {
      if (logic['$'].type == 'client') {
        let {
          ruleSet: { ruleRoute }
        } = logic.ruleSets
        // @ts-ignore
        Array.isArray(ruleRoute['_']) && renderHandlers(ruleRoute['_'])
      }
    }
  } else {
    let { logic } = logics
    if (logic['$'].type == 'client') {
      let {
        ruleSet: { ruleRoute }
      } = logic.ruleSets
      // @ts-ignore
      Array.isArray(ruleRoute['_']) && renderHandlers(ruleRoute['_'])
    }
  }
}

export { init }
