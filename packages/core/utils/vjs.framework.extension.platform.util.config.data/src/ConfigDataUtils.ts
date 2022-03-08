/**
 * 配置数据工具类
 * vjs名称：vjs.framework.extension.platform.util.config.data
 * vjs服务：vjs.framework.extension.platform.util.configDataUtil
 */
var sandbox,
  storageManager,
  CONFIG_DATA_KEY = 'CONFIG_DATA_KEY'
/**
 * 配置数据默认key
 * 用法：getConditionKeys 传入key使用此值
 * */
exports.KEYS = {
  COMPONENTCODE: 'componentCode', //对应构件编码
  WINDOWCODE: 'windowCode' //对应窗体编码
}

export function initModule(sBox) {
  sandbox = sBox
  storageManager = sandbox.getService(
    'vjs.framework.extension.platform.interface.storage.StorageManager'
  )
}

var _getStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, CONFIG_DATA_KEY)
}
/**
 * 匹配条件
 * @param	{Object}	source	存在storage的条件
 * @param	{Object}	target	调用接口传进来筛选数据的条件
 * */
var _match = function (source, target) {
  if (!source) {
    source = {}
  }
  if (!target) {
    target = {}
  }
  for (var key in source) {
    if (source[key] != target[key]) {
      return false
    }
  }
  for (var key in target) {
    if (source[key] != target[key]) {
      return false
    }
  }
  return true
}
/**
 * 根据数据标识获取数据，可能存在多份数据（业务框架），若存在重复数据，需从请求源头控制
 * @param	{String}	code	数据标识
 * @param	{Object}	condition	条件
 * 条件匹配规则：互相遍历项，如果双方的项都能完全匹配保存，则作为预期数据返回
 * 	如：保存条件：A=1，B=2，只有传入A=1，B=2才匹配，其他情况（传入：A=1，或者传入：A=1，B=2，C=3）均不匹配
 * */
export function getDataSync(code, conditions) {
  var storage = _getStorage()
  var dataInfos = storage.get(code)
  if (dataInfos) {
    var data = []
    for (var i = 0, len = dataInfos.length; i < len; i++) {
      var dataInfo = dataInfos[i]
      if (dataInfo.datas && _match(dataInfo.conditions, conditions)) {
        data.push(dataInfo.datas)
      }
    }
    return data
  }
  return null
}
/**
 * 添加数据
 * @param	{String}	code
 * @param	{Object}	datas
 * @param	{Object}	conditions
 * */
export function put(code, datas, conditions) {
  var storage = _getStorage()
  var dataInfos = storage.get(code)
  var map = {
    conditions: conditions,
    datas: datas
  }
  if (!dataInfos) {
    dataInfos = [map]
    storage.put(code, dataInfos)
  } else {
    dataInfos.push(map)
  }
}
