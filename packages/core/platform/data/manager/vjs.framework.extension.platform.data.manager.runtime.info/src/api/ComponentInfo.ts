let pool = {}

const markComponentSchemaInited = function (componentCode: string) {
  pool[componentCode] = true
}

const isComponentSchemaInited = function (componentCode: string) {
  return !!pool[componentCode]
}

export { markComponentSchemaInited, isComponentSchemaInited }
