import { config as sdkConfigService } from '@v-act/vjs.framework.extension.platform.service.native.sdk'

const getCurrentPosition = function (successCB: Function, errorCB: Function) {
  sdkConfigService.initConfig(
    function () {
      //@ts-ignore
      dd.device.geolocation.get({
        targetAccuracy: 200, //期望定位精度半径(单位米)，采用推荐值200m
        coordinate: 1, //1：获取高德坐标；0：获取标准坐标；
        withReGeocode: false, //是否需要带有逆地理编码信息
        useCache: false, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result: Record<string, any>) {
          /* 高德坐标 result 结构
                {
                    longitude : Number,
                    latitude : Number,
                    accuracy : Number,
                    address : String,
                    province : String,
                    city : String,
                    district : String,
                    road : String,
                    netType : String,
                    operatorType : String,
                    errorMessage : String,
                    errorCode : Number,
                    isWifiEnabled : Boolean,
                    isGpsEnabled : Boolean,
                    isFromMock : Boolean,
                    provider : wifi|lbs|gps,
                    isMobileEnabled : Boolean
                }
                */
          let latitude = result.latitude // 纬度，浮点数，范围为90 ~ -90
          let longitude = result.longitude // 经度，浮点数，范围为180 ~ -180。
          let position = {
            coords: {
              latitude: latitude,
              longitude: longitude
            }
          }
          successCB(position)
        },
        onFail: function (err: any) {
          alert(JSON.stringify(err))
          errorCB(err)
        }
      })
    },
    function (error: any) {
      alert(JSON.stringify(error))
    }
  )
}

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { getCurrentPosition }
