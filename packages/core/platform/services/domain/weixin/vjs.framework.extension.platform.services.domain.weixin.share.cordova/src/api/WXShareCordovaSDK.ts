//@ts-nocheck
/**
 * 初始化微信分享插件
 * @useage
 * 分享给朋友
 * window.VJSBridge.plugins.weixin.Share.onMenuShareAppMessage({
        title: '', // 分享标题
        desc: '', // 分享描述
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
 * @useage
 * 分享到朋友圈
 * window.VJSBridge.plugins.weixin.Share.onMenuShareTimeline({
        title: '', // 分享标题
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
*/
if (window.VJSBridge && window.VJSBridge.plugins.weixin) {
  window.VJSBridge.plugins.weixin.Share = navigator.sharetowx
}
