import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { resourcepackage as resourcePackage } from '@v-act/vjs.framework.extension.ui.adapter'
import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.util.file'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let sandbox, widgetAction, routeEngine, browser, remoteMethodAccessor

export function initModule(sb) {
  sandbox = sb
}
let menuEvent = function (currentScopeId, widget, items, handler, cbFunc) {
  // 处理回调函数未初始化
  if (!cbFunc || typeof cbFunc !== 'function') cbFunc = function () {}

  scopeManager.openScope(currentScopeId)
  let _id = returnEventId(items)
  if (widget.menuTable && items) {
    let item = widget.menuTable[_id]
    if (item && item.isItem) {
      let menuAction = sandbox.getService(
        'vjs.framework.extension.platform.services.view.widget.common.logic.menu.action',
        {
          type: item['type']
        }
      )
      if (null != menuAction) {
        menuAction.doAction({
          properties: widget,
          data: item,
          callback: cbFunc
        })
      } else {
        cbFunc()
        throw new Error('没有合适的菜单类型处理器. 菜单类型：' + item['type'])
      }
    } else cbFunc()
  } else {
    // 执行控件数据源事件
    handler.call(this, _id)
  }
  scopeManager.closeScope()
}

let returnEventId = function (items, handler) {
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
 */
let _getImage = function (imageObjId) {
  return imageObjId == null || imageObjId == ''
    ? null
    : fileUtil.getImageByName(imageObjId)
}

// 控制Table显示格式处理
let _genMenuItem = function (item, ctype) {
  let node = {}
  node.id = item['id']
  let lang = item['language']
  let langMenuItemName
  if (lang) {
    langMenuItemName = resourcePackage.getLanguageItem(lang)
  }
  node.title = langMenuItemName ? langMenuItemName : item['menuItemName']
  node.name = node.title
  node.isSelected = item['isSelected']

  if (item['icourl']) {
    let imgJson = jsonUtil.json2obj(item['icourl'])
    if (imgJson) {
      for (let i = 0, num = imgJson.length; i < num; i++) {
        let imgobj = imgJson[i]

        if (imgobj && imgobj['type'] == ctype) {
          node.source = imgobj['source']
        }

        if (
          imgobj &&
          imgobj['source'] == 'db' &&
          (imgobj['type'] == ctype || ctype == undefined)
        ) {
          node.icon =
            'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
            imgobj.img +
            '%22%2C%22ImageObj%22%3A%22' +
            imgobj.img +
            '%22%7D%7D'
          node.iconSource = imgobj.source
        } else if (
          imgobj &&
          imgobj['source'] == 'url' &&
          (imgobj['type'] == ctype || ctype == undefined)
        ) {
          node.icon = imgobj.img
          node.iconSource = imgobj.source
        } else if (
          imgobj &&
          imgobj['source'] == 'res' &&
          (imgobj['type'] == ctype || ctype == undefined)
        ) {
          node.icon = '/itop/resources/' + imgobj.img
          node.iconSource = imgobj.source
        } else if (
          imgobj &&
          imgobj['source'] == 'icon' &&
          (imgobj['type'] == ctype || ctype == undefined)
        ) {
          node.icon = imgobj.img
          node.iconSource = imgobj.source
        }
      }
    }
  }
  node.code = item['menuItemCode']
  //node.icon = (item["icon"]) == "" ? null : _getImage(item["icon"]);
  node.parentId = item['pid']
  if (item.submenu) {
    node.submenu = []
    for (let i = 0, len = item.submenu.length; i < len; i++) {
      node.submenu.push(_genMenuItem(item.submenu[i]))
    }
  }
  return node
}

// 控制事件
let _genMenuTable = function (item) {
  let node = {}
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
      node.type = item['menuItemType']
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
  if (item['title'] || item['menuItemName']) {
    node.title = item['title'] ? item['title'] : item['menuItemName']
  }
  return node
}

let _findParent = function (menuItems, item) {
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

let systemSort = function (array) {
  return array.sort(function (a, b) {
    return a.orderNo - b.orderNo
  })
}

let MenuData = function (items, ctype) {
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
  let menuTable = {}
  for (let i = 0, len = items.length; i < len; i++) {
    nodes.push(_genMenuItem(items[i], ctype))
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
  } else if (menuItems.length > 0) {
    // 处理按钮组控件特殊情况
    return [menuItems, menuTable]
  } else return
}

export { getMenuDataByRuleSet, MenuData, menuEvent }
