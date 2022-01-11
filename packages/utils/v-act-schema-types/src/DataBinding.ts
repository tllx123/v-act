interface DataMember {
  name: string
  code: string
  value: string
}

interface DataBinding {
  dataSource: string
  dataMembers: DataMember[]
}

export default DataBinding
