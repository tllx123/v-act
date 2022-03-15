import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let urlEnhancer: Function, cssProcessor: Function

const putUrlEnhancer = function (func: Function) {
  urlEnhancer = func
}

const getUrlEnHancer = function () {
  return urlEnhancer
}

const putCssProcessor = function (func: Function) {
  cssProcessor = func
}

const getCssProcessor = function () {
  return cssProcessor
}

let getCssAttrName = function () {
  return 'symbol'
}

const getCssAttrValue = function (widgetCode: string) {
  let scope = scopeManager.getScope()
  return (
    scope.getComponentCode() + '-' + scope.getWindowCode() + '-' + widgetCode
  )
}

const mountStyle = function (
  element: HTMLElement,
  params: Record<string, any>
) {
  let el = $(element)
  el.attr(getCssAttrName(), params.cssSymbol)
  return el[0]
}

const validate = function (
  vue: { widgets: any; vueInstance: any },
  entityCodes: Array<string>
) {
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
  getCssAttrName,
  getCssAttrValue,
  getCssProcessor,
  getUrlEnHancer,
  mountStyle,
  putCssProcessor,
  putUrlEnhancer,
  validate
}
