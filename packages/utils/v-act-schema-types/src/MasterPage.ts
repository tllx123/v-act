import Action from './Action'

interface MasterPageControl {
  type: string
  properties: { [propName: string]: string }
  controls?: MasterPageControl[]
}

interface MasterPageProperty {
  code: string
  showTopStatus?: string
}

interface MasterPage {
  actions?: Action[]
  controls?: MasterPageControl[]
  properties: MasterPageProperty
}

export { type MasterPage, type MasterPageControl, type MasterPageProperty }
export default MasterPage
