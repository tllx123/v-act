import * as Record from 'module'
import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.util'
import * as propertyHandler from 'module'
import * as actionHandler from 'module'
import * as viewContext from 'module'
import * as formulaUtil from 'module'
import * as viewModel from 'module'
import * as metaModule from 'module'
import * as dbManager from 'module'
let undefined

exports.initModule = function (sBox) {}
/**
 *普通树数据转化
 * 转换类容：
 * 将是否是叶子节点转换成是否是节点
 */
let translate = function (widgetId, datas, isCover) {
  if (datas && datas.length > 0) {
    let properties = _getPropertyMap(widgetId)
    let value = propertyHandler.getProperty(widgetId, 'RealizeWay')
    if (value == '父子节点') {
      datas = translateByParentType(widgetId, properties, datas, isCover)
    } else if (value == '左右编码') {
      datas = translateByLRCodeType(widgetId, properties, datas, isCover)
    } else if (value == '业务编码') {
      datas = translateByBizCodeType(widgetId, properties, datas, isCover)
    } else {
      throw new Error('不支持的树类型！')
    }
    return datas
  }
  return null
}
/**
 *父子节点实现方式
 */
let translateByParentType = function (widgetId, properties, datas, isCover) {
  let nodeMap = {}
  let parentField = properties.parentField
  let openProperty = properties.openProperty
  let leafField = properties.leafField
  let folderProperty = properties.folderProperty
  let treeDataPid = properties.treeDataPid
  let treeIcons = properties.treeIcons
  let openIcon = properties.openIcon
  let closeIcon = properties.closeIcon
  let iconProperty = properties.iconProperty
  let tmpLeafField, tmpParentField
  for (let i = 0, len = datas.length; i < len; i++) {
    let data = datas[i]
    if (Record.isInstanceOf(data)) {
      data = data.toMap()
      datas[i] = data
    }
    nodeMap[data.id] = data
    //默认折叠
    if (isCover === true) {
      data[openProperty] = false
    }
    if (leafField != undefined) {
      tmpLeafField = _getPropertyIgnoreCase(data, leafField)
      if (tmpLeafField != undefined && data.hasOwnProperty(tmpLeafField)) {
        let isFolder = false
        // 0 是 false, 1 是 true
        // 如果数据是从前台实体来，则 leafField 可能为 null/空/true
        let isLeafField = data[tmpLeafField]
        let isFolderType = typeof isLeafField

        if (isFolderType === 'boolean') isFolder = !isLeafField
        else if (isFolderType === 'string') {
          if (isLeafField == 'false' || isLeafField == '') isFolder = true
        }

        data[folderProperty] = isFolder
      }
    }
    if (parentField != undefined) {
      tmpParentField = _getPropertyIgnoreCase(data, parentField)

      if (tmpParentField != undefined && data.hasOwnProperty(tmpParentField)) {
        let parentId = data[tmpParentField]
        data[treeDataPid] = parentId
      }
    }
    if (treeIcons) {
      let dsName = metaModule.getDataSourceName(widgetId)
      _setTreeNodeIcon(
        data,
        treeIcons,
        openIcon,
        closeIcon,
        iconProperty,
        dsName
      )
    }
  }

  let childArray = []
  let parentArray = []
  for (let i = 0, len = datas.length; i < len; i++) {
    let node = datas[i]
    let nodeId = node.id
    let parent = nodeMap[node[treeDataPid]]
    let ancestor = []
    while (parent != null) {
      ancestor.push(parent)
      parent[openProperty] = true
      let openIconVal = parent[openIcon]
      if (openIconVal) {
        //设置打开节点图片
        parent[iconProperty] = openIconVal
      }
      delete nodeMap[parent.id]
      parent = nodeMap[parent[treeDataPid]]
    }
    if (ancestor.length > 0) {
      parentArray = parentArray.concat(ancestor.reverse())
    }
    if (nodeMap[nodeId]) {
      childArray.push(node)
    }
  }
  return parentArray.concat(childArray)
}

/**
 *左右编码实现方式
 */
let translateByLRCodeType = function (widgetId, properties, datas, isCover) {
  return translateByParentType(widgetId, properties, datas, isCover)
}
/**
 *业务编码实现方式
 */
let translateByBizCodeType = function (widgetId, properties, datas, isCover) {
  let businessCodeRefField = getBusinessCodeRefField(widgetId)
  let bizCodeMap = {}
  let parentHashMap = {}
  let businessCodeList = []
  let businessCodeCfg = _getBusinessCodeFormat(widgetId)
  for (let i = 0, len = datas.length; i < len; i++) {
    let data = datas[i]
    if (Record.isInstanceOf(data)) {
      data = data.toMap()
      datas[i] = data
    }
    //if(isCover !== false){//数据覆盖形式下设置节点默认属性
    //出于性能考虑，编码树所有节点都是父节点
    data[properties.folderProperty] = true
    //如果为父节点，默认折叠
    data[properties.openProperty] = false
    //}
    if (properties.treeIcons) {
      let dsName = metaModule.getDataSourceName(widgetId)
      _setTreeNodeIcon(
        data,
        properties.treeIcons,
        properties.openIcon,
        properties.closeIcon,
        properties.iconProperty,
        dsName
      )
    }
    let businessCode = data[businessCodeRefField]
    bizCodeMap[businessCode] = data
    //这里是为了保存原来的排序顺序
    businessCodeList.push(businessCode)
    let parentCode = _getParentBusinessCode(businessCodeCfg, businessCode)
    parentHashMap[businessCode] = parentCode
  }
  let needToResetParent = isCover === false ? {} : null
  for (let i = 0, len = businessCodeList.length; i < len; i++) {
    let businessCode = businessCodeList[i]
    let parentCode = parentHashMap[businessCode]
    let parent = bizCodeMap[parentCode]
    if (parent) {
      let data = bizCodeMap[businessCode]
      data[properties.treeDataPid] = parent.id
      //有子节点时，父节点默认打开
      parent[properties.openProperty] = true
      if (parent[properties.openIcon]) {
        //设置打开节点图片
        parent[properties.iconProperty] = parent[properties.openIcon]
      }
    } else if (isCover === false) {
      let children = needToResetParent[parentCode]
      if (!children) {
        children = []
        needToResetParent[parentCode] = children
      }
      children.push(bizCodeMap[businessCode])
    }
  }
  if (isCover === false) {
    //如果为增量添加数据，则可能有些节点的parentId需要从现有的数据中查找
    let treeData = actionHandler.executeWidgetAction(widgetId, 'getTreeData')
    for (let parentCode in needToResetParent) {
      let parent = treeData.find(businessCodeRefField, parentCode)
      if (!parent) {
        continue
      }
      let children = needToResetParent[parentCode]
      for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i]
        child[properties.treeDataPid] = parent.id
      }
    }
  }
  return datas
}

/**
 * 获取编码字段
 * @param {Object} widgetId
 */
let getBusinessCodeRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_CodeColumn')
  if (obj) {
    ret = obj.refField
  }
  return ret
}

let _getPropertyMap = function (widgetId) {
  let widget = viewContext.getRuntimeWidgetObjFromContext(widgetId)
  let properties = {}
  properties.folderProperty = widget.getfolderProperty()
  properties.leafField = widget.getLeafField()
  properties.openProperty = widget.getOpenProperty()
  properties.closeIcon = widget.getCloseIconProperty()
  properties.openIcon = widget.getOpenIconProperty()
  properties.treeDataPid = widget.getInnerTreeParentField()
  properties.parentField = widget.getParentField()
  properties.treeIcons = formulaUtil.evalExpression(
    'GenerateTreeIcon("' + widgetId + '")'
  )
  properties.iconProperty = widget.getIconProperty()
  return properties
}

let _setTreeNodeIcon = function (
  data,
  treeIcons,
  openIcon,
  closeIcon,
  iconProperty,
  dsName
) {
  // 新版属性，支持表达式条件
  if (undefined != treeIcons.jsonVersion && '1.0' == treeIcons.jsonVersion) {
    if (treeIcons.conditionType == '0') {
      if (undefined != treeIcons.iconCol && '' != treeIcons.iconCol) {
        data[closeIcon] = getImageByName(treeIcons.iconCol)
        data[iconProperty] = getImageByName(treeIcons.iconCol)
      }
      if (undefined != treeIcons.iconExp && '' != treeIcons.iconExp) {
        data[openIcon] = getImageByName(treeIcons.iconExp)
      }
    } else if (treeIcons.conditionType == '1') {
      let scenes = treeIcons.scenes
      for (let i = 0; i < scenes.length; i++) {
        let scene = scenes[i]
        let expressionData = {
          dataSourceConfig: {
            recordIndexInfo: {}
          }
        }
        expressionData['dataSourceConfig']['recordIndexInfo'][dsName] =
          data['id']
        let exp = scene.conditions
        // 如果无条件，则直接通过
        if (undefined == exp || null == exp || '' == exp) {
          exp = true
        } else {
          exp = formulaUtil.evalExpression(exp, expressionData)
        }
        if (exp == true) {
          if (
            undefined != scene.iconExp &&
            null != scene.iconExp &&
            '' != scene.iconExp
          ) {
            data[openIcon] = getImageByName(scene.iconExp)
          }
          if (
            undefined != scene.iconCol &&
            null != scene.iconCol &&
            '' != scene.iconCol
          ) {
            data[closeIcon] = getImageByName(scene.iconCol)
            data[iconProperty] = getImageByName(scene.iconCol)
          }
          break
        }
      }
    }
  }
  // 兼容旧版属性，只支持字段 == 值
  else {
    let treeIconField = treeIcons['fieldName']
    let config = treeIcons['config']
    let treeIconFieldValue =
      data[treeIconField] == null ? '' : data[treeIconField].toString()
    if (config[treeIconFieldValue]) {
      let treeNodeIcon = config[treeIconFieldValue]
      //收起的图标
      if (treeNodeIcon['ImgName']) {
        data[closeIcon] = getImageByName(treeNodeIcon['ImgName'])
        //默认收起图标
        data[iconProperty] = data[closeIcon]
      }
      //展开的图标
      if (treeNodeIcon['ExpandImgName']) {
        data[openIcon] = getImageByName(treeNodeIcon['ExpandImgName'])
      } else if (treeNodeIcon['ImgID']) {
        //如果没有设置展开的图标,则设置二个图标一样
        data[openIcon] = data[closeIcon]
      }
    }
  }
}

let getImageByName = function (imageName) {
  let componentCode = viewContext.getComponentCode()
  return fileUtil.getImageByName(componentCode + '_' + imageName)
}
/**
 *获取父节点业务编码
 */
let _getParentBusinessCode = function (businessCodeCfg, businessCode) {
  if (businessCode === null || typeof businessCode == 'undefined') {
    return null
  }
  let len = businessCode.length
  let index = 0
  let parentCodelen = 0
  do {
    var length = businessCodeCfg[index]
    if (isNaN(length)) {
      length = businessCodeCfg[index - 1]
    } else {
      index++
    }
    length = parseInt(length)
    if (parentCodelen + length < len) {
      parentCodelen += length
    } else {
      break
    }
  } while (true)
  return businessCode.substring(0, parentCodelen)
}

/**
 *获取层级码配置信息
 */
let _getBusinessCodeFormat = function (widgetId) {
  let gridProperties = viewContext.getWidgetPropertyFromContext(widgetId)
  let value = gridProperties['CodeFormat']
  if (!value) {
    return null
  }
  if (typeof value != 'string') {
    value = new String(value)
  }
  let reg = /^[1-9]+\d*\s*([\,]{1}\s*[1-9]+\d*)*([\,]{1}\s*\*{1}\s*)?$/
  let isLegal = reg.test(value)
  if (!isLegal) {
    throw new Error(
      '编码格式配置不合法，标准的格式类似于: [2，2，3，*]、或[2, 3]、或[2]的格式。'
    )
  }
  value = value.replace(/\s*/g, '')
  return value.split(',')
}

let _getPropertyIgnoreCase = function (obj, property) {
  for (p in obj) {
    if (p.toUpperCase() == property.toUpperCase()) return p
  }
  return null
}

export { getInstance, getInstance, Enum_MoveTo, destroy, translate }
