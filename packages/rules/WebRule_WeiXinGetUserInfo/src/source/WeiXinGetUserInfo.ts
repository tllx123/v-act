import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ProgressBarUtil as progressBar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let routeContext = ruleContext.getRouteContext()
  if (!isWeiXinFunc()) {
    alert('【获取微信用户信息】规则仅支持微信端使用!')
    routeContext.markForInterrupt(routeContext.CURRENT)
  } else {
    let ruleCfgValue = ruleContext.getRuleCfg()
    let inParams = ruleCfgValue['inParams']
    let inParamsObj = jsonUtil.json2obj(inParams)
    let targetEntityName = inParamsObj.saveEntitys.datas.values[0].code //目标实体
    let fieldMappings = inParamsObj.entityFieldMapping.datas.values
    if (targetEntityName) {
      let datasource = datasourceManager.lookup({
        datasourceName: targetEntityName
      })
      let datas = {}
      let code = location.href.substring(
        location.href.indexOf('&code=') + 6,
        location.href.indexOf('&state')
      )
      //从cookie中获取当前用户名，如果不存在则向后台获取
      let cookie_userid = getCookie('wx_userid')
      let cb = function (res) {
        if (res.responseText) {
          let userInfo = $.parseJSON(res.responseText)
          if (userInfo.userid) {
            let userid = userInfo.userid
            let weixinid = userInfo.weixinid
            let name = userInfo.name
            let avatar = userInfo.avatar
            let email = userInfo.email
            let mobile = userInfo.mobile
            let datas = getFieldMapping(
              fieldMappings,
              userid,
              weixinid,
              name,
              avatar,
              email,
              mobile
            )
            datasource.load({ datas: datas, isAppend: false })
            setCookie('wx_userid', userid)
            setCookie('wx_weixinid', weixinid)
            setCookie('wx_name', encodeURI(name))
            setCookie('wx_avatar', avatar)
            setCookie('wx_email', email)
            setCookie('wx_mobile', mobile)
          } else {
            alert('获取微信用户信息失败，请刷新页面再次尝试！')
          }
        } else {
          alert('获取微信用户信息失败，请重新尝试！')
        }
        progressBar.hideProgress()
        ruleContext.setRuleStatus(true)
        ruleContext.fireRuleCallback()
        ruleContext.fireRouteCallback()
      }

      let ajaxUrl =
        location.href.substring(0, location.href.indexOf('module-operation')) +
        '/module-operation!executeOperation?operation=WexinGetUserInfo'
      if (!cookie_userid) {
        progressBar.showProgress('正在获取微信用户信息...')
        remoteOperation.orginalRequest({
          host: ajaxUrl,
          param: { code: code },
          isAsync: true,
          afterResponse: cb
        })
        ruleContext.markRouteExecuteUnAuto()
      } else {
        let cookie_weixinid = getCookie('wx_weixinid')
        let cookie_name = getCookie('wx_name')
        if (cookie_name) {
          cookie_name = decodeURI(cookie_name)
        }
        let cookie_avatar = getCookie('wx_avatar')
        let cookie_email = getCookie('wx_email')
        let cookie_mobile = getCookie('wx_mobile')
        let datas = getFieldMapping(
          fieldMappings,
          cookie_userid,
          cookie_weixinid,
          cookie_name,
          cookie_avatar,
          cookie_email,
          cookie_mobile
        )
        datasource.load({ datas: datas, isAppend: false })
      }
    } else {
      alert('目标实体为空！请检查规则配置是否正确！')
    }
    return true
  }
}

function isWeiXinFunc() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

let constant = {
  USER_ID: 'userid', //用户ID（企业号录入时的用户ID）
  WEIXIN_ID: 'weixinid', //微信号
  NAME: 'name', //姓名（企业号录入时的姓名）
  AVATAR: 'avatar', //头像地址
  EMAIL: 'email', //邮箱
  MOBILE: 'mobile' //电话
}

/**
 * 获取目标实体与来源数据的字段映射信息
 */
let getFieldMapping = function (
  mappings,
  userid,
  weixinid,
  name,
  avatar,
  email,
  mobile
) {
  let datas = []
  if (mappings && mappings.length > 0) {
    let data = {}
    for (let i = 0; i < mappings.length; i++) {
      let mapping = mappings[i]
      let targetField = mapping.targetSaveFieldCode
      let sourceField = mapping.sourceSaveFieldCode
      switch (sourceField) {
        case constant.USER_ID:
          data[targetField] = userid
          break
        case constant.WEIXIN_ID:
          data[targetField] = weixinid
          break
        case constant.NAME:
          data[targetField] = name
          break
        case constant.AVATAR:
          data[targetField] = avatar
          break
        case constant.EMAIL:
          data[targetField] = email
          break
        case constant.MOBILE:
          data[targetField] = mobile
          break
        default:
          break
      }
    }
    datas.push(data)
  }
  return datas
}

/**
 * 根据key获取cookie中的值
 */
let getCookie = function (key) {
  let cookies = document.cookie
  let arrCookie = cookies.split('; ')
  let value
  for (let i = 0; i < arrCookie.length; i++) {
    let arr = arrCookie[i].split('=')
    if (key == arr[0]) {
      value = arr[1]
      break
    }
  }
  return value
}

/**
 * 设置cookie
 */
let setCookie = function (key, value) {
  document.cookie = key + '=' + value
}

export { main }
