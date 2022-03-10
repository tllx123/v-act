let DataProvider = function (
  dSName,
  DSMappings,
  whereRestrict,
  pageSize,
  recordStart
) {
  /**
   * 后台数据源名称<String>
   */
  this.dSName = dSName

  /**
   * 前台实体与后台数据源字段映射关系<Object>
   */
  this.DSMappings = DSMappings

  /**
   * 查询条件对象<Object>
   */
  this.whereRestrict = whereRestrict
  /**
   * 每页数据量
   */
  this.pageSize = pageSize
  /**
   * 起始页码
   */
  this.recordStart = recordStart
}

/**
 *设置后台数据源名称
 * @param DSName<String> 后台数据源名称
 */
DataProvider.prototype.setDSName = function (dSName) {
  this.dSName = dSName
}

/**
 *获取数据源名称
 * @return String
 */
DataProvider.prototype.getDSName = function () {
  return this.dSName
}

/**
 *设置前台实体与后台数据源字段映射关系
 * @param DSMappings<Object>
 */
DataProvider.prototype.setDSMappings = function (DSMappings) {
  this.DSMappings = DSMappings
}

/**
 *获取前台实体与后台数据源字段映射关系
 * @return Object
 */
DataProvider.prototype.getDSMappings = function () {
  return this.DSMappings
}

/**
 * 设置加载条件对象
 * @param whereRestrict<Object> 加载条件对象
 */
DataProvider.prototype.setWhereRestrict = function (whereRestrict) {
  this.whereRestrict = whereRestrict
}

/**
 * 获取加载条件对象
 * @return Object
 */
DataProvider.prototype.getWhereRestrict = function () {
  return this.whereRestrict
}

/**
 * 设置每页数据量
 * @param pageSize<number> 加载条件对象
 */
DataProvider.prototype.setPageSize = function (pageSize) {
  this.pageSize = pageSize
}

/**
 * 获取每页数据量
 * @return number
 */
DataProvider.prototype.getPageSize = function () {
  return this.pageSize
}

/**
 * 设置起始页码
 * @param recordStart<number>
 */
DataProvider.prototype.setRecordStart = function (recordStart) {
  this.recordStart = recordStart
}

/**
 * 获取起始页码
 * @return number
 */
DataProvider.prototype.getRecordStart = function () {
  return this.recordStart
}

export default DataProvider
