let sandbox
let viewModel
let formulaUtil

exports.initModule = function (sb) {
  sandbox = sb
}

/**
 * 设置控件使能
 */
let setEnabled = function (widgetId, state) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  widget.setEnabled(state)
}
/**
 * 获取控件的使能值
 */
let getEnabled = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  return !widget.isDisabled()
}
/**
 * 设置控件是否可见
 */
let setVisible = function (widgetId, state) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  widget.setVisible(state)
}
/**
 * 获取控件的可见性
 */
let getVisible = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  return widget.isVisible()
}
/**
 * 设置是否只读
 */
let setReadOnly = function (widgetId, state) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  widget.setReadOnly(state)
}
/**
 * 获取是否只读
 */
let getReadOnly = function (widgetId) {
  let widgetContext = sandbox.getService(
    'vjs.framework.extension.widget.manager.widgetContext'
  )
  let widget = widgetContext.get(widgetId, 'widgetObj')
  return widget.isReadOnly()
}

export {
  setEnabled,
  getEnabled,
  setVisible,
  getVisible,
  setReadOnly,
  getReadOnly
}
