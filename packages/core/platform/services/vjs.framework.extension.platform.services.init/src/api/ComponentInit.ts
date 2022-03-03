import { ViewInit as viewInit } from '@v-act/vjs.framework.extension.platform.init.view'

let undefined

exports.initModule = function (sb) {}

const initComponent = function (params) {
  viewInit.initComponentSchema(params)
}

export { initComponent }
