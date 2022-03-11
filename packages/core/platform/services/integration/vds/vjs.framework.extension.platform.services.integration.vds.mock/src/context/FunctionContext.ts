/**
 * 二次开发的函数上下文
 * */

import { FunctionContext as BaseFunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { DatasourceFactory as dsFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

import VObject from './VObject'

class FunctionContext extends BaseFunctionContext {
  constructor(args, mock) {
    super()
    this._args = args
    this._cacheDatas = {}
    this._vObject = new VObject(mock)
    this.routeContext = mock
  }

  getInput(code) {
    if (this._cacheDatas.hasOwnProperty(code)) {
      return this._cacheDatas[code]
    }
    var value = this._vObject.getInput(code)
    if (value && dsFactory.isDatasource(value)) {
      //平台数据源对象
      value = vds.ds.mock(value)
    }
    this._cacheDatas[code] = value
    return value
  }

  getVObject() {
    return this._vObject
  }
  getInputSize() {
    var mock = this._vObject.mock
    return mock.inpus ? mock.inpus.length : 0
  }

  getArgs() {
    return this._args
  }
}

export default FunctionContext
