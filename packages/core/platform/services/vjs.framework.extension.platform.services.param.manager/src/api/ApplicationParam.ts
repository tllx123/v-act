import { ApplicationParam as appParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'

export function initModule(sb) {}

const getRuleSetInputs = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    metaCode = params.metaCode
  return appParam.getRuleSetInputs(componentCode, windowCode, metaCode)
}

export { getRuleSetInputs }
