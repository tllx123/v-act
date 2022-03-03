exports.initModule = function (sBox) {
  let skin = sBox.getService(
    'vjs.framework.extension.platform.interface.skin.variable'
  )
  let mobileViewPortAdapter = sBox.getService(
    'vjs.framework.extension.platform.interface.mobile.viewport.adapter.MobileViewPortAdapter'
  )
  let datas = mobileViewPortAdapter.getViewPortSize()
  let newDatas = {}
  newDatas['@m-viewport-top-fit'] = datas.top
  newDatas['@m-viewport-left-fit'] = datas.left
  newDatas['@m-viewport-bottom-fit'] = datas.bottom
  newDatas['@m-viewport-right-fit'] = datas.right
  skin.put({
    id: 'vjs.framework.extension.platform.skin.base.mobile.$lessVar',
    vars: newDatas
  })
}
