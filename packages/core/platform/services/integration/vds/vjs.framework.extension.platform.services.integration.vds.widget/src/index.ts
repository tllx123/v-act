import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'
import {
  WidgetAction as widgetAction,
  WidgetProperty as widgetProperty
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

/**
 * 控件定义
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.widget.*")
 * @namespace vds/widget
 * @module widget
 * @catalog 基础定义/控件定义
 * @example
 * vds.import("vds.widget.*");
 * vds.widget.getStoreType("JGButton1");
 */
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

/**
 * 判断是否构件域
 * */
var _isComponentScope = function () {
  //先去掉校验，有构件方法中执行控件方法的场景Task20210809156
  return false
  //    	var isComponentScope = scopeManager.isComponentScope(scopeManager.getCurrentScopeId())
  //    	return isComponentScope;
}

/**
 * 控件存储类型
 * @enum {String}
 */
const StoreType = {
  /**
   * 集合数据存储类型
   */
  Set: 'set',
  /**
   * 单行数据存储类型
   */
  SingleRecord: 'singleRecord',
  /**
   * 单行数据存储类型
   */
  SingleRecordMultiValue: 'singleRecordMultiValue',
  /**
   * 多集合
   */
  MultiSet: 'multiSet',
  /**
   * 无数据存储类型
   */
  None: 'none'
}

export { StoreType }

/**
 * 根据数据源名称获取绑定的控件编号
 * @param {String} datasource 数据源编号
 * @param {String} fieldCode 字段编码，默认为空，不为空时，获取绑定数据源指定字段的控件（可选）
 * @returns Array
 * @example
 * vds.widget.getWidgetCodes("user");
 */
export function getWidgetCodes(datasource: string, fieldCode?: string) {
  //    	if(_isComponentScope()){
  //    		return [];
  //    	}
  var winScope = scopeManager.getWindowScope()
  var data = scopeManager.createScopeHandler({
    scopeId: winScope.getInstanceId(),
    handler: function () {
      if (!fieldCode) {
        return windowVMManager.getWidgetCodesByDatasourceName({
          datasourceName: datasource
        })
      } else {
        return windowVMManager.getWidgetCodesByFieldCode({
          datasourceName: datasource,
          fieldCode: fieldCode
        })
      }
    }
  })()
  return data
}

/**
 * 获取控件存储类型
 * @deprecated
 * @param {String} code 控件编号
 * @example
 * vds.widget.getStoreType("JGTextBox1");
 */
export function getStoreType(code: string) {
  //    	if(_isComponentScope()){
  //    		return null;
  //    	}
  return widgetContext.getStoreType(code)
}

/**
 * 设置控件属性
 * @param {String} widgetCode 控件编码
 * @param {String} propertyCode 属性编码
 * @param {Any} propertyValue 属性值
 * @example
 * vds.widget.setProperty("JGTextBox1", "ReadOnly", true);
 */
export function setProperty(
  widgetCode: string,
  propertyCode: string,
  propertyValue: any
) {
  //    	if(_isComponentScope()){
  //    		return;
  //    	}
  if (widgetCode && propertyCode) {
    widgetProperty.set(widgetCode, propertyCode, propertyValue)
  }
}

/**
 * 获取控件类型
 * @param {String} widgetCode 控件编码
 * @returns {String} 控件类型
 * @example
 * vds.widget.getType("JGTextBox1");//JGTextBox
 */
export function getType(widgetCode: string) {
  //    	if(_isComponentScope()){
  //    		return null;
  //    	}
  var type = widgetCode ? widgetContext.getType(widgetCode) : null
  return type
}

/**
 * 获取控件属性
 * @param {String} widgetCode 控件编码
 * @param {String} propertyCode 属性编码
 * @returns {Any} 属性值
 * @example
 * vds.widget.getProperty("JGTextBox1", "ReadOnly");//false
 */
export function getProperty(widgetCode: string, propertyCode: string) {
  //    	if(_isComponentScope()){
  //    		return null;
  //    	}
  var val =
    widgetCode && propertyCode
      ? widgetContext.get(widgetCode, propertyCode)
      : null
  return val
}

/**
 * 判断控件是否存在
 * @param {String} widgetCode 控件编码
 * @returns {Boolean} true: 控件存在 false:控件不存在
 * @example
 * vds.widget.exists("JGTextBox1");//true
 */
export function exists(widgetCode: string) {
  //    	if(_isComponentScope()){
  //    		return false;
  //    	}
  return widgetContext.isWidgetExist(widgetCode)
}

/**
 * 根据控件编码获取绑定的数据源编码
 * @param {String} widgetCode 控件编码
 * @returns {Array<String>} 数据源编码列表
 * @example
 * vds.widget.getDatasourceCodes("JGTextBox1");
 */
export function getDatasourceCodes(widgetCode: String) {
  //    	if(_isComponentScope()){
  //    		return [];
  //    	}
  var datasourceCodes = windowVMManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetCode
  })
  return datasourceCodes
}

/**
 * 获取控件绑定的字段列表
 * @param {String} datasourceCode 实体编码
 * @param {String} widgetCode 控件编码
 * @returns {Array<String>} 字段编码列表
 * @example
 * vds.widget.getFieldCodes("entityCode1","JGTextBox1");
 * */
export function getFieldCodes(datasourceCode: String, widgetCode: String) {
  //    	if(_isComponentScope()){
  //    		return [];
  //    	}
  var fieldCodes = windowVMManager.getFieldCodesByWidgetCode({
    datasourceName: datasourceCode,
    widgetCode: widgetCode
  })
  return fieldCodes
}

/**
 * 执行控件方法
 * @param {String} widgetCode 控件编码
 * @param {String} funCode 方法编码
 * @param {Array<Any>} params 参数列表
 * @returns {Any} 控件方法的返回值
 * @example
 * vds.widget.execute("JGTextBox1","setVisible",[false]);
 * */
export function execute(
  this: any,
  widgetCode?: any,
  funCode?: any,
  params?: any
) {
  //    	if(_isComponentScope()){
  //    		return;
  //    	}
  if (!widgetCode || !funCode) {
    return
  }
  var array: any = [widgetCode, funCode]
  if (params instanceof Array) {
    array = array.concat(params)
  }
  return widgetAction.executeWidgetAction.apply(this, array)
}
/**
 * 根据控件类型获取控件编码列表
 * @param {String} widgetType
 * @returns {Array<String>} 控件编码列表
 * @example
 * var codes = vds.widget.getWidgetCodesByType("code1");
 * */
export function getWidgetCodesByType(widgetType: string) {
  //    	if(_isComponentScope()){
  //    		return null;
  //    	}
  var result = []
  var windowScope = scopeManager.getWindowScope()
  var widgets = windowScope.getWidgets()
  if (widgets) {
    for (var code in widgets) {
      if (
        widgets.hasOwnProperty(code) &&
        widgets[code].type &&
        widgets[code].type == widgetType
      ) {
        result.push(code)
      }
    }
  }
  return result
}
/**
 * 判断是否有纵向滚动条
 * */
var hasScroll = function (element: HTMLElement) {
  if (!element) {
    return false
  }
  return element.scrollHeight > element.clientHeight
}
/**
 * 滚动到指定控件
 * @param {String} widgetCode
 * @example
 * vds.widget.scrollTo("JGDataGrid");
 * */
export function scrollTo(widgetCode: string) {
  var widget = widgetContext.get(widgetCode, 'widgetObj')
  if (widget) {
    var scopeId = widget.getScopeId()
    var containerId = windowRelation.getByScopeId(scopeId)
    var positionDom = widget.getClipHandle()
    //var topX = widget.getOffsetTop();
    //var leftY = widget.getOffsetLeft();
    var topX = $(positionDom).offset().top
    var leftY = $(positionDom).offset().left
    if (containerId) {
      var container = windowRelation.get(containerId)
      if (container.ele && hasScroll($('#' + container.ele)[0])) {
        //存在纵向滚动条时才能滚动
        var scrollEle = container.ele
        var containerTop = $('#' + scrollEle).offset().top
        var containerLeft = $('#' + scrollEle).offset().left
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
