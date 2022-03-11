import { Manager as manager } from '@v-act/vjs.framework.extension.system.rpc.contract'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

/**
 * @class Contract
 * @desc 前后端请求协议
 */
class Contract {
  constructor() {
    this.headers = {}
  }

  /**
   * 设置头信息
   * @param {Object} pName
   * @param {Object} value
   */
  setHeader(pName, value) {
    this.headers[pName] = value
  }
  /**
   *批量设置头信息
   * @param {Object} data
   */
  setHeaders(data) {
    if (data) {
      for (let attr in data) {
        if (data.hasOwnProperty(attr)) {
          this.setHeader(attr, data[attr])
        }
      }
    }
  }
  /**
   *生成请求数据
   * @param {Object} operation
   */
  generate(operation) {}
  /**
   *序列化请求数据（对请求数据进行加工）
   */
  serializeRequest(data) {
    return encodeURIComponent(jsonUtil.obj2json(data))
  }
  /**
   * 结构化返回值
   * @param {Object} responseData
   */
  deserializeResponse(responseData) {
    return responseData
  }
}

manager.injectCurrentContract(Contract, null)

export default Contract
