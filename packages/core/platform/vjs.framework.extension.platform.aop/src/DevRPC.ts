import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let aop
let charMap = {
  '@0': new RegExp(':', 'g'),
  '@1': new RegExp('\\.', 'g'),
  '@2': new RegExp('/', 'g'),
  '@3': new RegExp('!', 'g'),
  '@4': new RegExp('\\?', 'g'),
  '@5': new RegExp('=', 'g'),
  '@6': new RegExp('&', 'g')
}

let DevRPC = function (params) {
  this.url = params.url || ''
  this.param = params.param || {}
  this.timeout = params.timeout || 3000
  this.success = params.success || null
  this.error = params.error || null
}

DevRPC.prototype = {
  _putAop: function (a) {
    aop = a
  },

  initModule: function (sb) {},

  getServerHost: function () {
    if (window.GlobalVariables) {
      //如果存在，则代表为手机app
      return GlobalVariables.getServerUrl()
    }
    return location.protocol + '//' + location.host
  },

  getLocalHost: function () {
    return (
      this.getServerHost() +
      environment.getContextPath() +
      '/module-operation!executeOperation?operation=aop&componentCode=' +
      this.param.componentCode
    )
  },

  processUrl: function (url) {
    for (let k in charMap) {
      url = url.replace(charMap[k], k)
    }
    return url
  },

  rpcServer: function (param, success, error) {
    let _this = this
    //发送请求，提交数据，发送到服务器
    rpc.orginalRequest({
      isAsync: false,
      type: 'POST',
      host: 'module-operation!executeOperation',
      param: {
        componentCode: this.param.componentCode,
        windowCode: this.param.windowCode,
        operation: 'aop',
        ajaxRequest: true,
        token: encodeURIComponent(
          jsonUtil.obj2json({
            data: param
          })
        )
      },
      afterResponse: function (rs) {
        if (success) {
          success.call(_this, jsonUtil.json2obj(rs.responseText))
        }
      },
      error: function () {
        if (error) {
          error.apply(_this, arguments)
        }
      }
    })
  },

  rpcDev: function (id) {
    let uuid = this.param.NowServerUUID
      ? '&closeId=' + this.param.NowServerUUID
      : ''
    rpc.crossDomainRequest({
      host:
        this.url + '/' + id + '/' + this.processUrl(this.getLocalHost()) + uuid,
      type: 'GET',
      param: {}
    })
  },

  suspend: function (id) {
    //请求服务，服务执行线程挂起，等待开发系统调用
    this.rpcServer(
      {
        type: 'suspend',
        closeId: this.param.NowServerUUID,
        id: id
      },
      function (rs) {
        let status = rs.status
        if (status == 'timeoutStatus') {
          let result = confirm(
            '与开发系统调试超时，是否继续等待？\n \n确认为继续调试\n取消为终止调试'
          )
          if (result) {
            this.rpcServer(
              {
                type: 'wait',
                id: id,
                data: rs.data
              },
              function (rs) {
                this.suspend(rs.id)
              },
              function (rs) {
                this.error(rs)
              }
            )
          } else {
            aop.markDebugDisable()
          }
        } else {
          this.success(jsonUtil.json2obj(rs.data))
        }
      },
      function (rs) {
        _this.error(rs)
      }
    )
  },

  request: function () {
    //先将数据同步到服务器上
    let id
    let _this = this
    this.rpcServer(
      {
        type: 'store',
        closeId: this.param.NowServerUUID,
        data: jsonUtil.obj2json(this.param)
      },
      function (rs) {
        id = rs.id
      },
      function () {
        this.error(arguments)
      }
    )
    //通过id，发起跨区请求，
    this.rpcDev(id)
    //请求服务，服务执行线程挂起，等待开发系统调用
    this.suspend(id)
  }
}

//获取服务器初始化信息，使用type为：debugInfoUpdate
//	getdebugInfoUpdate:function(){
//		var updateArr=[];
//		this.rpcServer({
//			"type" : "debugInfoUpdate",
//			"data" : ""
//		}, function(rs){
//			updateArr=rs;
//		}, function(){
//			this.error(arguments);
//		});
//	}

return DevRPC

export { _putAop, clear, getHook, init, isDebugger, isInited, update }
