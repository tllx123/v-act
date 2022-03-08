/**
 * @namespace FormTitleProcessor
 * @module FormTitleProcessor
 * @desc 表单标题属性处理器<br/>
 * vjs名称：vjs.framework.extension.platform.implements.view.window.widget.property.processor.formtitle<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.view.window.widget.property.processor<br/>
 * @author liangzc
 * */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { widgetModule as widgetModule } from '@v-act/vjs.framework.extension.widget.manager'
var maxTitleCount //最大标题字数@
var titleCharWidth //单个字宽度
var maxTitleWidth //最大标题宽度
var formItemMaxTitleSpace = 24 //抽提字间隔
var tempSpan //

/**
 * 表单标题属性处理
 * @param	{Object}	params
 * {
 * 	'Dynamic':false//ture    false是初始化调用，true表示动态修改标题
 * 	'title':''//修改的biaoti
 * }
 * */
export function process(params) {
  var widgets = scopeManager.getWindowScope().getWidgets()
  if (widgets && initConfig()) {
    var maxLength = 0
    var formWidgets = {}
    var maxLengths = {
      TitleWidth: 0,
      ItemLabelWidth: 0
    }
    for (widgetCode in widgets) {
      var widget = widgets[widgetCode]
      var isHandle = false
      var titleWidth = 'TitleWidth'
      switch (widget.type) {
        case 'JGQueryConditionPanel':
          titleWidth = 'ItemLabelWidth'
        case 'JGFormLayout':
          if (!formWidgets[titleWidth]) {
            formWidgets[titleWidth] = []
          }
          var tw = widget[titleWidth]
          var isHandle = false
          if (tw != 'auto' && typeof tw == 'string') {
            try {
              tw = parseInt(tw)
              if (!isNaN(tw) && typeof tw == 'number') {
                widget[titleWidth] = tw
                isHandle = true
              }
            } catch (e) {}
          }
          if (!isHandle) {
            var initor = widgetModule.get(widget.type)
            if (!initor) continue
            var titleLen
            if (initor.isNewDevelopMode && initor.isNewDevelopMode()) {
              titleLen = isc[widget.type].getMaxTitleLength({
                calculateLength: calculateTitleLength,
                property: widget
              })
            } else {
              titleLen = initor.getMaxTitleLength({
                calculateLength: calculateTitleLength,
                property: widget
              })
            }

            if (titleLen > maxLengths[titleWidth]) {
              maxLengths[titleWidth] = titleLen
            }
            formWidgets[titleWidth].push(widget)
          }
          break
      }
    }
    for (var key in formWidgets) {
      var fws = formWidgets[key]
      for (var i = 0, len = fws.length; i < len; i++) {
        fws[i].fixedColWidths = true
        fws[i][key] = maxLengths[key]
      }
    }
  }
  clearTempSpan()
  var dtd = $.Deferred()
  setTimeout(function () {
    dtd.resolve()
  }, 1)
  return dtd
}
/**
 * 初始化配置信息
 * */
var initConfig = function () {
  if (window.v3PlatformSCSkin) {
    if (null != v3PlatformSCSkin.formItemMaxTitleSpace) {
      formItemMaxTitleSpace = v3PlatformSCSkin.formItemMaxTitleSpace
    }
  }
  if (isc && isc.V3Platform && isc.V3Platform.Form) {
    maxTitleCount = isc.V3Platform.Form.MaxTitleCount
    titleCharWidth = isc.V3Platform.Form.TitleCharWidth
  }
  if (maxTitleCount && titleCharWidth) {
    maxTitleWidth = maxTitleCount * titleCharWidth
    return true
  }
  return false
}
var clearTempSpan = function () {
  if (tempSpan) {
    try {
      tempSpan.remove()
    } catch (e) {}
  }
  tempSpan = undefined
}
/**
 * 计算标题长度
 * @param	{String}	title	标题
 * @return	{Number}	标题长度
 * */
var calculateTitleLength = function (title) {
  if (!tempSpan) {
    var tempSpanIden = 'v_tmp_' + new Date().getTime()
    //$("body").append('<span id='+tempSpanIden+' style="white-space:nowrap;position:fixed;opacity:0;top:-50px;left:0;"></span>');
    $('body').append(
      '<span id=' + tempSpanIden + ' class="v3FormItemTitleRuler"></span>'
    )
    tempSpan = $('#' + tempSpanIden)
  }
  tempSpan.html(title)
  var targetWidth = tempSpan.width() + formItemMaxTitleSpace
  if (targetWidth > maxTitleWidth) {
    return maxTitleWidth
  }
  return targetWidth
}
