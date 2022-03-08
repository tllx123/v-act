/**
 * 获取用户信息(暂时只获取用户唯一标识：用户帐号)
 */
const main = function () {
  if (!isWeiXinFunc()) {
    alert('【获取微信用户信息】函数仅支持微信端使用!')
    return ''
  } else {
    var code = location.href.substring(
      location.href.indexOf('&code=') + 6,
      location.href.indexOf('&state')
    )
    var userID = null
    var cb = function (res) {
      if (res.responseText) {
        var obj = $.parseJSON(res.responseText)
        userID = obj.userid
        if (userID) {
          setCookie('wx_user_id', userID)
        } else {
          alert('获取微信用户信息失败，请刷新页面再次尝试！')
        }
      } else {
        alert('获取微信用户信息失败，请重新尝试！')
      }
    }

    var currUrl = location.href.split('#')[0]
    var config = { callBack: cb, isAsync: false }
    var ajaxUrl =
      location.href.substring(0, location.href.indexOf('module-operation')) +
      '/module-operation!executeOperation?operation=WexinGetUserInfo'
    var ajaxData = {
      code: code
    }
    //从cookie中获取当前用户名，如果不存在则向后台获取
    userID = getCookie('wx_user_id')
    if (!userID) {
      remoteOperation.orginalRequest({
        host: ajaxUrl,
        param: { code: code },
        isAsync: false,
        afterResponse: cb
      })
    }
    return userID
  }
}
export { main }
