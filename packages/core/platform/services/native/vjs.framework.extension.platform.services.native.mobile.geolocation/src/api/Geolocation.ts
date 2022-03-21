let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const getCurrentPosition = function (successCB: any, errorCB: any) {
  //@ts-ignore
  if (window.GlobalVariables) {
    instance.getCurrentPosition(successCB, errorCB)
  } else if (isWeiXinFunc()) {
    //@ts-ignore
    wx.ready(function () {
      //@ts-ignore
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res: any) {
          let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          let position = {
            coords: {
              latitude: latitude,
              longitude: longitude
            }
          }
          successCB(position)
        }
      })
    })
  } else {
    alert('【获取当前经纬度】规则仅支持移动端使用')
  }
}

function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  //@ts-ignore
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}
export { getCurrentPosition, putInstance }
