import { BackMask as service } from '@v-act/vjs.framework.extension.platform.services.view.ui'

export function initModule(sb) {}

const Show = function () {
  service.Show()
}

const Hide = function () {
  service.Hide()
}

export { Hide, Show }