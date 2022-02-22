export class Field {
  public code: string
  public name: string
  public type: string
  public length: number = 255
  public defaultValue: string
  public precision: string
  public expression: string
  public remark: string
  public dataAdaptor = null
  public defaultValueGenerator = null
  constructor(
    code: string,
    name: string,
    type: string,
    length: number,
    defaultValue: string,
    precision: string,
    expression: string,
    remark: string
  ) {}

  getCode() {
    return this.code
  }

  getName() {
    return this.name
  }

  getLength() {
    return this.length
  }

  getType() {
    return this.type
  }

  getExpression() {
    return this.expression
  }

  getDefaultValue() {
    if (null == this.defaultValueGenerator) {
      return this.defaultValue
    }
  }
}
