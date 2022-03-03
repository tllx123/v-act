import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let urlEnhancer, cssProcessor

exports.initModule = function (sb) {}

const putUrlEnhancer = function (func) {
  urlEnhancer = func
}

const getUrlEnHancer = function () {
  return urlEnhancer
}

const putCssProcessor = function (func) {
  cssProcessor = func
}

const getCssProcessor = function () {
  return cssProcessor
}

let getCssAttrName = function () {
  return 'symbol'
}

const getCssAttrValue = function (widgetCode) {
  let scope = scopeManager.getScope()
  return (
    scope.getComponentCode() + '-' + scope.getWindowCode() + '-' + widgetCode
  )
}

const mountStyle = function (element, params) {
  let el = $(element)
  el.attr(getCssAttrName(), params.cssSymbol)
  return el[0]
}

const validate = function (vue, entityCodes) {
  let widgets = vue.widgets
  if (widgets && widgets.length > 0) {
    let formIds = []
    let vueComponent = vue.vueInstance
    if (vueComponent.$children && vueComponent.$children.length > 0) {
      vueComponent = vueComponent.$children[0]
    }
    for (let i = 0, len = widgets.length; i < len; i++) {
      let widget = widgets[i]
      if (
        widget &&
        widget.vModelEntityName &&
        entityCodes.indexOf(widget.vModelEntityName) != -1 &&
        widget.formId
      ) {
        let fId = widget.formId
        if (formIds.indexOf(fId) == -1) {
          formIds.push(fId)
        }
      }
    }
    let len = formIds.length
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        let refFunc = vueComponent.$refs[formIds[i]]
        if (refFunc && typeof refFunc.validate == 'function') {
          refFunc.validate()
        } else {
          if (window.console) {
            console.warn('暂无法校验表单,表单标识：' + formIds[i])
          }
        }
      }
    }
  }
}

export {
  putUrlEnhancer,
  getUrlEnHancer,
  putCssProcessor,
  getCssProcessor,
  getCssAttrName,
  getCssAttrValue,
  mountStyle,
  validate
}
