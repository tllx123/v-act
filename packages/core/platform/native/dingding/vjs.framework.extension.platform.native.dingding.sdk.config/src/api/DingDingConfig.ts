import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let configInited = false

const initConfig = function (
  successCB: Function,
  errorCB: Function,
  apiList: Array<string>
) {
  if (configInited) {
    successCB()
    return
  }

  let scriptLoaded = false,
    paramLoaded = false,
    agentId: string,
    corpId: string,
    signature: any,
    nonceStr: string,
    url,
    timestamp: any
  let cb = function (res: any) {
    paramLoaded = true
    let obj = $.parseJSON(res)
    agentId = obj.agentId
    corpId = obj.corpId
    signature = obj.signature
    nonceStr = obj.nonceStr
    url = obj.url
    timestamp = obj.timestamp

    if (scriptLoaded) {
      initDingDingConfig()
    }
  }

  let sendRequest = function (
    url: string,
    params: Record<string, any>,
    isAsync: boolean,
    callBack: Function
  ) {
    $.ajax({
      type: 'POST',
      url: url,
      async: isAsync,
      data: params,
      error: function (
        xhr: XMLHttpRequest,
        textStatus: string,
        errorThrown: any
      ) {
        if (errorCB) {
          errorCB('钉钉环境配置错误，请联系管理员。')
        } else alert('钉钉环境配置错误，请联系管理员。')
      },
      success: function (xhr: XMLHttpRequest, status: string) {
        if (callBack) {
          callBack(xhr, status)
        }
      }
    })
  }

  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('module-operation')) +
    '/module-operation!executeOperation?operation=getDingDingAuthParam'
  let ajaxData = {
    url: location.href.split('#')[0]
  }
  sendRequest(ajaxUrl, ajaxData, false, cb)

  //@ts-ignore
  vdk.resource.add(
    //@ts-ignore
    new vdk.resource({
      id: 'dingdingconfig',
      paths: [
        'https://g.alicdn.com/dingding/dingtalk-jsapi/2.7.13/dingtalk.open.js'
      ]
    })
  )
  //@ts-ignore
  vdk.resource.load(function () {
    scriptLoaded = true
    console.log('钉钉配置文件加载成功')
    if (paramLoaded) {
      initDingDingConfig()
    }
  })

  function initDingDingConfig() {
    console.log('钉钉鉴权开始')
    let ddConfig: Record<string, any> = {
      agentId: agentId, // 必填，微应用ID
      corpId: corpId, //必填，企业ID
      timeStamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      type: 0 / 1 //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
    }

    let innerApiList = [
      'device.geolocation.get',
      'device.connection.getNetworkType',
      'biz.util.uploadImageFromCamera'
    ]
    if (apiList) {
      //将用户传入的apiList和内置的api列表合并，防止用户主动调用改接口影响到内置功能的使用。
      let apiListToAdd = []
      for (let j = 0, len = innerApiList.length; j < len; j++) {
        let api = innerApiList[j]
        let add = true
        for (let k = 0, len2 = apiList.length; k < len2; k++) {
          if (api == apiList[k]) {
            add = false
            break
          }
        }
        if (add) {
          apiListToAdd.push(api)
        }
      }
      for (let j = 0, len = apiListToAdd.length; j < len; j++) {
        apiList.push(apiListToAdd[j])
      }

      ddConfig.jsApiList = apiList
    } else {
      ddConfig.jsApiList = innerApiList
    }
    //@ts-ignore
    dd.config(ddConfig)

    //@ts-ignore
    dd.ready(function () {
      console.log('钉钉鉴权成功')
      configInited = true
      successCB()
    })

    //@ts-ignore
    dd.error(function (err: any) {
      alert('钉钉鉴权失败。dd error: ' + JSON.stringify(err))
      errorCB(err)
    })
  }
}

export { initConfig }
