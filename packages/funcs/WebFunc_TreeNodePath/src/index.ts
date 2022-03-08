/**
 *  weicd
 *
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as tree from '@v-act/vjs.framework.extension.platform.services.integration.vds.tree'
const vds = { object, ds, exception, tree }

const main = function (dsName, fieldName, spliter, treeStructCfgStr) {
  dsName = vds.object.isUndefOrNull(dsName) ? null : dsName
  fieldName = vds.object.isUndefOrNull(fieldName) ? null : fieldName
  spliter = vds.object.isUndefOrNull(spliter) ? null : spliter
  treeStructCfgStr = vds.object.isUndefOrNull(treeStructCfgStr)
    ? null
    : treeStructCfgStr

  var treeStructCfgObj = parseCfgObj(treeStructCfgStr)
  //树类型，1=层级码，2=左右树, 3=编码树
  var type = getPropertyValue(treeStructCfgObj, 'type')
  //父节点PID字段名
  var pidField = getPropertyValue(treeStructCfgObj, 'pidField')
  //层级码字段名
  var treeCodeField = getPropertyValue(treeStructCfgObj, 'treeCodeField')
  //顺序号字段名
  var orderField = getPropertyValue(treeStructCfgObj, 'orderField')
  //是否叶子节点字段名
  var isLeafField = getPropertyValue(treeStructCfgObj, 'isLeafField')
  //左右树left字段名
  var leftField = getPropertyValue(treeStructCfgObj, 'leftField')
  //左右树right字段名
  var rightField = getPropertyValue(treeStructCfgObj, 'rightField')
  //业务编码字段
  var bizCodeField = getPropertyValue(treeStructCfgObj, 'bizCodeField')
  //业务编码格式
  var bizCodeFormat = getPropertyValue(treeStructCfgObj, 'bizCodeFormat')
  //业务过滤字段
  var busiFilterField = getPropertyValue(treeStructCfgObj, 'busiFilterField')

  var treeStruct = {}
  if ('1' == type) {
    if (vds.object.isUndefOrNull(pidField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示层级码树时pidField不能为空！'
      )
    if (vds.object.isUndefOrNull(treeCodeField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示层级码树时treeCodeField不能为空！'
      )
    if (vds.object.isUndefOrNull(orderField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示层级码树时orderField不能为空！'
      )
    if (vds.object.isUndefOrNull(isLeafField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示层级码树时isLeafField不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['pidField'] = pidField
    treeStruct['treeCodeField'] = treeCodeField
    treeStruct['orderField'] = orderField
    treeStruct['isLeafField'] = isLeafField
  } else if (type == '2') {
    if (vds.object.isUndefOrNull(pidField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示左右树时pidField不能为空！'
      )
    if (vds.object.isUndefOrNull(leftField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示左右树时leftField不能为空！'
      )
    if (vds.object.isUndefOrNull(rightField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示左右树时rightField不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['pidField'] = pidField
    treeStruct['leftField'] = leftField
    treeStruct['rightField'] = rightField
  } else if (type == '3') {
    if (vds.object.isUndefOrNull(bizCodeField))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示编码树时bizCodeField不能为空！'
      )
    if (vds.object.isUndefOrNull(bizCodeFormat))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)表示编码树时bizCodeFormat不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['bizCodeField'] = bizCodeField
    treeStruct['bizCodeFormat'] = bizCodeFormat
  } else {
    throw vds.exception.newConfigException(
      'TreeNodePath函数的(树配置信息)中的type类型值必须为1,2,3三种！'
    )
  }

  if (!spliter) {
    spliter = '/'
  }
  var datasource = vds.ds.lookup(dsName)
  var selected = datasource.getCurrentRecord()
  var retValue = []
  if (selected) {
    var pathArray
    var tree = vds.tree.lookup(dsName, treeStruct)
    fieldName = _getFieldName(fieldName)
    var node = tree.getNodeById(selected.getSysId())
    pathArray = getTreeNodePath(
      {
        node: node,
        fieldCode: fieldName
      },
      tree
    )
    retValue = pathArray.reverse().join(spliter)
    return retValue
  } else {
    return ''
  }
}

var getTreeNodePath = function (params, tree) {
  var node = params.node,
    fieldName = params.fieldCode
  var retValue = []
  if (node) {
    var isID = false
    if (fieldName.indexOf('.') != -1) {
      fieldName = fieldName.split('.')[1]
    }
    var metadata = tree.getMetadata()
    var isContain = metadata.contains(fieldName)
    if (fieldName == 'id') {
      isContain = true
      isID = true
    }
    if (!isContain) {
      vds.log.error(
        '[TreeViewUtil.getTreeNodePath]获取树节点路径失败,字段编号不存在,请检查配置！fieldCode:' +
          fieldName
      )
      return
    }
    var tempNode = node
    while (tempNode) {
      if (isID) {
        retValue.push(tempNode.getSysId())
      } else {
        retValue.push(tempNode.get(fieldName))
      }
      tempNode = tempNode.getParent()
    }
  }
  return retValue
}

var getPropertyValue = function (obj, propertyName) {
  if (obj == null || propertyName == null || propertyName == '') return null
  for (var propName in obj) {
    if (propName.toLocaleLowerCase() == propertyName.toLocaleLowerCase())
      return obj[propName]
  }
  return null
}

var parseCfgObj = function (cfgStr) {
  //"type:1,pidField:PID,treeCodeField:InnerCode,orderField:orderNo,isLeafField:isLeaf,busiFilterField:myBusiField"
  if (
    vds.object.isUndefOrNull(cfgStr) ||
    vds.object.isUndefOrNull(cfgStr.trim())
  )
    throw vds.exception.newConfigException(
      'TreeNodePath函数的(树配置信息)不能为空'
    )
  cfgStr = cfgStr.trim()
  var pairs = cfgStr.split(',')
  if (pairs == null || pairs.length == 0)
    throw vds.exception.newConfigException(
      'TreeNodePath函数的(树配置信息)格式错误:' + cfgStr
    )

  var cfgObj = {}
  for (var i = 0; i < pairs.length; i++) {
    var t = pairs[i].trim()
    if (vds.object.isUndefOrNull(t))
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)格式错误：' + cfgStr
      )
    var tmps = t.split(':')
    if (tmps == null || tmps.length == 0 || tmps.length > 2)
      throw vds.exception.newConfigException(
        'TreeNodePath函数的(树配置信息)中的[' + t + ']格式错误：' + cfgStr
      )
    var name = tmps[0].trim()
    var value = tmps.length == 2 ? tmps[1] : null
    cfgObj[name] = value
  }
  return cfgObj
}

var _getFieldName = function (fieldName) {
  var retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    var fieldNames = fieldName.split('.')
    retvalue = fieldNames[fieldNames.length - 1]
  }
  return retvalue
}
export { main }
