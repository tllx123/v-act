import { Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as expEngine
} from '@v-act/vjs.framework.extension.platform.services.engine'
import {
  WidgetAction as widgetAction,
  WidgetProperty as widgetProperty
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.util.file'

/**
 * 二维数据转换成树形结构数据
 * @param {String} widgetCode 控件编号
 * @param {Array<Object>} datas 二维数据
 * @param {Boolean} isCover 是否已覆盖方式
 */
let translate = function (widgetId: any, datas: any[], isCover: any) {
  if (datas && datas.length > 0) {
    let properties = _getPropertyMap(widgetId)
    let value = widgetProperty.get(widgetId, 'RealizeWay')
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
let translateByParentType = function (
  widgetId: any,
  properties: Record<string, any>,
  datas: any[],
  isCover: boolean
) {
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
  let tmpLeafField: any = ''
  let tmpParentField: any = ''
  //子节点数据
  let leafNodes = {}
  //必须是父节点的
  let parentNodes = {}
  for (let i = 0, len = datas.length; i < len; i++) {
    let data = datas[i]
    if (data instanceof Record) {
      data = data.toMap()
      datas[i] = data
    }
    let dataId = data.id
    if (parentNodes.hasOwnProperty(dataId)) {
      //如果包含，则表示之前遍历过子节点
      if (parentNodes[dataId] == null) parentNodes[dataId] = data
    } else {
      //如果不确定，先都作为子节点
      leafNodes[dataId] = data
    }
    let checkLeafField = false
    if (leafField != undefined) {
      tmpLeafField = _getPropertyIgnoreCase(data, leafField)
      if (tmpLeafField != undefined && data.hasOwnProperty(tmpLeafField)) {
        checkLeafField = true
      }
    }
    if (parentField != undefined) {
      tmpParentField = _getPropertyIgnoreCase(data, parentField)
      if (tmpParentField != undefined && data.hasOwnProperty(tmpParentField)) {
        let parentId = data[tmpParentField]
        data[treeDataPid] = parentId
        if (null != parentId && '' != parentId) {
          if (!parentNodes.hasOwnProperty(parentId)) {
            let parentData = null
            if (leafNodes.hasOwnProperty(parentId)) {
              //之前遍历，但没遍历子节点
              parentData = leafNodes[parentId]
              try {
                delete leafNodes[parentId]
              } catch (e) {}
            }
            parentNodes[parentId] = parentData
          }
          let pNode = parentNodes[parentId]
          if (null != pNode) {
            if (pNode[folderProperty] === false) pNode[folderProperty] = true
            if (checkLeafField && pNode[tmpLeafField] === true) {
              pNode[tmpLeafField] = false
            }
          }
        }
      }
    }
    nodeMap[dataId] = data
    //默认折叠
    if (isCover === true) {
      data[openProperty] = false
    }
    if (checkLeafField) {
      let isFolder = false
      // 0 是 false, 1 是 true
      // 如果数据是从前台实体来，则 leafField 可能为 null/空/true
      let isLeafField = data[tmpLeafField]
      if (parentNodes.hasOwnProperty(dataId)) {
        //优先级最高
        isLeafField = false
        data[tmpLeafField] = false
      } else if (null === isLeafField) {
        isLeafField = true
      }
      if (null === data[tmpLeafField]) {
        data[tmpLeafField] = isLeafField
      }
      let isFolderType = typeof isLeafField

      if (isFolderType === 'boolean') isFolder = !isLeafField
      else if (isFolderType === 'string') {
        if (isLeafField == 'false' || isLeafField == '') isFolder = true
      }

      data[folderProperty] = isFolder
    }
    if (treeIcons) {
      let dsName = windowVmManager.getDatasourceNamesByWidgetCode({
        widgetCode: widgetId
      })
      _setTreeNodeIcon(
        data,
        treeIcons,
        openIcon,
        closeIcon,
        iconProperty,
        dsName,
        leafField
      )
    }
  }
  /*
     * 不能改没有子节点的数据，因为有场景需要使用展开节点事件动态获取子节点数据
    for(var key in leafNodes){
        if(leafNodes.hasOwnProperty(key)){
            var node = leafNodes[key];
            var checkParent = false;
            if (parentField != undefined) {
                tmpParentField = _getPropertyIgnoreCase(node, parentField);
                if (tmpParentField != undefined && data.hasOwnProperty(tmpParentField)) {
                    checkParent = true;
                }
            }
            var checkChild = false;
            if (leafField != undefined) {
                tmpLeafField = _getPropertyIgnoreCase(node, leafField);
                if (tmpLeafField != undefined && node.hasOwnProperty(tmpLeafField) && node[tmpLeafField] === false) {
                    checkChild = true;
                }
            }
            //暂时认为只有包含PID的才属于真正的节点数据，场景：某个节点下删除子节点的后变成叶子节点
            if(checkParent && checkChild){
                node[tmpLeafField] = true;
                node[folderProperty] = false;
            }
        }
    }
    */
  let childArray: string[] = []
  let parentArray: string[] = []
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
let translateByLRCodeType = function (
  widgetId: any,
  properties: Record<string, any>,
  datas: any[],
  isCover: boolean
) {
  return translateByParentType(widgetId, properties, datas, isCover)
}

/**
 *业务编码实现方式
 */
let translateByBizCodeType = function (
  widgetId: any,
  properties: Record<string, any>,
  datas: any[],
  isCover: boolean
) {
  let businessCodeRefField: any = getBusinessCodeRefField(widgetId)
  let bizCodeMap = {}
  let parentHashMap = {}
  let businessCodeList = []
  let _leafField = properties.leafField
  let businessCodeCfg = _getBusinessCodeFormat(widgetId)
  for (let i = 0, len = datas.length; i < len; i++) {
    let data = datas[i]
    if (data instanceof Record) {
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
      //@ts-ignore
      let dsName = metaModule.getDataSourceName(widgetId)
      _setTreeNodeIcon(
        data,
        properties.treeIcons,
        properties.openIcon,
        properties.closeIcon,
        properties.iconProperty,
        dsName,
        _leafField
      )
    }
    let businessCode = data[businessCodeRefField]
    bizCodeMap[businessCode] = data
    //这里是为了保存原来的排序顺序
    businessCodeList.push(businessCode)
    let parentCode = _getParentBusinessCode(businessCodeCfg, businessCode)
    parentHashMap[businessCode] = parentCode
  }
  let needToResetParent: any = isCover === false ? {} : null
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
    let treeData = widgetAction.executeWidgetAction(widgetId, 'getTreeData')
    //          var treeData = actionHandler.executeWidgetAction(widgetId, "getTreeData");
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
let getBusinessCodeRefField = function (widgetId: string) {
  let obj = windowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_CodeColumn'
  })
  return obj
}

let _getPropertyMap = function (widgetId: string) {
  let widget = widgetContext.get(widgetId, 'widgetObj')
  let properties: Record<string, any> = {}
  properties.folderProperty = widget.getfolderProperty()
  properties.leafField = widget.getLeafField()
  properties.openProperty = widget.getOpenProperty()
  properties.closeIcon = widget.getCloseIconProperty()
  properties.openIcon = widget.getOpenIconProperty()
  properties.treeDataPid = widget.getInnerTreeParentField()
  properties.parentField = widget.getParentField()
  let context = new ExpressionContext()
  properties.treeIcons = expEngine.execute({
    expression: 'GenerateTreeIcon("' + widgetId + '")',
    context: context
  })
  properties.iconProperty = widget.getIconProperty()
  return properties
}

let _setTreeNodeIcon = function (
  data: Record<string, any>,
  treeIcons: Record<string, any>,
  openIcon: string | number,
  closeIcon: string | number,
  iconProperty: string | number,
  dsName: string | number,
  leafField: string | number
) {
  // 新版属性，支持表达式条件
  if (undefined != treeIcons.jsonVersion && '1.0' == treeIcons.jsonVersion) {
    if (treeIcons.conditionType == '0') {
      if (undefined != treeIcons.iconCol && '' != treeIcons.iconCol) {
        data[closeIcon] = getImageByName(treeIcons.iconCol)
        //data[iconProperty] = getImageByName(treeIcons.iconCol);
      }
      if (undefined != treeIcons.iconExp && '' != treeIcons.iconExp)
        data[openIcon] = getImageByName(treeIcons.iconExp)

      //处理节点新增时图标设置有误
      if (leafField && (data[leafField] + '').toLowerCase() === 'true')
        data[iconProperty] = getImageByName(treeIcons.iconExp)
      else if (leafField && (data[leafField] + '').toLowerCase() === 'false')
        data[iconProperty] = getImageByName(treeIcons.iconCol)
    } else if (treeIcons.conditionType == '1') {
      // 实体字段绑定图标
      let _entity = treeIcons.entity
      if (
        _entity &&
        (_checkStrValid(data[_entity.iconExpColumn]) ||
          _checkStrValid(data[_entity.iconColColumn]))
      ) {
        if (_entity.iconExpColumn)
          data[openIcon] = _getImageByFileId(data[_entity.iconExpColumn])
        if (_entity.iconColColumn)
          data[closeIcon] = _getImageByFileId(data[_entity.iconColColumn])

        //处理节点新增时图标设置有误
        if (leafField && (data[leafField] + '').toLowerCase() === 'true')
          data[iconProperty] = _getImageByFileId(data[_entity.iconExpColumn])
        else if (leafField && (data[leafField] + '').toLowerCase() === 'false')
          data[iconProperty] = _getImageByFileId(data[_entity.iconColColumn])
      } else {
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
            let context = new ExpressionContext()
            context.setRecordIndex({
              datasourceName: dsName,
              index: data['id']
            })
            exp = expEngine.execute({
              expression: exp,
              context: context
            })
          }
          if (exp == true) {
            if (
              undefined != scene.iconExp &&
              null != scene.iconExp &&
              '' != scene.iconExp
            )
              data[openIcon] = getImageByName(scene.iconExp)

            if (
              undefined != scene.iconCol &&
              null != scene.iconCol &&
              '' != scene.iconCol
            )
              data[closeIcon] = getImageByName(scene.iconCol)

            //处理节点新增时图标设置有误
            if (leafField && (data[leafField] + '').toLowerCase() === 'true')
              data[iconProperty] = getImageByName(scene.iconCol)
            else if (
              leafField &&
              (data[leafField] + '').toLowerCase() === 'false'
            )
              data[iconProperty] = getImageByName(scene.iconExp)

            break
          }
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

// 通过实体字段值获取图片
let _getImageByFileId = function (fileId: string) {
  // 文件ID模式
  return (
    '/module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
    fileId +
    '%22%2C%22ImageObj%22%3A%22' +
    fileId +
    '%22%7D%7D'
  )
}

// 判断对象为有效字符串（空白视为无效）
let _checkStrValid = function (str: string) {
  let _str = str + ''

  if (
    'undefined' !== _str &&
    'null' !== _str &&
    typeof 'function' !== str &&
    '' !== _str.trim()
  )
    return true
  else return false
}

let getImageByName = function (imageName: string) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  return fileUtil.getImageByName(componentCode + '_' + imageName)
}

/**
 *获取父节点业务编码
 */
let _getParentBusinessCode = function (
  businessCodeCfg: any[],
  businessCode: string | null
) {
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
let _getBusinessCodeFormat = function (widgetId: string) {
  let value = widgetProperty.get(widgetId, 'CodeFormat')
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

let _getPropertyIgnoreCase = function (obj: any, property: string) {
  for (const p in obj) {
    if (p.toUpperCase() == property.toUpperCase()) return p
  }
  return null
}

export { translate }
