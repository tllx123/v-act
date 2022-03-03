import * as Datasource from './api/Datasource'
import { MetadataFactory as metadataFactory } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { ExpressionUtil as expressionUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.expression'
import { log as log } from '@v-act/vjs.framework.extension.util'

let sandbox

let _getDSContructor = function () {
  let datasourceFactory = sandbox.getService(
    'vjs.framework.extension.system.datasource.factory'
  )
  return datasourceFactory.getDBConstructor()
}

let _getExpressionObserveDatasources = function (expression) {
  let observeDatasources = null
  let regex = new RegExp('\\[([^\\]]+)\\]\\.\\[([^\\]]+)\\]', 'gm')
  let matcher
  while ((matcher = regex.exec(expression))) {
    if (observeDatasources == null) {
      observeDatasources = {}
    }
    let datasourceName = matcher[1]
    let datasourceFieldCode = matcher[2]
    if (observeDatasources[datasourceName])
      observeDatasources[datasourceName].push(datasourceFieldCode)
    else observeDatasources[datasourceName] = [datasourceFieldCode]
  }
  return observeDatasources
}

let _createExpressionHandler = function (datasource) {
  let metadata = datasource.getMetadata()
  let fields = metadata.getFields()
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i]
    let expression = field.getExpression()
    if (undefined == expression || null == expression) {
      expression = ''
    }
    if ('' != expression) {
      let observeDatasourceNames = _getExpressionObserveDatasources(expression)
      if (observeDatasourceNames == null) {
        let fcode = field.getCode()
        let fexp = field.getExpression()
        datasource.on({
          eventName: datasource.Events.RECORDPROCESS,
          fieldCode: fcode,
          handler: (function (ifcode, ifexp) {
            return function (params) {
              let record = params.record
              let expContext = new ExpressionContext()
              try {
                let result = expressionUtil.execute(ifexp, expContext)
                if (params.eventType == datasource.Events.LOAD)
                  record.__recordData__[ifcode] = result
                else record.set(ifcode, result)
              } catch (e) {
                let msg =
                  '执行字段计算表达式【' + ifexp + '】失败，原因' + e.message
                log.log(msg)
              }
            }
          })(fcode, fexp)
        })
      } else {
        for (observeDatasourceName in observeDatasourceNames) {
          if (metadata.getDatasourceName() == observeDatasourceName) {
            let fcode = field.getCode()
            let fexp = field.getExpression()
            let observHandler = (function (ifcode, ifexp) {
              return function (params) {
                let record = params.record
                let expContext = new ExpressionContext()
                expContext.setRecords([record])
                try {
                  let result = expressionUtil.execute(ifexp, expContext)
                  if (params.eventType == datasource.Events.LOAD)
                    record.__recordData__[ifcode] = result
                  else record.set(ifcode, result)
                } catch (e) {
                  let msg =
                    '执行字段计算表达式【' + ifexp + '】失败，原因' + e.message
                  log.log(msg)
                }
              }
            })(fcode, fexp)
            let observeDatasourceFieldCodes =
              observeDatasourceNames[observeDatasourceName]
            for (let j = 0; j < observeDatasourceFieldCodes.length; j++) {
              let observeDatasourceFieldCode = observeDatasourceFieldCodes[j]
              datasource.on({
                eventName: datasource.Events.RECORDPROCESS,
                fieldCode: observeDatasourceFieldCode,
                handler: observHandler
              })
            }
          }
        }
      }
    }
  }
}

const create = function (metadata) {
  let constructor = _getDSContructor()
  let database = new constructor(metadata)
  let datasource = new Datasource(metadata, database)
  if (database._setDatasource) {
    database._setDatasource(datasource)
  }
  _createExpressionHandler(datasource, datasource.getMetadata())
  return datasource
}

exports.initModule = function (sBox) {
  sandbox = sBox
}

const unSerialize = function (input) {
  if (typeof input == 'string') {
    input = eval('(' + input + ')')
  }
  let constructor = _getDSContructor()
  let metadata = metadataFactory.unSerialize(input.metadata)
  let datasource = this.create(metadata)
  let datas = input.datas
  if (datas && datas.values) {
    datasource.load({
      datas: datas.values,
      dataAmount: datas.recordCount,
      isAppend: false
    })
  }
  return datasource
}

const isDatasource = function (datasource) {
  return datasource instanceof Datasource
}

const _getDatasourceConstructor = function () {
  return Datasource
}

export { create, unSerialize, isDatasource, _getDatasourceConstructor }
