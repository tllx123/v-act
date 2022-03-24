//@ts-nocheck
/**
 * 隐藏右上角菜单接口
 */
let hideOptionMenu = function () {
  if (wx) {
    wx.hideOptionMenu()
  }
}

/**
 * 显示右上角菜单接口
 *
 */
let showOptionMenu = function () {
  if (wx) {
    wx.showOptionMenu()
  }
}

function isInApp() {
  let us = navigator.userAgent
  if (
    navigator.userAgent.indexOf('ydgApp') > 0 ||
    navigator.userAgent.indexOf('v3app')
  ) {
    return true
  }
  return false
}

/**
 * 关闭当前网页窗口接口
 */
let closeWindow = function () {
  if (isInApp()) {
    if (window.cordova) {
      let retValue = window.returnValue
      if (!window.returnValue) {
        retValue = ''
      }
      cordova.plugins.webview.close(retValue)
    }
  } else if (wx) {
    //alert(wx.closeWindow);
    wx.closeWindow()
  }
}

/**
 * 批量隐藏功能按钮接口
 * 入参说明：
 * 	{
 *	    menuList: [params] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
 *传播类
 *		发送给朋友: "menuItem:share:appMessage"
 *   	分享到朋友圈: "menuItem:share:timeline"
 *		分享到QQ: "menuItem:share:qq"
 *		分享到Weibo: "menuItem:share:weiboApp"
 *		收藏: "menuItem:favorite"
 *		分享到FB: "menuItem:share:facebook"
 *		分享到 QQ 空间/"menuItem:share:QZone"
 *保护类
 *		编辑标签: "menuItem:editTag"
 *		删除: "menuItem:delete"
 *		复制链接: "menuItem:copyUrl"
 *		原网页: "menuItem:originPage"
 *		阅读模式: "menuItem:readMode"
 *		在QQ浏览器中打开: "menuItem:openWithQQBrowser"
 *		在Safari中打开: "menuItem:openWithSafari"
 *		邮件: "menuItem:share:email"
 *		一些特殊公众号: "menuItem:share:brand"
 *	}
 */
let hideMenuItems = function (params) {
  if (wx) {
    wx.hideMenuItems({
      menuList: [params],
      success: function (res) {},
      fail: function (res) {
        alert(JSON.stringify(res))
      }
    })
  }
}

/**
 * 批量显示功能按钮接口
 * 入参说明：
 * 	{
 *	    menuList: [params] // 要显示的菜单项，只能隐藏“传播类”和“保护类”按钮
 *传播类
 *		发送给朋友: "menuItem:share:appMessage"
 *   	分享到朋友圈: "menuItem:share:timeline"
 *		分享到QQ: "menuItem:share:qq"
 *		分享到Weibo: "menuItem:share:weiboApp"
 *		收藏: "menuItem:favorite"
 *		分享到FB: "menuItem:share:facebook"
 *		分享到 QQ 空间/menuItem:share:QZone
 *保护类
 *		编辑标签: "menuItem:editTag"
 *		删除: "menuItem:delete"
 *		复制链接: "menuItem:copyUrl"
 *		原网页: "menuItem:originPage"
 *		阅读模式: "menuItem:readMode"
 *		在QQ浏览器中打开: "menuItem:openWithQQBrowser"
 *		在Safari中打开: "menuItem:openWithSafari"
 *		邮件: "menuItem:share:email"
 *		一些特殊公众号: "menuItem:share:brand"
 *	}
 */
let showMenuItems = function (params) {
  if (wx) {
    wx.showMenuItems({
      menuList: [params],
      success: function (res) {},
      fail: function (res) {
        alert(JSON.stringify(res))
      }
    })
  }
}

/**
 * 隐藏所有非基础按钮接口
 */
let hideAllNonBaseMenuItem = function (params) {
  if (wx) {
    wx.hideAllNonBaseMenuItem({
      success: function () {
        alert('已隐藏所有非基本菜单项')
      }
    })
  }
}

/**
 * 显示所有功能按钮接口
 */
let showAllNonBaseMenuItem = function (params) {
  if (wx) {
    wx.showAllNonBaseMenuItem({
      success: function () {
        alert('已显示所有非基本菜单项')
      }
    })
  }
}

export {
  closeWindowTab,
  hideAllNonBaseMenuItem,
  hideMenuItems,
  hideOptionMenu,
  showAllNonBaseMenuItem,
  showMenuItems,
  showOptionMenu
}
