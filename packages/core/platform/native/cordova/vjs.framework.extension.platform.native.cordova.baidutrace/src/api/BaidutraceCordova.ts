import { Baidutrace as BaidutraceService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.baidutrace'

BaidutraceService.putInstance(exports)

/**
 * 初始化百度鹰眼服务插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.BaiduTrace = cordova.plugins.BaiduTrace
}

/**
 * 获取轨迹上传服务开启状态
 *
 * @return 状态码定义如下：
 * 	  "Stopped"   未开启
 *    "Started"   已开启
 *    "Starting"   正在启动中
 *
 */
let gatherState = 'Stopped'

const getGatherState = function () {
  return gatherState
}

const startGather = function (
  entityName: string,
  successCallback: Function,
  errorCallback: Function
) {
  //@ts-ignore
  if (window.cordova) {
    gatherState = 'Starting'
    let serviceSuccess = function (result: Record<string, any>) {
      let gatherSuccess = function (result: Record<string, any>) {
        gatherState = 'Started'
        if (typeof successCallback == 'function') {
          successCallback(result)
        }
      }

      let gatherError = function (gatherErrorMsg: string) {
        if (gatherErrorMsg && gatherErrorMsg.indexOf('请勿重复开启') > -1) {
        } else {
          gatherState = 'Stopped'
        }
        let serviceSuccess = function (result: Record<string, any>) {
          if (typeof successCallback == 'function') {
            errorCallback(gatherErrorMsg)
          }
        }

        let serviceError = function (serviceErrorMsg: string) {
          if (typeof errorCallback == 'function') {
            errorCallback(gatherErrorMsg)
          }
        }
        //@ts-ignore
        cordova.plugins.BaiduTrace.stopService(serviceSuccess, serviceError)
      }
      //@ts-ignore
      cordova.plugins.BaiduTrace.startGather(gatherSuccess, gatherError)
    }

    let serviceError = function (error: any) {
      gatherState = 'Stopped'
      if (typeof errorCallback == 'function') {
        errorCallback(error)
      }
    }
    //@ts-ignore
    cordova.plugins.BaiduTrace.startService(
      entityName,
      serviceSuccess,
      serviceError
    )
  } else {
    alert('PC端不支持【百度鹰眼轨迹上传】规则，请在移动App端使用该规则')
  }
}

const stopGather = function (
  entityName: string,
  successCallback: Function,
  errorCallback: Function
) {
  //@ts-ignore
  if (window.cordova) {
    let gatherSuccess = function (result: Record<string, any>) {
      gatherState = 'Stopped'
      if (typeof successCallback == 'function') {
        successCallback(result)
      }
    }

    let gatherError = function (error: any) {
      if (typeof errorCallback == 'function') {
        errorCallback(error)
      }
    }
    //@ts-ignore
    cordova.plugins.BaiduTrace.stopService(gatherSuccess, gatherError)
  } else {
    alert('PC端不支持【百度鹰眼轨迹上传】规则，请在移动App端使用该规则')
  }
}

export { getGatherState, startGather, stopGather }
