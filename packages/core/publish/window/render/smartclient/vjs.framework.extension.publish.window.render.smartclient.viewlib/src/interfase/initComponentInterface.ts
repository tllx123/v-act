import { logicType } from './ruleSetInterFace'

interface IVariant {
  code: string
  desc: string
  initValue: string
  isDelete: string
  name: string
  type: string
}
interface IOption {
  code: string
  desc: string
  initValue: string
  isDelete: string
  name: string
  type: string
}

interface IVariant {
  $: IVariant
}
interface IOption {
  $: IOption
}

interface IParams {
  componentCode: string
  componentSchema: {
    variants: { variant: IVariant[] } | { variant: IVariant[] }[]
    options: { option: IOption[] } | { option: IOption[] }[]
    logics: { logic: logicType | logicType[] }
  }
}

export type { IVariant, IOption, IParams }
