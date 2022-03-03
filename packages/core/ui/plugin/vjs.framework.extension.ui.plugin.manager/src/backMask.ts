import { BackMask as service } from '@v-act/vjs.framework.extension.platform.services.view.ui'

let undefined
exports.initModule = function (sb) {}

const Show = function () {
  service.Show()
}

const Hide = function () {
  service.Hide()
}

export { Show, Hide }
