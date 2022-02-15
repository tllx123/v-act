interface DataMember {
  name: string
  code: string
  value: string
}

interface DataBinding {
  dataSource: string | null
  dataMembers: DataMember[]
}

export { type DataBinding, type DataMember }
export default DataBinding
