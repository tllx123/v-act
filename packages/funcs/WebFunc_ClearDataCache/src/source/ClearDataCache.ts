import * as viewContext from 'module'
import * as viewOperation from 'module'
import * as jsonUtil from 'module'

// 加载引用模块
let undefined
let undefined
let undefined
exports.initModule = function () {}
/**
 * 主入口
 * @param dataKey 要清除的数据key
 * @param isInitKey 是否缓存过
 * @param initKeyValueKey isInitKey标识值key
 */
let main = function (dataKey, isInitKey, initKeyValueKey) {
  if (dataKey === null) {
    throw new Error('传入要清除缓存的数据Key为空，请检查')
  }
  let expression = ''
  if (isInitKey != null && initKeyValueKey != null) {
    expression =
      'ClearDataCacheFunc("' +
      dataKey +
      '","' +
      isInitKey +
      '","' +
      initKeyValueKey +
      '")'
  } else {
    expression = 'ClearDataCacheFunc("' + dataKey + '")'
  }
  let tempParam = {
    expression: expression
  }
  let paramData = jsonUtil.obj2json(tempParam)
  let rtObj = viewOperation.doRequest(
    viewContext.getModuleId(),
    'WebExecuteFormulaExpression',
    paramData
  )
  if (!rtObj.success) {
    throw new Error(
      '根据数据缓存Key,清除缓存失败!请联系开发人员查看后台信息排查问题。'
    )
  }
}

export { main }
