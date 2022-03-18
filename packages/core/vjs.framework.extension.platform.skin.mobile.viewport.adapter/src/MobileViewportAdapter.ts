import { variable as skin } from '@v-act/vjs.framework.extension.platform.interface.skin'
import { MobileViewPortAdapter as mobileViewPortAdapter } from '@v-act/vjs.framework.extension.platform.interface.mobile.viewport.adapter'

interface newDataRule {
  '@m-viewport-top-fit': string
  '@m-viewport-left-fit': string
  '@m-viewport-bottom-fit': string
  '@m-viewport-right-fit': string
}
interface dataRule {
  top: string
  left: string
  right: string
  bottom: string
}

export function initModule(): void {
  let datas: dataRule = mobileViewPortAdapter.getViewPortSize()

  let newDatas: newDataRule = {
    '@m-viewport-top-fit': datas.top,
    '@m-viewport-left-fit': datas.left,
    '@m-viewport-bottom-fit': datas.bottom,
    '@m-viewport-right-fit': datas.right
  }

  skin.put({
    id: 'vjs.framework.extension.platform.skin.base.mobile.$lessVar',
    vars: newDatas
  })
}
