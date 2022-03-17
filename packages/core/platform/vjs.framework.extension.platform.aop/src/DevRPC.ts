import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let aop:any
let charMap = {
  '@0': new RegExp(':', 'g'),
  '@1': new RegExp('\\.', 'g'),
  '@2': new RegExp('/', 'g'),
  '@3': new RegExp('!', 'g'),
  '@4': new RegExp('\\?', 'g'),
  '@5': new RegExp('=', 'g'),
  '@6': new RegExp('&', 'g')
}

let DevRPC = function (params:any) {
  //@ts-ignore
  this.url = params.url || ''
  //@ts-ignore
  this.param = params.param || {}
  //@ts-ignore
  this.timeout = params.timeout || 3000
  //@ts-ignore
  this.success = params.success || null
  //@ts-ignore
  this.error = params.error || null
}

DevRPC.prototype = {
  _putAop: function (a:any) {
    aop = a
  },

 

  getServerHost: function () {
    //@ts-ignore
    if (window.GlobalVariables) {
      //如果存在，则代表为手机app
      //@ts-ignore
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

  processUrl: function (url:string) {
    for (let k in charMap) {
      url = url.replace(charMap[k], k)
    }
    return url
  },

  rpcServer: function (param:any, success:any, error:any) {
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
      afterResponse: function (rs:any) {
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

  rpcDev: function (id:string) {
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

  suspend: function (id:string) {
    //请求服务，服务执行线程挂起，等待开发系统调用
    this.rpcServer(
      {
        type: 'suspend',
        closeId: this.param.NowServerUUID,
        id: id
      },
      function (rs:any) {
        let status = rs.status
        if (status == 'timeoutStatus') {
          let result = confirm(
            '与开发系统调试超时，是否继续等待？\n \n确认为继续调试\n取消为终止调试'
          )
          if (result) {
            //@ts-ignore
            this.rpcServer(
              {
                type: 'wait',
                id: id,
                data: rs.data
              },
              function (rs:any) {
                //@ts-ignore
                this.suspend(rs.id)
              },
              function (rs:any) {
                //@ts-ignore
                this.error(rs)
              }
            )
          } else {
            aop.markDebugDisable()
          }
        } else {
          //@ts-ignore
          this.success(jsonUtil.json2obj(rs.data))
        }
      },
      function (rs:any) {
        //@ts-ignore
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
      function (rs:any) {
        id = rs.id
      },
      function () {
        //@ts-ignore
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

export default DevRPC
