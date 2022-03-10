import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as callCommandService from '../util/CallCommand'
import * as Exception from './Exception'

let ExpectedException = function (message, e, errInfo, json) {
  Exception.apply(this, arguments, errInfo, json)
}

const initModule = function (sandbox) {}

let _toStr = function (obj) {
  let isError = false
  try {
    //能用接口转就直接转
    let result = jsonUtil.obj2json(obj)
    return result
  } catch (e) {
    isError = true
  }
  if (isError) {
    //一般都是内嵌对象
    let newObj
    if (obj instanceof Array) {
      newObj = []
      for (let i = 0, len = obj.length; i < len; i++) {
        try {
          let value = obj[i]
          if (
            value &&
            typeof value == 'object' &&
            (datasourceFactory.isDatasource(value) ||
              (value._get &&
                value._get() &&
                datasourceFactory.isDatasource(value._get())))
          ) {
            let metadata = value.getMetadata()
            if (metadata) {
              if (typeof metadata.getDatasourceName == 'function') {
                //平台实体
                value = metadata.getDatasourceName()
              } else if (typeof metadata.getCode == 'function') {
                //兼容vds实体
                value = metadata.getCode()
              } else {
                value = 'Datasource'
              }
            } else {
              value = 'Datasource'
            }
            newObj.push(value)
          } else {
            newObj.push(jsonUtil.obj2json(value))
          }
        } catch (e) {}
      }
    } else {
      newObj = {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          try {
            let val = jsonUtil.obj2json(obj[key]) //能转换成功就可以作为异常信息
            newObj[key] = obj[key]
          } catch (e) {}
        }
      }
    }
    if (newObj) return jsonUtil.obj2json(newObj)
  }
  return ''
}
/**
 * 清除异常详情的对象，避免序列化时报错
 * */
let clearDetailObj = function (exception) {
  if (typeof exception.getDetailInfo == 'function') {
    let detailInfos = exception.getDetailInfo()
    if (detailInfos && detailInfos instanceof Array) {
      for (let i = 0, len = detailInfos.length; i < len; i++) {
        let map = detailInfos[i]
        if (!map || !map.code) {
          continue
        }
        let val = map.value
        if (val && val instanceof Object) {
          map.value = _toStr(val)
        }
      }
    }
  }
}

ExpectedException.prototype = {
  initModule: function (sandbox) {
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(ExpectedException, Exception, sandbox)
  },

  /**
   * 异常标题
   * */
  getTitle: function () {
    return i18n.get('错误', '前端异常弹框的标题')
  },
  /**
   * 异常弹框顶部信息
   * */
  getMsgHeader: function () {
    return i18n.get('前端框架异常', '前端异常弹框的顶部描述信息')
  },
  /**
   * 异常弹框标题
   * */
  getMsg: function () {
    return this.message
  },
  /**
   * 获取详细描述信息, 数组是为了顺序
   * */
  getDetailInfo: function () {
    let config = []
    let errInfo = this.errInfo
    if (errInfo && errInfo.exceptionDatas instanceof Array) {
      config = errInfo.exceptionDatas
    }
    return config
  },

  handling: function () {
    if (this.isInApp()) {
      alert(this.message)
      log.error(this.getClassName() + ':' + this.message)
      log.error(this.getStackTrace())
    } else {
      clearDetailObj(this) //清除异常详情的对象，避免序列化时报错
      let params = {
        title: this.getTitle(),
        msgHeader: this.getMsgHeader(),
        msg: this.getMsg(),
        // 'detail':this.getStackTrace()
        detail: this.getDetailHtml(this.errInfo),
        exceptionData: this.getExceptionData(),
        exceptionMap: this.serialize(),
        viewonly: this.isViewonly(),
        network: this.isNetwork(),
        hideFeeback: this.getHideFeeback(),
        containerId: this.getContainerId()
      }
      if (typeof this.getModalClosedHandler == 'function') {
        params.callback = this.getModalClosedHandler()
      }
      callCommandService.showDialog(params, this.getClassName())
      if (this.isSubmit())
        //服务端异常不需要提交，服务端异常在创建异常对象时会标记为服务端异常
        callCommandService.callCommand(params)
      throw this
    }
  }
}

export default ExpectedException
