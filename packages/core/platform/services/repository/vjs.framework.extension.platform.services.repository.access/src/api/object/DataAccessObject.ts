/**
 * @class DataAccessObject
 * @desc  数据访问对象<br/>
 * vjs名称：vjs.framework.extension.platform.services.repository.access<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.repository.data.object<br/>
 */
class DataAccessObject {
  /**
   * 远程数据源信息<Obj>
   */
  dataProvider
  /**
   * 数据模型定义信息<Object>
   */
  modelSchema
  /**
   * 数据操作类型及相关条件信息<Object>
   *
   * 属性type的枚举值为：query insert update delete
   */
  command

  constructor(dataProvider: any, modelSchema: any, command: string) {
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
  setDataProvider(dataProvider: any) {
    this.dataProvider = dataProvider
  }

  /**
   *获取远程数据源信息
   * @return Object
   */
  getDataProvider() {
    return this.dataProvider
  }

  /**
   *设置数据模型定义信息
   * @param {Object} modelSchema 数据模型定义信息
   */
  setModelSchema(setModelSchema: any) {
    this.setModelSchema = setModelSchema
  }

  /**
   *获取数据模型定义信息
   * @return Object
   */
  getModelSchema() {
    return this.modelSchema
  }

  /**
   *设置数据操作类型及相关条件信息
   * @param {String} command 操作类型
   * 枚举值：query、insert、update、delete
   */
  setCommand(command: string) {
    this.command = command
  }

  /**
   *获取数据操作类型及相关条件信息
   * @return String
   */
  getCommand() {
    return this.command
  }
}

export default DataAccessObject
