import Action from './Action'

interface MasterPageControl {
  type: string
  properties: { [propName: string]: string }
  controls?: MasterPageControl[]
}

interface Property {
  code: string
  showTopStatus?: string
}

interface MasterPage {
  actions?: Action[]
  controls?: MasterPageControl[]
  properties: Property
}
export default MasterPage
