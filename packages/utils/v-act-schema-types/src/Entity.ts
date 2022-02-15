interface EntityRecord {
  [fieldCode: string]: string
}

interface EntityField {
  code: string
  name: string
  chineseName: string
  type: string
  length: number
  precision: string
  defaultValue: string
}

interface Entity {
  code: string
  name: string
  chineseName: string
  fields: EntityField[]
  rows: EntityRecord[]
}

export { type Entity, type EntityField, type EntityRecord }

export default Entity
