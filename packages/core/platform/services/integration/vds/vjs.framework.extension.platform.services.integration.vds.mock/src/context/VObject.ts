/**
 * 二次开发使用的V对象
 * */

import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

class VObject {
  mock: any
  _cacheVObject: any

  constructor(mock: any) {
    this.mock = mock
    this._cacheVObject = {} //缓存v对象，VObject取的输入值
  }

  getInput(code: string | number) {
    var mock = this.mock
    if (this._cacheVObject.hasOwnProperty(code)) {
      return this._cacheVObject[code]
    }
    if (!this.mock || !mock._existInput(code)) {
      return null
    }
    var value = mock._getInput(code)
    if (value && mock._isEntityByInputCode(code)) {
      //如果之前给的输入值不是数据源对象，那就取一下数据源对象
      if (
        !datasourceFactory.isDatasource(value) &&
        !vds.ds.isDatasource(value)
      ) {
        value = manager.lookup({
          datasourceName: value
        })
        value = vds.ds.mock(value)
      }
    }
    this._cacheVObject[code] = value
    return value
  }

  putOutput(code: any, value: any) {
    var mock = this.mock
    this.mock.putOutput(code, value)
  }
}

export default VObject
