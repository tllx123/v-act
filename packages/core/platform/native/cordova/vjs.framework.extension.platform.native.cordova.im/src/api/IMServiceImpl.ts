import { IM as IMService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

export function initModule(sb) {
  IMService.putInstance(exports)
}

/**
 * 初始化IM插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Easemob = cordova.plugins.easemob
}

const login = function (params, type) {
  switch (type) {
    case IMService.IMTYPE.EASEMOB:
      loginWithEM(params)
      break
    default:
      loginWithEM(params)
      break
  }
}

const logout = function (params, type) {
  switch (type) {
    case IMService.IMTYPE.EASEMOB:
      logoutWithEM(params)
      break
    default:
      logoutWithEM(params)
      break
  }
}

const customerChat = function (params, type) {
  switch (type) {
    case IMService.IMTYPE.EASEMOB:
      customerChatWithEM(params)
      break
    default:
      customerChatWithEM(params)
      break
  }
}

/**
 * 环信-登录
 * @param {Function} successCallback 接收参数："success"
 * @param {Function} errorCallback   接收参数：登录错误信息（String）
 * @param {String}   username:用户名
 * @param {String}   password:密码
 */
function loginWithEM(params) {
  let username = params.username
  let password = params.password
  let successCallback = params.successCallback
  let errorCallback = params.errorCallback
  cordova.plugins.easemob.login(successCallback, errorCallback, {
    username: username,
    password: password
  })
}

/**
 * 环信-退出登录
 * @param {Function} successCallback 接收参数："success"
 * @param {Function} errorCallback   接收参数：登录错误信息（String）
 */
function logoutWithEM(params) {
  let successCallback = params.successCallback
  let errorCallback = params.errorCallback
  cordova.plugins.easemob.logout(successCallback, errorCallback)
}

/**
 * 环信-打开与客服会话界面
 * @param {Function} successCallback 接收参数："success"
 * @param {Function} errorCallback   接收参数：登录错误信息（String）
 * @param {String}   customer_id     环信客服后台与APP建立关联时设置的 IM客服用户ID
 * @param {String}   customer_title  与客服会话窗的标题（默认为"客服"）
 * @param {object} 	  user_info        用户信息
 * 示例：{
 * 			userNickname:"",  //昵称
 * 			trueName:"",	  //真实姓名
 * 			qq:"",			  //QQ
 * 			phone:"",		  //电话
 * 			companyName:"",   //公司名称
 * 			email:""          //邮箱
 * 		 }
 */
function customerChatWithEM(params) {
  let customer_id = params.customer_id
  let customer_title = params.customer_title
  let successCallback = params.successCallback
  let errorCallback = params.errorCallback
  let user_info = params.user_info
  cordova.plugins.easemob.showChatViewWithKefu(successCallback, errorCallback, {
    kefu_id: customer_id,
    kefu_title: customer_title,
    user_info: user_info
  })
}
export { customerChat, login, logout }
