import * as DataAccessObject from './api/object/DataAccessObject'
import * as DataProvider from './api/object/DataProvider'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
let undefined

exports.initModule = function (sBox) {}

const serializer = function (rsDataValueStr, queryParam) {
  let rsDataObj = jsonUtil.json2obj(rsDataValueStr)
  let dataProvider = _genDataProviderObj(queryParam)
  let rsDataWidthProvider = _addProvider2RSData(rsDataObj, dataProvider)
  let result = []
  for (let i = 0; i < rsDataWidthProvider.length; i++) {
    let data = rsDataWidthProvider[i]
    let dataAccessObject = new DataAccessObject(
      data.dataSource,
      data.datas,
      data.dataProvider,
      data.metadata
    )
    result.push(dataAccessObject)
  }
  return result
}

/**
 * 将重载使用的查询条件，注入到resultDatas中，并返回新构建的resultDatas
 * @param rsDataObj 查询结果
 * @param loadCondition 各数据源的加载条件
 */
let _addProvider2RSData = function (rsDataObj, dataProvider) {
  if (rsDataObj && rsDataObj[0]) {
    rsDataObj[0]['dataProvider'] = dataProvider
  }
  return rsDataObj
}

/**
 * 生成加载的查询条件缓存
 * @param queryParam 查询体selectData列表
 * @return Object
 */
let _genDataProviderObj = function (queryParam) {
  let dataSourceName = queryParam.dataSourceName
  let dataSourceMappings = queryParam.dataSourceMappings
  let whereRestrict = queryParam.whereRestrict
  let pageSize = queryParam.queryPageSize
  let recordStart = queryParam.queryRecordStart
  let dataProvider = new DataProvider(
    dataSourceName,
    dataSourceMappings,
    whereRestrict,
    pageSize,
    recordStart
  )
  return dataProvider
}

export { serializer }
