/**
 * @class DataAccessObject
 * @desc  数据访问对象<br/>
 * vjs名称：vjs.framework.extension.platform.services.repository.access<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.repository.data.object<br/>
 */
let DataAccessObject = function (dataProvider, modelSchema, command) {
  /**
   * 远程数据源信息<Obj>
   */
  this.dataProvider = dataProvider
  /**
   * 数据模型定义信息<Object>
   */
  this.modelSchema = modelSchema
  /**
   * 数据操作类型及相关条件信息<Object>
   *
   * 属性type的枚举值为：query insert update delete
   */
  this.command = command
}

/**
 *设置远程数据源信息
 * @param {Object} dataProvider 远程数据源信息
 */
DataAccessObject.prototype.setDataProvider = function (dataProvider) {
  this.dataProvider = dataProvider
}

/**
 *获取远程数据源信息
 * @return Object
 */
DataAccessObject.prototype.getDataProvider = function () {
  return this.dataProvider
}

/**
 *设置数据模型定义信息
 * @param {Object} modelSchema 数据模型定义信息
 */
DataAccessObject.prototype.setModelSchema = function (setModelSchema) {
  this.setModelSchema = setModelSchema
}

/**
 *获取数据模型定义信息
 * @return Object
 */
DataAccessObject.prototype.getModelSchema = function () {
  return this.modelSchema
}

/**
 *设置数据操作类型及相关条件信息
 * @param {String} command 操作类型
 * 枚举值：query、insert、update、delete
 */
DataAccessObject.prototype.setCommand = function (command) {
  this.command = command
}

/**
 *获取数据操作类型及相关条件信息
 * @return String
 */
DataAccessObject.prototype.getCommand = function () {
  return this.command
}

return DataAccessObject
