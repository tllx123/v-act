import * as actionHandler from 'module'
import * as viewModel from 'module'
import * as routeManager from 'module'

let sandbox, fileUtil, ScopeManager, scopeContext, resourcePackage
export function initModule(sb) {
  if (sb) {
    sandbox = sb
    scopeContext = sb.getService(
      'vjs.framework.extension.ui.common.plugin.services.ScopeContext'
    )
    resourcePackage = sb.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    fileUtil = sb.getService('vjs.framework.extension.util.FileUtil')
    ScopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }
}

const menuEvent = function (
  currentScopeId: any,
  widget: any,
  items: any,
  handler: any
) {
  ScopeManager.openScope(currentScopeId)
  if (widget.menuTable && items) {
    let _id = returnEventId(items)
    let item = widget.menuTable[_id]
    if (item && item.isItem) {
      if (item['type'] == 0) {
        if (item.compCode && item.winCode) {
          openWindowHandler(widget, item)
        } else {
          throw new Error('构建名称和窗体名称不能为空')
        }
      } else if (item['type'] == 1) {
        //执行活动集
        if (item.ruleCompCode && item.ruleWinCode && item.ruleCode) {
          let _conCode = scopeContext.getComponentCode()
          let _winCode = scopeContext.getWindowCode()
          if (_conCode == item.ruleCompCode && _winCode == item.ruleWinCode) {
            let targetConfig: { [code: string]: any } = {}
            targetConfig['sourceType'] = 'client-ruleSet'
            targetConfig['invokeType'] = 'local'
            targetConfig['componentCode'] = item.ruleCompCode
            targetConfig['windowCode'] = item.ruleWinCode
            targetConfig['ruleSetCode'] = item.ruleCode

            let ruleParams = item.ruleParams
            let inputParam: { [code: string]: any } = {}
            if (ruleParams) {
              ruleParams = ruleParams.split('&')
              for (let i = 0; i < ruleParams.length; i++) {
                let param = ruleParams.split('=')
                inputParam[param[0]] = param[1]
              }
            }
            let config: { [code: string]: any } = {}
            config['instanceRefs'] = null
            config['currRouteRuntime'] = null
            config['callback'] = null
            routeManager.exeRuleSet(targetConfig, inputParam, config)
          } else {
            throw new Error('当前不支持跨构建和跨窗体执行活动集')
          }
        } else {
          throw new Error('构建名称和窗体名称不能为空')
        }
      } else {
        throw new Error('执行方法类型有问题')
      }
    }
  } else {
    //执行控件数据源事件
    handler.call(this, returnEventId(items))
  }
  ScopeManager.closeScope()
}

let openWindowHandler = function (widget: any, item: any) {
  try {
    let itemId = item.id
    let componentOpen = widget.ComponentOpenWay
    let title = item.name
    let compCode = item.compCode
    let winCode = item.winCode
    let componentVariable: { [code: string]: any } = {}
    let params = item['params']
    if (params) {
      params = params.split('&')
      for (let i = 0; i < params.length; i++) {
        let param = params.split('=')
        componentVariable[param[0]] = param[1]
      }
    }

    if ('NewWindow' == componentOpen) {
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      viewModel
        .getCmpModule()
        .callModuleEx(
          compCode,
          winCode,
          title,
          componentVariable,
          null,
          null,
          false,
          '_blank'
        )
    } else if ('SpecifiedWindow' == componentOpen) {
      let specifiedWindowName = title //specifiedWindowName == "" ? title : specifiedWindowName;
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      viewModel
        .getCmpModule()
        .callModuleEx(
          compCode,
          winCode,
          title,
          { inputParam: params },
          null,
          false,
          specifiedWindowName
        )
    } else if ('SpecifiedContainer' == componentOpen) {
      componentVariable['variable'] = {
        OrgEdgeTypeCode: 'systemOrg',
        formulaOpenMode: 'container',
        closeTabId: widget.ComponentContainer
      }
      componentVariable['variable']['formulaOpenMode'] = 'container'
      componentVariable.variable.closeTabId = widget.ComponentContainer
      if (
        actionHandler.executeWidgetAction(
          widget.ComponentContainer,
          'existByComponentId',
          {
            componentCode: compCode,
            windowCode: winCode,
            title: title,
            otherInfo: itemId
          }
        )
      ) {
        let seriesService = sandbox.getService(
          'vjs.framework.extension.ui.common.plugin.services.series.Series'
        )
        if (seriesService.getSeries() == 'bootstrap') {
          actionHandler.executeWidgetAction(
            widget.ComponentContainer,
            'activeByComponentId',
            compCode,
            winCode,
            title,
            itemId,
            componentVariable
          )
        } else {
          actionHandler.executeWidgetAction(
            widget.ComponentContainer,
            'reloadSingleTab',
            componentCode,
            winCode,
            title,
            itemId,
            viewModel
              .getCmpModule()
              .getModuleUrl(componentCode, componentVariable),
            false,
            true
          )
          actionHandler.executeWidgetAction(
            widget.ComponentContainer,
            'active',
            componentCode,
            windowCode,
            title,
            itemId
          )
        }
      } else
        actionHandler.executeWidgetAction(widget.ComponentContainer, 'add', {
          id: winCode,
          isComponent: true,
          otherInfo: itemId,
          title: title,
          componentCode: compCode,
          componentVariable: componentVariable
        })
    }
  } catch (e) {}
}

let returnEventId = function (items: any, handler: any) {
  let eventID = items
  if (items) {
    if (items.id) {
      eventID = items.id
    } else if (items.target && items.target.id) {
      eventID = items.target.id
    }
  }
  return eventID
}

/*
 * 数据格式处理
 * */
let _getImage = function (imageObjId: any) {
  return imageObjId == null || imageObjId == ''
    ? null
    : fileUtil.getImageByName(imageObjId)
}

//控制Table显示格式处理
let _genMenuItem = function (item: any) {
  let node: { [code: string]: any } = {}
  node.id = item['id']
  node.isSelected = item['isSelected']
  let lang = item['language']
  let langMenuItemName
  if (lang) {
    langMenuItemName = resourcePackage.getLanguageItem(lang)
  }
  node.title = langMenuItemName ? langMenuItemName : item['menuItemName']
  node.name = node.title
  node.icon = item['icon'] == '' ? null : _getImage(item['icon'])
  node.parentId = item['pid']
  if (item.submenu) {
    node.submenu = []
    for (let i = 0, len = item.submenu.length; i < len; i++) {
      node.submenu.push(_genMenuItem(item.submenu[i]))
    }
  }
  return node
}
//控制事件
let _genMenuTable = function (item: any) {
  let node: { [code: string]: any } = {}
  if (item['id']) {
    node.id = item['id']
  }
  if (item['isItem']) {
    node.isItem = item['isItem']
  }
  if (item['menuItemType']) {
    if (item['menuItemType'] === 'win') {
      node.type = 0
    } else if (item['menuItemType'] === 'rule') {
      node.type = 1
    } else {
      node.type = -1
    }
  }
  if (item['openCompCode']) {
    node.compCode = item['openCompCode']
  }
  if (item['openWinCode']) {
    node.winCode = item['openWinCode']
  }
  if (item['requestParams']) {
    node.params = item['requestParams']
  }
  if (item['ruleSetComponentCode']) {
    node.ruleCompCode = item['ruleSetComponentCode']
  }
  if (item['ruleSetWindowCode']) {
    node.ruleWinCode = item['ruleSetWindowCode']
  }
  if (item['ruleSetCode']) {
    node.ruleCode = item['ruleSetCode']
  }
  if (item['ruleSetInputParam']) {
    node.ruleParams = item['ruleSetInputParam']
  }
  return node
}
let _findParent = function (menuItems: any, item: any) {
  let parent = null
  let parentId = item.parentId
  if (menuItems) {
    for (let i = 0, len = menuItems.length; i < len; i++) {
      let node = menuItems[i]
      if (node.id == parentId) {
        parent = node
        break
      } else {
        if (node.submenu) _findParent(node.submenu, item)
      }
    }
  }
  return parent
}
let systemSort = function (array: any) {
  return array.sort(function (a: any, b: any) {
    return a.orderNo - b.orderNo
  })
}

const MenuData = function (items: any) {
  if (items.length == 0) {
    return
  } else {
    let item = items[0]
    if (
      !(
        item.hasOwnProperty('id') &&
        item.hasOwnProperty('pid') &&
        item.hasOwnProperty('menuItemName')
      )
    ) {
      throw new Error('菜单数据格式不正确')
      return
    }
  }
  items = systemSort(items)

  let nodes = []
  let menuTable: { [code: string]: any } = {}
  for (let i = 0, len = items.length; i < len; i++) {
    nodes.push(_genMenuItem(items[i]))
    menuTable[items[i].id] = _genMenuTable(items[i])
  }
  let menuItems = []
  for (let i = 0, len = nodes.length; i < len; i++) {
    let node = nodes[i]
    let parent = _findParent(nodes, node)
    if (parent == null) {
      menuItems.push(node)
    } else {
      if (!parent.submenu) {
        parent.submenu = []
      }
      parent.submenu.push(node)
    }
  }
  if (menuItems.length > 0 && menuItems[0].submenu) {
    return [menuItems[0].submenu, menuTable]
  } else {
    return
  }
}

export { menuEvent, MenuData }
