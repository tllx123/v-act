import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'
let undefined
exports.initModule = function (sb) {
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  let widgetCode = args[0]
  if (widgetCode == undefined || widgetCode === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: 'ScrollToPosition函数，控件编码不能为空！'
    })
    throw exception
  }
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  if (widget) {
    let scopeId = widget.getScopeId()
    let containerId = windowRelation.getByScopeId(scopeId)
    let positionDom = widget.getClipHandle()
    //var topX = widget.getOffsetTop();
    //var leftY = widget.getOffsetLeft();
    let topX = $(positionDom).offset().top
    let leftY = $(positionDom).offset().left
    if (containerId) {
      let container = windowRelation.get(containerId)
      if (container.ele) {
        let scrollEle = container.ele
        let containerTop = $('#' + scrollEle).offset().top
        let containerLeft = $('#' + scrollEle).offset().left
        topX = topX - containerTop
        leftY = leftY - containerLeft
        $('#' + scrollEle).animate(
          {
            scrollTop: topX
          },
          0
        )
        $('#' + scrollEle).animate(
          {
            scrollLeft: leftY
          },
          0
        )
      } else {
        $('html, body').animate(
          {
            scrollTop: topX
          },
          0
        )
        $('html, body').animate(
          {
            scrollLeft: leftY
          },
          0
        )
      }
    } else {
      $('html, body').animate(
        {
          scrollTop: topX
        },
        0
      )
      $('html, body').animate(
        {
          scrollLeft: leftY
        },
        0
      )
    }
  }
}

export { main }
