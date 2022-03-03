import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs()
  let variables = args[0]
  if (variables) {
    variables =
      typeof variables == 'string' ? eval('(' + variables + ')') : variables
    for (let variableName in variables) {
      let datasource = manager.lookup({
        datasourceName: variableName
      })
      let val = variables[variableName]
      if (Object(val) === val) {
        let datas = val.datas
        datasource.load({
          datas: datas.values,
          dataAmount: datas.recordCount,
          isAppend: false
        })
      }
    }
  }
}

export { main }
