import { MetadataFactory as metadataFactory } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionUtil as expressionUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.expression'
import { Log as log } from '@v-act/vjs.framework.extension.util.log'

import * as Datasource from './api/Datasource'

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

export function initModule(sBox) {
  sandbox = sBox
}

const unSerialize = function (input) {
  if (typeof input == 'string') {
    input = eval('(' + input + ')')
  }
  //		var constructor = _getDSContructor();
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

const createJsonFromConfig = function (config) {
  let fields = []
  let freeDBName = 'freeDB_' + uuidUtil.generate()
  let data = []
  if (config && config.fields) {
    if (config.datasourceName) {
      freeDBName = config.datasourceName
    }
    if (config.datas instanceof Array) {
      data = config.datas
    }
    if (config.fields) {
      let fieldConfig = config.fields
      for (let i = 0, l = fieldConfig.length; i < l; i++) {
        let param = fieldConfig[i]
        fields.push({
          code: param.code,
          name: param.name,
          type: param.type,
          defaultValue: param.initValue
        })
      }
    }
  }
  return {
    datas: {
      values: data
    },
    metadata: {
      model: [
        {
          datasourceName: freeDBName,
          fields: fields
        }
      ]
    }
  }
}

const createDatasourceFromConfig = function (config) {
  let ds = exports.unSerialize(exports.createJsonFromConfig(config))
  return ds
}

_getFieldFromValue = function (code, value) {
  let type = typeof value
  switch (type) {
    case 'string':
      if (dateUtils.isDate(value)) {
        type = 'date'
      } else if (dateUtils.isDateTime(value)) {
        type = 'longDate'
      } else {
        type = 'char'
      }
      return {
        code: code,
        name: name,
        type: type
      }
    case 'boolean':
      return {
        code: code,
        name: name,
        type: 'boolean'
      }
    case 'number':
      type =
        (parseInt(value) + '').length == (value + '').length
          ? 'integer'
          : 'number'
      return {
        code: code,
        name: name,
        type: type
      }
  }
}

const createFromDatas = function (datas, datasourceName) {
  let fields = []
  let existField = []
  for (let i = 0, l = datas.length; i < l; i++) {
    let data = datas[i]
    for (let key in data) {
      if (data.hasOwnProperty(key) && existField.indexOf(key) == -1) {
        let value = data[key]
        fields.push(_getFieldFromValue(key, value))
        existField.push(key)
      }
    }
  }
  let freeDBName = datasourceName
    ? datasourceName
    : 'freeDB_' + uuidUtil.generate()
  let metadata = {
    datas: {
      recordCount: datas.length,
      values: datas
    },
    metadata: {
      model: [
        {
          datasourceName: freeDBName,
          fields: fields
        }
      ]
    }
  }
  return this.unSerialize(metadata)
}

const isDatasource = function (datasource) {
  return datasource instanceof Datasource
}

const _getDatasourceConstructor = function () {
  return Datasource
}

export {
  create,
  initModule,
  unSerialize,
  createJsonFromConfig,
  createDatasourceFromConfig,
  createFromDatas,
  isDatasource,
  _getDatasourceConstructor
}
