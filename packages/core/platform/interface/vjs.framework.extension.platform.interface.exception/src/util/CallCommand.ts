import { FrontEndAlerter as alerter } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { RemoteOperation as remote } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

const showDialog = function (params: any, exceptionType: any) {
  /* 由弹框内部处理是否重复弹框 */
  //		if(isShowDialog){//异常弹窗运行中，避免其他弹窗覆盖
  //			return;
  //		}
  //		isShowDialog = true;
  //		var func = params.callback;
  //		params.callback = (function(cb){
  //			return function(){
  //				isShowDialog = false;
  //				if(typeof(cb) == "function"){
  //					cb.apply(this, arguments);
  //				}
  //			}
  //
  //		})(func)
  /* 若是指定容器发生的网络异常，则统一调用VMetrix提供的异常接口，暂不使用异常弹框 */
  if (
    params.network === true &&
    // @ts-ignore
    VMetrix.showNetworkError &&
    params.msg &&
    params.containerId
  ) {
    // @ts-ignore
    VMetrix.showNetworkError(params.msg, params.containerId)
    return
  }
  let types: any = alerter.TYPE
  if (types) {
    switch (exceptionType) {
      case 'BusinessException':
        params.type = types.BUSINESS
        break
      case 'ConfigException':
        params.type = types.CONFIG
        break
      case 'DevException':
        params.type = types.DEV
        break
      case 'UnLoginException':
        params.type = types.UnLogin
      //					isShowDialog = false;
      default:
        params.type = types.SYSTEM
        break
    }
  }
  alerter.error(params)
}

const callCommand = function (value: any, callback: any, params: any) {
  if (!remote) return
  let json = jsonUtil.obj2json(value)
  //测试数据，需删除
  remote.request({
    operation: 'FrontendException',
    windowCode: null, //设置窗体Code，防止接口里设置导致走权限校验
    params: {
      detail: json
    },
    error: function (err: any) {
      logUtil.error(err && (err.msg || err.message || err))
    } /* 网络异常时，提交请求又会发生异常，如果第一次的异常在组件容器发生，则页面会出现多个网络异常的弹框，此处先把提交产生异常暂不处理，如果后续产生其他问题，需要兼容前面说的场景 */
  })
}

export {
  // _getHandler,
  callCommand,
  // create,
  // genError,
  // getExceptionHtml,
  // getExceptionTypeByError,
  // handle,
  // initModule,
  // isAcceptType,
  // isException,
  // onBeforeHandler,
  // onHandleFunction,
  // plupload,
  showDialog
  // unSerialize
}
