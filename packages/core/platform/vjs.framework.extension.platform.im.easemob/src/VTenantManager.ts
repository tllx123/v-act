import {
  RemoteMethodAccessor as remoteMethodAccessor,
  RemoteOperation as remoteOperation
} from '@v-act/vjs.framework.extension.platform.services.operation.remote'

export function initModule(sb) {}

let tenantAOPInstance

const putInstance = function (ins) {
  tenantAOPInstance = ins
}

let tenantCode = ''
let tenantName = ''
let tenantMode
let tenant_prefix = '_easemob_'

/**
 * API当前是否多租户模式
 * 返回值：isTenantMode//布尔类型 （如果租户模块未安装、07service版本过低、可能会抛出运行时错误）
 */
let isTenantMode = function (callback) {
  callback = typeof callback == 'function' ? callback : function () {}

  if (tenantMode != undefined) {
    callback(tenantMode)
  } else {
    let successCB = function (data) {
      tenantMode = data.isTenantMode
      callback(tenantMode)
    }
    let errorCB = function (error) {
      window.console.log(
        '执行后台API【v_tenant】【isTenantMode】失败：' + error
      )
      tenantMode = false
      callback(tenantMode)
    }
    let params = {
      ruleSetCode: 'isTenantMode',
      componentCode: 'v_tenant',
      error: errorCB,
      isAsyn: true,
      isRuleSetCode: true,
      afterResponse: successCB
    }
    remoteMethodAccessor.invoke(params)
  }
}

let getTenantName = function (tenantCode, userName) {
  return tenantCode + tenant_prefix + userName
}

/**
 *  多租户下获取环信IM用户名
 */
let getUserName = function (userName, callback) {
  callback = typeof callback == 'function' ? callback : function () {}
  userName = userName ? userName : ''
  let isTenantModeCB = function (mode) {
    if (mode == true) {
      let getTenantCodeCB = function (tCode) {
        if (tCode) {
          userName = getTenantName(tCode, userName)
        }
        callback(userName)
      }
      getTenantCode(getTenantCodeCB)
    } else {
      callback(userName)
    }
  }
  isTenantMode(isTenantModeCB)
}

/**
 * 获取租户唯一标识
 */
let getTenantCode = function (callback) {
  callback = typeof callback == 'function' ? callback : function () {}
  if (tenantName) {
    callback(tenantCode)
  } else {
    let successCB = function (res) {
      if (res.responseText) {
        let tenantInfo = $.parseJSON(res.responseText)
        tenantCode = tenantInfo.data.tenantCode
        tenantName = tenantInfo.data.tenantName
      } else {
        window.console.error('获取租户标识失败')
        tenantCode = ''
        tenantName = ''
      }
      callback(tenantCode)
    }
    let ajaxUrl = 'module-operation!executeOperation?operation=GetTenantInfo'
    remoteOperation.orginalRequest({
      host: ajaxUrl,
      param: {},
      isAsync: true,
      afterResponse: successCB
    })
  }
}

/**
 *  清空多租户code缓存
 */
let clearTenantInfo = function () {
  tenantCode = ''
  tenantName = ''
  tenantMode = undefined
}

export {
  addGroupMembers,
  addListener,
  addToGroupBlackList,
  changeGroupInfo,
  clearTenantInfo,
  createGroup,
  destroyGroup,
  getGroupBlackList,
  getTenantCode,
  getUserName,
  initIM,
  leaveGroup,
  listGroups,
  loginWithPwd,
  loginWithToken,
  putInstance,
  queryGroupInfo,
  queryRoomMember,
  quit,
  register,
  removeFromGroupBlackList,
  sendCmdText,
  sendMedia,
  sendText
}
