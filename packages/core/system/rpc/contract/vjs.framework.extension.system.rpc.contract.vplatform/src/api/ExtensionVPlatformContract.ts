import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { MetadataFactory as metadataFactory } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { FieldFactory as fieldFactory } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

/**
 * @class VPlatformContract
 * @desc v平台前后端请求协议
 */
let ExtensionVPlatformContract = function () {
  this.componentCode = null
  this.windowCode = null
  this.scopeId = null
  this.headers = {}
}

ExtensionVPlatformContract.prototype = {
  initModule: function (sandbox) {
    var manager = sandbox.getService(
      'vjs.framework.extension.system.rpc.contract.Manager'
    )
    manager.injectCurrentContract(
      ExtensionVPlatformContract,
      'extensionVPlatform'
    )
    var Contract = require('vjs/framework/extension/system/rpc/contract/vplatform/api/Contract')
    var objectUtil = sandbox.util.object
    var initFunc = Contract.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sandbox)
    }
    var prototype = Object.create(Contract.prototype)
    prototype.constructor = ExtensionVPlatformContract
    objectUtil.extend(prototype, ExtensionVPlatformContract.prototype)
    ExtensionVPlatformContract.prototype = prototype
  },

  /**
   * 设置构件编号
   */
  setComponentCode: function (componentCode) {
    this.componentCode = componentCode
  },

  /**
   * 设置窗体编号
   */
  setWindowCode: function (windowCode) {
    this.windowCode = windowCode
  },
  /**
   * 设置域id
   */
  setScopeId: function (scopeId) {
    this.scopeId = scopeId
  },
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate: function (request) {
    let operation = request.getOperations()[0]
    this.setHeader('ajaxRequest', true)
    this.setHeader('operation', operation.getOperation())
    this.setHeader('scopeId', scopeManager.getCurrentScopeId())
    let sourceWindow = operation.getSourceWindow()
    if (sourceWindow) {
      this.setHeader('sourceWindow', sourceWindow)
    }
    let transactionId = operation.getTransactionId()
    if (transactionId != null && typeof transactionId != 'undefined') {
      this.setHeader('transaction_id', transactionId)
    }
    let data = {}
    for (let attr in this.headers) {
      if (this.headers.hasOwnProperty(attr)) {
        data[attr] = this.headers[attr]
      }
    }
    let params = operation.getParams()
    let extensionParams = params['params']
    //参数数组转为object
    let sandParams = {}
    if (extensionParams && extensionParams.length > 0) {
      for (let i = 0, param; (param = extensionParams[i]); i++) {
        if (
          param.paramType === 'entity' ||
          datasourceFactory.isDatasource(param.paramValue)
        ) {
          let value = {}
          let dataSource = param.paramValue
          let metadata = dataSource.getMetadata()
          let dataSourceName = metadata.getDatasourceName()
          value.dataSource = dataSourceName
          value.metadata = this._genMetadata(dataSource)
          value.datas = this._genDatas(dataSource)
          param.paramValue = value
          sandParams[param.paramName] = value
        } else {
          sandParams[param.paramName] = param.paramValue
        }
      }
    }
    params.params = sandParams
    if (transactionId != null && typeof transactionId != 'undefined') {
      params['transaction_id'] = transactionId
    }
    data['token'] = this.serializeRequest({ data: params })
    return data
  },
  /**
   * 结构化返回值
   * @param {Object} responseData
   */
  deserializeResponse: function (responseData) {
    let output = {}
    if (responseData.success == true) {
      if (responseData && responseData.data && responseData.data.result) {
        result = responseData.data.result
        for (let attr in result) {
          let val = result[attr].value
          let type = result[attr].type
          if (type == 'entity') {
            val = datasourceFactory.unSerialize(val)
          }
          output[attr] = val
        }
      }
    } else {
      throw new Error('后台请求报错:' + resultData.msg)
    }
    return output
  },
  /**
   *生成提交数据集合
   */
  _genDatas: function (dataSource) {
    let records = {}
    let resultSet = dataSource.getAllRecords()
    records.recordCount = resultSet.size()
    let list = []
    let iterator = resultSet.iterator()
    while (iterator.hasNext()) {
      let record = iterator.next()
      list.push(record.toMap())
    }
    records.values = list
    return records
  },
  /**
   *生成元数据
   */
  _genMetadata: function (dataSource) {
    let metadata = dataSource.getMetadata()
    let dataSource = metadata.getDatasourceName()
    let metadataValue = {}
    let model = {}
    model.object = dataSource
    let fields = metadata.getFields()
    let fieldArray = []
    if (fields && fields.length > 0) {
      for (let i = 0, field; (field = fields[i]); i++) {
        fieldArray.push(field.serialize())
      }
    }
    model.fields = fieldArray
    metadataValue.model = [model]
    return metadataValue
  }
}

return ExtensionVPlatformContract
