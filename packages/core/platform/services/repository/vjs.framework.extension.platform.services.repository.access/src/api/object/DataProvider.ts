class DataProvider {
  dSName: string
  DSMappings: object
  whereRestrict: object
  pageSize: number
  recordStart: number
  constructor(
    dSName: string,
    DSMappings: object,
    whereRestrict: object,
    pageSize: number,
    recordStart: number
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
  setDSName(dSName: string) {
    this.dSName = dSName
  }

  /**
   *获取数据源名称
   * @return String
   */
  getDSName() {
    return this.dSName
  }

  /**
   *设置前台实体与后台数据源字段映射关系
   * @param DSMappings<Object>
   */
  setDSMappings(DSMappings: object) {
    this.DSMappings = DSMappings
  }

  /**
   *获取前台实体与后台数据源字段映射关系
   * @return Object
   */
  getDSMappings() {
    return this.DSMappings
  }

  /**
   * 设置加载条件对象
   * @param whereRestrict<Object> 加载条件对象
   */
  setWhereRestrict(whereRestrict: object) {
    this.whereRestrict = whereRestrict
  }

  /**
   * 获取加载条件对象
   * @return Object
   */
  getWhereRestrict() {
    return this.whereRestrict
  }

  /**
   * 设置每页数据量
   * @param pageSize<number> 加载条件对象
   */
  setPageSize(pageSize: number) {
    this.pageSize = pageSize
  }

  /**
   * 获取每页数据量
   * @return number
   */
  getPageSize() {
    return this.pageSize
  }

  /**
   * 设置起始页码
   * @param recordStart<number>
   */
  setRecordStart(recordStart: number) {
    this.recordStart = recordStart
  }

  /**
   * 获取起始页码
   * @return number
   */
  getRecordStart() {
    return this.recordStart
  }
}

export default DataProvider
