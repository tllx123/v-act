/**
 * 二次开发的函数上下文
 * */

import { FunctionContext as BaseFunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { DatasourceFactory as dsFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

import VObject from './VObject'

class FunctionContext extends BaseFunctionContext {
  args: any
  cacheDatas: Record<string, any>
  vObject: any
  routeContext: any

  constructor(args: any, mock: any) {
    super()
    this.args = args
    this.cacheDatas = {}
    this.vObject = new VObject(mock)
    this.routeContext = mock
  }

  getInput(code: string | number) {
    if (this.cacheDatas.hasOwnProperty(code)) {
      return this.cacheDatas[code]
    }
    var value = this.vObject.getInput(code)
    if (value && dsFactory.isDatasource(value)) {
      //平台数据源对象
      value = vds.ds.mock(value)
    }
    this.cacheDatas[code] = value
    return value
  }

  getVObject() {
    return this.vObject
  }
  getInputSize() {
    var mock = this.vObject.mock
    return mock.inpus ? mock.inpus.length : 0
  }

  getArgs() {
    return this.args
  }
}

export default FunctionContext
