import { ApplicationParam as appParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'

let undefined

exports.initModule = function (sb) {}

const getRuleSetInputs = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    metaCode = params.metaCode
  return appParam.getRuleSetInputs(componentCode, windowCode, metaCode)
}

export { getRuleSetInputs }
