let modalHtml =
  '<div style="width:100%;height:100%;left:0;top:0;">' +
  '<div style="text-align:center;position:absolute;top:50%;-webkit-transform:translateY(-55%);transform:translateY(-55%);left:0;width:100%;">' +
  '<img src="itop/common/exception/handler/images/load-fail.gif" style="width:120px!important;height:120px!important;">' +
  '<section style="margin-top:25px;">' +
  '<span style="font-size:16px;color:#383838;line-height:1;">页面加载失败</span>' +
  '<p style="font-size:13px;color:#9e9e9e;line-height:1;padding-top:10px;">向右滑动页面，返回至上一页</p>' +
  '<a id="refresh" href="#" style="text-decoration:none;display:inline-block;heighr:36px;line-height:36px;border:1px solid #0199e5;color:#0199e5;width:115px;border-radius:3px;margin-top:15px;">刷新</a>' +
  '</section>' +
  '</div>' +
  '</div>'

let containerHtml =
  '<div style="width:100%;height:100%;left:0;top:0;" id="refresh">' +
  '<div style="text-align:center;position:absolute;top:50%;-webkit-transform:translateY(-55%);transform:translateY(-55%);left:0;width:100%;">' +
  '<img src="itop/common/exception/handler/images/reload.png" style="width:85px!important;height:85px!important;">' +
  '<section style="margin-top:15px;">' +
  '<span style="font-size:13px;color:#c7c7cc;line-height:1;">点击屏幕，重新加载</span>' +
  '</section>' +
  '</div>' +
  '</div>'

const handleDuringModal = function (params) {
  let el = $(modalHtml)
  let target = el.find('#refresh')
  _handle(params, el, target)
}

let _handle = function (params, el, target) {
  let parent = params.parentEl,
    reloadFunc = params.reload
  if (reloadFunc) {
    target.click(function () {
      reloadFunc()
    })
  }
  $(parent).html(el)
}

const handleDuringContainer = function (params) {
  let el = $(containerHtml)
  _handle(params, el, el)
}

export { handleDuringModal, handleDuringContainer }
