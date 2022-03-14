import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'



let getSeries = function () {
  let series = ScopeManager.getProperty('type')
  if (series == null) {
    throw Error('未能找到所属控件体系...')
  }

  return series
}

export { getSeries }
