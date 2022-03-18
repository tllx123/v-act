import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

const doAction = function (params: any) {
  let item = params.data
  let widget = params.properties
  let cbFunc = params.callback
  if (item.compCode && item.winCode) {
    openWindowHandler(widget, item, cbFunc)
  } else {
    cbFunc()
    throw new Error('构建名称和窗体名称不能为空')
  }
}

let openWindowHandler = function (widget: any, item: any, cbFunc: any) {
  try {
    let itemId = item.id
    let componentOpen = widget.ComponentOpenWay
    let title = item.title
    let compCode = item.compCode
    let winCode = item.winCode
    let componentParams = {}
    let params = item['params']
    if (params) {
      params = params.split('&')
      for (let i = 0; i < params.length; i++) {
        let param = params[i].split('=')
        componentParams[param[0]] = param[1]
      }
    }

    let componentVariable = {}
    if ('NewWindow' == componentOpen) {
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      for (let key in componentParams) {
        componentVariable['variable'][key] = componentParams[key]
      }
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      browser.callModuleEx({
        componentCode: compCode,
        windowCode: winCode,
        operation: compCode,
        title: title,
        inputParam: componentVariable,
        width: null,
        height: null,
        isBlock: false,
        winName: '_blank'
      })
      cbFunc()
    } else if ('SpecifiedWindow' == componentOpen) {
      let specifiedWindowName = title
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      for (let key in componentParams) {
        componentVariable['variable'][key] = componentParams[key]
      }
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      browser.callModuleEx({
        componentCode: compCode,
        windowCode: winCode,
        operation: compCode,
        title: title,
        inputParam: componentVariable,
        width: null,
        height: null,
        isBlock: false,
        winName: specifiedWindowName
      })
      cbFunc()
    } else if ('SpecifiedContainer' == componentOpen) {
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      componentVariable['variable']['formulaOpenMode'] = 'container'
      componentVariable['variable']['closeTabId'] = widget.ComponentContainer
      for (let key in componentParams) {
        componentVariable['variable'][key] = componentParams[key]
      }
      let containerId = widgetAction.executeWidgetAction(
        widget.ComponentContainer,
        'getContainerIdByInfo',
        {
          componentCode: compCode,
          windowCode: winCode,
          title: title,
          otherInfo: ''
        }
      )
      if (containerId) {
        let seriesService = sandbox.getService(
          'vjs.framework.extension.ui.common.plugin.services.series.Series'
        )
        if (seriesService.getSeries() == 'bootstrap') {
          widgetAction.executeWidgetAction(
            widget.ComponentContainer,
            'activeByComponentId',
            compCode,
            winCode,
            title,
            '',
            componentVariable,
            {
              containerId: containerId,
              cbFunc: cbFunc
            }
          )
        } else {
          let moduleUrl = browser.getWindowUrl({
            windowCode: winCode,
            inputParams: componentVariable
          })
          // widgetAction.executeWidgetAction(widget.ComponentContainer, "reloadSingleTab", componentCode, winCode, title, "", moduleUrl, false, true);
          // widgetAction.executeWidgetAction(widget.ComponentContainer, "active", componentCode, windowCode, title, itemId);

          widgetAction.executeWidgetAction(
            widget.ComponentContainer,
            'reloadSingleTab',
            compCode,
            winCode,
            title,
            '',
            moduleUrl,
            false,
            true
          )
          widgetAction.executeWidgetAction(
            widget.ComponentContainer,
            'active',
            compCode,
            winCode,
            title,
            '',
            { containerId: containerId },
            cbFunc
          )
        }
      } else {
        widgetAction.executeWidgetAction(widget.ComponentContainer, 'add', {
          id: winCode,
          isComponent: true,
          otherInfo: '',
          title: title,
          componentCode: compCode,
          componentVariable: componentVariable,
          cbFunc: cbFunc
        })
      }
    } else if ('DialogWindow' == componentOpen) {
      //增加DialogWindow(对话框窗体)打开方式
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      for (let key in componentParams) {
        componentVariable['variable'][key] = componentParams[key]
      }
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      browser.showModalModule({
        componentCode: compCode,
        windowCode: winCode,
        operation: compCode,
        title: title,
        inputParam: componentVariable
      })
      cbFunc()
    }
  } catch (e) {
    cbFunc()
  }
}
export { doAction }
