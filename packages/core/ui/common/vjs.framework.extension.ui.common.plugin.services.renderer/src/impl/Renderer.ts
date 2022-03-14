let sandbox:any
let seriesService:any
let widgetContext:any
let log:any
export function initModule(sb:any) {
  sandbox = sb
  if (sb) {
    log = sb.getService('vjs.framework.extension.util.log')
    seriesService = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.series.Series'
    )
    widgetContext = sandbox.getService(
      'vjs.framework.extension.widget.manager.widgetContext'
    )
  }
}

/**
 * 执行控件的渲染方法
 */
let executeComponentAction = function (funcName:string) {
  let type = seriesService.getSeries()
  let JGComponentHandler = sandbox.getService(
    'vjs.framework.extension.ui.plugin.JGComponent.render.JGComponent',
    { type: type }
  )
  let func = JGComponentHandler[funcName]
  if (Object.prototype.toString.call(func) === '[object Function]') {
    let params = []
    if (arguments.length > 1) {
      for (let i = 1, len = arguments.length; i < len; i++) {
        params.push(arguments[i])
      }
    }
    return func.apply(func, params)
  } else {
    log.error('执行' + type + '组件渲染方法：' + funcName + '出错！')
  }
}

/**
 * 执行控件渲染动作
 */
let executeWidgetAction = function (widgetCode:string, funcName:string) {
  let widgetType = widgetContext.get(widgetCode, 'type')
  let type = seriesService.getSeries()
  let widgetHandler = sandbox.getService(
    'vjs.framework.extension.ui.plugin.' + widgetType + '.render.' + widgetType,
    { type: type }
  )
  let func = widgetHandler[funcName]
  try {
    let params = [widgetCode]
    if (arguments.length > 2) {
      for (let i = 2, len = arguments.length; i < len; i++) {
        params.push(arguments[i])
      }
    }
    return func.apply(func, params)
  } catch (e) {
    log.error(
      '当前控件：' +
        widgetType +
        ',渲染可能存在问题，参考信息如下：</br>' +
        '资源文件：' +
        widgetType +
        '.js,</br>' +
        '方法：' +
        funcName +
        ',</br>' +
        'widgetCode：' +
        widgetCode +
        ',</br>' +
        // +"参数信息为："+paramsInfo+",</br>"
        '异常信息为:' +
        e.message
    )
    throw e
  }
}

export { executeWidgetAction, executeComponentAction }
