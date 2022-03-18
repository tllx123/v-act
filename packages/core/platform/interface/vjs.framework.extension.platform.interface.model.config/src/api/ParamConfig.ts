import { ParamInitor as paramInitor } from '@v-act/vjs.framework.extension.platform.data.adapter'

/**
 * @namespace ParamConfig
 * @class ParamConfig
 * @author xiedh
 * @desc 参数配置定义信息<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.config<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.config.ParamConfig<br/>
 */
class ParamConfig {
  static putInitor = function (initor: any) {
    ParamConfig.prototype.initor = initor
  }
  initor: any | null = paramInitor
  code: string
  name: string
  type: string
  initValue: any
  configs: Array<ParamConfig> | null

  constructor(code: string, name: string, type: string, initValue: any) {
    this.code = code
    this.name = name
    this.type = type
    this.initValue = initValue
    this.configs = null
  }

  /**
   * 设置参数编号
   * @param {String} code 参数编号
   */
  setCode(code: string) {
    this.code = code
  }

  /**
   * 设置参数名称
   * @param {String} name 参数名称
   */
  setName(name: string) {
    this.name = name
  }

  /**
   * 设置参数类型
   * @param {String} type
   */
  setType(type: string) {
    this.type = type
  }

  /**
   * 设置初始化值
   * @param {Any} initValue 初始化值
   */
  setInitValue(initValue: any) {
    this.initValue = initValue
  }

  /**
   * 设置参数元数据信息(如实体字段信息)
   * @param {Array} configs 参数元数据信息
   */
  setConfigs(configs: Array<ParamConfig>) {
    this.configs = configs
  }

  /**
   * 添加参数元数据信息
   * @param {ParamConfig} config 参数配置
   */
  appendConfig(config: ParamConfig) {
    if (!this.configs) {
      this.configs = []
    }
    if (config instanceof ParamConfig) {
      this.configs.push(config)
    } else {
      throw Error(
        '[ParamConfig.appendConfig]添加的参数配置信息不是ParamConfig的实例，请检查!'
      )
    }
  }

  /**
   * 获取参数编号
   * @return String
   */
  getCode() {
    return this.code
  }

  /**
   * 获取参数名称
   * @return String
   */
  getName() {
    return this.name
  }

  /**
   * 获取参数类型
   * @return String
   */
  getType() {
    return this.type
  }

  //TODO 名称写错，将来删除
  geInitValue() {
    return this.getInitValue()
  }

  /**
   * 获取初始化值
   * @return Any
   */
  getInitValue() {
    if (this.initor) return this.initor.init(this)
    else return this.initValue
  }

  /**
   * 获取参数元数据信息
   * @return Array
   */
  getConfigs() {
    return this.configs
  }

  /**
   * 序列化配置信息
   * @return Object
   * @example
   * 输出格式
   * {
   * 		"code": String 编号,
   * 		"name": String 名称,
   * 		"type": String 类型,
   * 		"initValue" : Any 初始值,
   * 		"configs" : Array 配置信息
   * }
   */
  serialize() {
    return {
      code: this.code,
      name: this.name,
      type: this.type,
      initValue: this.initValue,
      configs: this.configs
    }
  }
}

export default ParamConfig
