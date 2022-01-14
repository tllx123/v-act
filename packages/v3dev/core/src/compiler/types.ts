/**
 * 编译配置
 */
export interface CompileOptions {
  root: string
  outdir: string
  dependencies: Record<string, string>
  template: {
    page: string
  }
}

/**
 * 构件包
 */
export interface Package {
  components: Component[]
}

/**
 * 构件
 */
export interface Component {
  code: string
  desc: string
  name: string
  wins: Window[]
}

/**
 * 窗体
 */
export interface Window {
  code: string
  desc: string
  name: string
  type: 'component'
  controls: Control[]
  properties: Properties
  _dependencies: string[]
}

/**
 * 控件
 */
export interface Control<Props extends Properties = Properties> {
  code: string
  name?: string
  type: string
  controls: Control[]
  properties: Props
}

/**
 * 属性
 */
export type Properties = Record<string, any>

/**
 * 配置构件: 根节点
 */
export interface VPackage {
  component: VComponent
}

/**
 * 配置构件: 构件根节点
 */
export interface VComponent {
  // 构件编码
  '@_code': string
  // 构件描述
  '@_desc': string
  // 构件名称
  '@_name': string
  // 窗体列表
  'windows': VWindows
}

/**
 * 配置构件: 窗体根节点
 */
export interface VWindows {
  window: VWindow | VWindow[]
}

/**
 * 配置构件: 控件根节点
 */
export interface VControls {
  control: VControl | VControl[]
}

/**
 * 配置构件: 属性根节点
 */
export interface VProperties {
  property: VProperty[]
}

/**
 * 窗体元信息
 */
export interface VWindow {
  '@_code': string
  '@_desc': string
  '@_name': string
  'controls'?: VControls
  'propertys'?: VProperties
}

/**
 * 控件元信息
 */
export interface VControl {
  '@_code': string
  '@_name': string
  '@_type': string
  'controls'?: VControls
  'propertys'?: VProperties
}

/**
 * 属性元信息
 */
export interface VProperty {
  '#text': unknown
  '@_code': string
}
