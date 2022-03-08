let pool = {}

const markComponentSchemaInited = function (componentCode) {
  pool[componentCode] = true
}

const isComponentSchemaInited = function (componentCode) {
  return !!pool[componentCode]
}

export {
  markAppSchemaInited,
  isAppSchemaInited,
  markComponentSchemaInited,
  isComponentSchemaInited
}
