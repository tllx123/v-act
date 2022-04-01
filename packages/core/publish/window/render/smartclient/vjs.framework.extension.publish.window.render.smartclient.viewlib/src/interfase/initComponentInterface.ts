import { ruleInstancesSchema } from './ruleSetInterFace'

type IItem = {
  $: {
    code: string
    desc: string
    initValue: string
    isDelete: string
    name: string
    type: string
  }
}

type IVariant = IItem[]
type IOption = IItem[]

interface IExtension {
  $: { componentCode: string }
  metaReference: {
    $: { windowCode: string; metaCode: string; metaType: string }
  }
}

interface ruleSet {
  ruleInstances: ruleInstancesSchema
  ruleRoute: {
    $: { code: string }
    //属性值
    _: string | any[]
  }
}

interface ILogic {
  $: { type: string }
  ruleInstances: ruleInstancesSchema
  ruleSets: {
    ruleSet: ruleSet
  }
}

type ILogics = { logic: ILogic } | ILogic[]
type IVariants = { variant: IVariant } | IVariant[]
type IOptions = { option: IVariant } | IOption[]

type IManifest = null | {
  serviceRegistration: {
    serviceMapping: {
      extensionPoint: IExtension
      extensions:
        | {
            extension: IExtension
          }
        | IExtension[]
    }
  }
}

interface IDomainModule {
  $: { code: string }
  elements: {
    element: {
      $: { code: string }
      config: string
    }
  }
}

type IDomains = null | {
  module: IDomainModule[]
}

interface IParams {
  componentCode: string
  windowCode: string
  winDatas: {
    logics: ILogics
    windowOutputs: any
    windowVariants: any
  }
  componentSchema: {
    logics: ILogics
    variants?: IVariants
    options?: IOptions
    manifest?: IManifest
    domains?: IDomains
  }
}

export type {
  IVariant,
  IOption,
  ILogic,
  ILogics,
  IItem,
  IVariants,
  IOptions,
  IManifest,
  IDomains,
  IParams,
  IExtension
}
