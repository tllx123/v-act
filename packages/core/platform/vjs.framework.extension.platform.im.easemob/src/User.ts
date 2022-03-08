import { VTenantManager as vTenantManager } from '@v-act/vjs.framework.extension.platform.im'

export function initModule(sb) {
  let IMUserService = sb.getService(
    'vjs.framework.extension.platform.services.im.User'
  )
  IMUserService.putInstance(exports)
}

let createConn = function () {
  if (!window.conn) {
    window.conn = new WebIM.connection({
      https: WebIM.config.https,
      url: WebIM.config.xmppURL,
      isAutoLogin: WebIM.config.isAutoLogin,
      isMultiLoginSessions: true
    })
  }
}

const register = function (username, password, nickname, successCB, errorCB) {
  vTenantManager.getUserName(username, function (tusername) {
    let options = {
      username: tusername,
      password: password,
      nickname: nickname,
      appKey: WebIM.config.appkey,
      success: successCB,
      error: errorCB,
      apiUrl: WebIM.config.apiURL
    }
    window.conn.registerUser(options)
  })
}

const loginWithPwd = function (username, password, appkey, successCB, errorCB) {
  vTenantManager.clearTenantInfo()
  vTenantManager.getUserName(username, function (tusername) {
    let options
    if (window.conn._tokenValue) {
      options = {
        apiUrl: WebIM.config.apiURL,
        user: tusername,
        pwd: password,
        accessToken: window.conn._tokenValue,
        appKey: appkey,
        success: successCB,
        error: errorCB
      }
    } else {
      options = {
        apiUrl: WebIM.config.apiURL,
        user: tusername,
        pwd: password,
        appKey: appkey,
        success: successCB,
        error: errorCB
      }
    }
    window.conn.open(options)
    window.conn.setPresence()
  })
}

const loginWithToken = function (
  username,
  password,
  appkey,
  successCB,
  errorCB
) {
  vTenantManager.clearTenantInfo()
  vTenantManager.getUserName(username, function (tusername) {
    let options = {
      apiUrl: WebIM.config.apiURL,
      user: tusername,
      pwd: password,
      accessToken: 'token',
      appKey: appkey,
      success: successCB,
      error: errorCB
    }

    window.conn.open(options)
    window.conn.setPresence()
  })
}

const quit = function (successCB, errorCB) {
  try {
    window.conn.close()
    vTenantManager.clearTenantInfo()
    if (typeof successCB == 'function') {
      successCB()
    }
  } catch (e) {
    if (typeof errorCB == 'function') {
      errorCB()
    }
  }
}

export {
  addGroupMembers,
  addListener,
  addToGroupBlackList,
  changeGroupInfo,
  createGroup,
  destroyGroup,
  getGroupBlackList,
  initIM,
  leaveGroup,
  listGroups,
  loginWithPwd,
  loginWithToken,
  queryGroupInfo,
  queryRoomMember,
  quit,
  register,
  removeFromGroupBlackList,
  sendCmdText,
  sendMedia,
  sendText
}
