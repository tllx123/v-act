import { ViewInit as viewInit } from '@v-act/vjs.framework.extension.platform.init.view'

export function initModule(sb) {}

const initComponent = function (params: any) {
  viewInit.initComponentSchema(params)
}

export { initComponent }
