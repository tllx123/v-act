//窗体部署包schema定义

interface DataMemberSchema {
  $: { name: string; code: string }
  _: string
}

interface DataBindingSchema {
  dataSource: string
  dataMembers: { dataMember: DataMemberSchema | DataMemberSchema[] }
}

interface DataBindingsSchema {
  dataBinding: DataBindingSchema | DataBindingSchema[]
}

interface ControlSchema {
  $: { code: string; type: string }
  propertys: PropertysSchema
  dataBindings: DataBindingsSchema
  controls: { control: ControlSchema | ControlSchema[] }
  headerControls: { control: ControlSchema | ControlSchema[] }
}

interface ControlsSchema {
  control: ControlSchema | ControlSchema[]
}
interface ProptotypeSchema {
  actions: { action: ActionSchema | ActionSchema[] }
}
interface PropertysSchema {
  property: PropertySchema | PropertySchema[]
}
interface PropertySchema {
  //属性编号
  $: { code: string }
  //属性值
  _: string
}
interface WindowSchema {
  $: { type: string; code: string; name: string }
  propertys: PropertysSchema
  controls: ControlsSchema
  entitys: { entity: EntitySchema | EntitySchema[] }
  prototype?: ProptotypeSchema
  masterPage?: MasterPageSchema
}

interface EntityFieldSchema {
  $: {
    code: string
    name: string
    chineseName: string
    type: string
    length: string
    precision: string
    defaultValue: string
  }
}

interface MasterPagePropertySchema {
  $: { name: string }
  _: string
}

interface MasterPageControlSchema {
  [widgetType: string]: MasterPageControlSchema
}

interface MasterPageSchema {
  $: { code: string }
  propertys: { property: MasterPagePropertySchema | MasterPagePropertySchema[] }
  controls: { [prop: string]: MasterPageControlSchema }
  actions: { action: ActionSchema | ActionSchema[] }
}

interface EntityDefRowSchema {
  entityFieldDefVal: EntityFieldDefValSchema | EntityFieldDefValSchema[]
}

interface EntityFieldDefValSchema {
  $: { fieldCode: string }
  _: string
}

interface EntitySchema {
  $: { code: string; name: string; chineseName: string }
  entityFields: { entityField: EntityFieldSchema | EntityFieldSchema[] }
  entityDefRows: { entityDefRow: EntityDefRowSchema | EntityDefRowSchema[] }
}

interface WindowActionSchema {
  $: {
    targetWindow: string
    targetWindowTitle: string
    targetContainerType: string
    targetSourceType: string
    widthExp: string
    heightExp: string
  }
}

interface ActionSchema {
  $: { controlCode: string; triggerEvent: string }
  windowAction: WindowActionSchema
}

export {
  type ActionSchema,
  type ControlSchema,
  type DataBindingSchema,
  type EntityDefRowSchema,
  type EntityFieldSchema,
  type EntitySchema,
  type MasterPageControlSchema,
  type MasterPageSchema,
  type PropertySchema,
  type PropertysSchema,
  type WindowActionSchema,
  type WindowSchema
}
