/**
 *  滚动页面到指定控件所在位置
    代码示例：ScrollToPosition("JGDataGrid1")
    参数1：控件编码，必填(字符串类型)
    无返回值
 *
 */
import $ from 'jquery'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, widget,object }

const main = function (widgetCode:string) {
  //获取函数传入的参数
  if (vds.object.isUndefOrNull(widgetCode)) {
    const exception = vds.exception.newConfigException(
      'ScrollToPosition函数，控件编码不能为空！'
    )
    throw exception
  }

  var widget = vds.widget.getProperty(widgetCode, 'widgetObj')
  if (widget) {
    const scopeId = widget.getScopeId()
    const containerId = vds.widget.scrollTo(scopeId)
    const positionDom = widget.getClipHandle()
    //var topX = widget.getOffsetTop();
    //var leftY = widget.getOffsetLeft();
    let topX = $(positionDom).offset().top
    let leftY = $(positionDom).offset().left
    if (vds.object.isUndefOrNull(containerId)) {
      var container = vds.widget.scrollTo(containerId)
      if (container.ele) {
        const scrollEle = container.ele
        const containerTop = $('#' + scrollEle).offset().top
        const containerLeft = $('#' + scrollEle).offset().left
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
