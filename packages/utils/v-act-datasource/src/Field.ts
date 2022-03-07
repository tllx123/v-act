export class Field {
  public code!: string
  public name!: string
  public type!: string
  public length: number = 255
  public defaultValue!: string
  public precision!: string
  public expression!: string
  public remark!: string
  public dataAdaptor = null
  public defaultValueGenerator = null
  constructor(
    code_: string,
    name_: string,
    type_: string,
    length_: number,
    defaultValue_: string,
    precision_: string,
    expression_: string,
    remark_: string
  ) {
    this.code = code_
    this.name = name_
    this.type = type_
    this.length = length_
    this.defaultValue = defaultValue_
    this.precision = precision_
    this.expression = expression_
    this.remark = remark_
  }

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
