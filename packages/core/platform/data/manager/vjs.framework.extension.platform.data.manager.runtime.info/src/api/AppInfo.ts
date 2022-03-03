let isAppDataLoaded = false

const markAppSchemaInited = function () {
  isAppDataLoaded = true
}

const isAppSchemaInited = function () {
  return isAppDataLoaded
}

export { markAppSchemaInited, isAppSchemaInited }
