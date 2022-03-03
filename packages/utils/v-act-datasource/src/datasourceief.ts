export interface StringArray {
  [index: number | string]: number | string
}

export interface MetadataType {
  uppToOrigFldMap: Object
  fields: Array<string>
}

export interface fields {
  getCode: () => void
}
