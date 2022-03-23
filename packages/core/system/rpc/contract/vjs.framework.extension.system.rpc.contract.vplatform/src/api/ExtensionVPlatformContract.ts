import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Manager as manager } from '@v-act/vjs.framework.extension.system.rpc.contract'

import Contract from './Contract'

/**
 * @class VPlatformContract
 * @desc v平台前后端请求协议
 */
class ExtensionVPlatformContract extends Contract {
  componentCode: string | null = null
  windowCode: string | null = null
  scopeId: string | null = null
  headers: { [code: string]: any } = {}
  constructor() {
    super()
    this.componentCode = null
    this.windowCode = null
    this.scopeId = null
    this.headers = {}
  }
  /**
   * 设置构件编号
   */
  setComponentCode(componentCode: string) {
    this.componentCode = componentCode
  }

  /**
   * 设置窗体编号
   */
  setWindowCode(windowCode: string) {
    this.windowCode = windowCode
  }
  /**
   * 设置域id
   */
  setScopeId(scopeId: string) {
    this.scopeId = scopeId
  }
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate(request: any) {
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
    let data: { [code: string]: any } = {}
    for (let attr in this.headers) {
      if (this.headers.hasOwnProperty(attr)) {
        data[attr] = this.headers[attr]
      }
    }
    let params = operation.getParams()
    let extensionParams = params['params']
    //参数数组转为object
    let sandParams: { [code: string]: any } = {}
    if (extensionParams && extensionParams.length > 0) {
      for (let i = 0, param; (param = extensionParams[i]); i++) {
        if (
          param.paramType === 'entity' ||
          datasourceFactory.isDatasource(param.paramValue)
        ) {
          let value: { [code: string]: any } = {}
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
  }
  /**
   * 结构化返回值
   * @param {Object} responseData
   */
  deserializeResponse(responseData: any) {
    let output: { [code: string]: any } = {}
    if (responseData.success == true) {
      if (responseData && responseData.data && responseData.data.result) {
        let result = responseData.data.result
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
      //throw new Error('后台请求报错:' + resultData.msg)
      throw new Error('未识别异常，请联系系统管理员处理')
    }
    return output
  }
  /**
   *生成提交数据集合
   */
  _genDatas(dataSource: any) {
    let records = { recordCount: null, values: {} }
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
  }
  /**
   *生成元数据
   */
  _genMetadata(dataSource: any) {
    let metadata = dataSource.getMetadata()
    dataSource = metadata.getDatasourceName()
    let metadataValue: { [code: string]: any } = {}
    let model: { [code: string]: any } = {}
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

//manager.injectCurrentContract(ExtensionVPlatformContract, 'extensionVPlatform')

export default ExtensionVPlatformContract
