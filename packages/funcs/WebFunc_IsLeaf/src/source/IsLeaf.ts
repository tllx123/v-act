import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    dataSourceName = argsLen >= 1 ? args[0] : null,
    nodeId = argsLen >= 2 ? args[1] : null,
    treeStructCfgStr = argsLen >= 3 ? args[2] : null

  // 示例：IsLeaf("datasourceName", "ID", "type:1,pidField:PID,treeCodeField:InnerCode,orderField:orderNo,isLeafField:isLeaf,busiFilterField:myBusiField")
  let treeStructCfgObj = parseCfgObj(treeStructCfgStr)

  // 树类型，1=层级码，2=左右树, 3=编码树
  let type = getPropertyValue(treeStructCfgObj, 'type')
  // 父节点PID字段名
  let pidField = getPropertyValue(treeStructCfgObj, 'pidField')
  // 层级码字段名
  let treeCodeField = getPropertyValue(treeStructCfgObj, 'treeCodeField')
  // 顺序号字段名
  let orderField = getPropertyValue(treeStructCfgObj, 'orderField')
  // 是否叶子节点字段名
  let isLeafField = getPropertyValue(treeStructCfgObj, 'isLeafField')
  // 左右树left字段名
  let leftField = getPropertyValue(treeStructCfgObj, 'leftField')
  // 左右树right字段名
  let rightField = getPropertyValue(treeStructCfgObj, 'rightField')
  // 业务编码字段
  let bizCodeField = getPropertyValue(treeStructCfgObj, 'bizCodeField')
  // 业务编码格式
  let bizCodeFormat = getPropertyValue(treeStructCfgObj, 'bizCodeFormat')
  // 业务过滤字段
  let busiFilterField = getPropertyValue(treeStructCfgObj, 'busiFilterField')

  let treeStruct = {}
  if ('1' == type) {
    if (stringUtil.isEmpty(pidField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示层级码树时pidField不能为空！'
      )
    if (stringUtil.isEmpty(treeCodeField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示层级码树时treeCodeField不能为空！'
      )
    if (stringUtil.isEmpty(orderField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示层级码树时orderField不能为空！'
      )
    if (stringUtil.isEmpty(isLeafField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示层级码树时isLeafField不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['pidField'] = pidField
    treeStruct['treeCodeField'] = treeCodeField
    treeStruct['orderField'] = orderField
    treeStruct['isLeafField'] = isLeafField
  } else if (type == '2') {
    if (stringUtil.isEmpty(pidField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示左右树时pidField不能为空！'
      )
    if (stringUtil.isEmpty(leftField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示左右树时leftField不能为空！'
      )
    if (stringUtil.isEmpty(rightField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示左右树时rightField不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['pidField'] = pidField
    treeStruct['leftField'] = leftField
    treeStruct['rightField'] = rightField
  } else if (type == '3') {
    if (stringUtil.isEmpty(bizCodeField))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示编码树时bizCodeField不能为空！'
      )
    if (stringUtil.isEmpty(bizCodeFormat))
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)表示编码树时bizCodeFormat不能为空！'
      )

    treeStruct['type'] = type
    treeStruct['bizCodeField'] = bizCodeField
    treeStruct['bizCodeFormat'] = bizCodeFormat
  } else {
    throw new Error(
      'isLeaf函数的第3个参数(树配置信息)中的type类型值必须为1,2,3三种！'
    )
  }

  //        if (stringUtil.isEmpty(busiFilterField))
  //            throw new Error("isLeaf函数的第3个参数(树配置信息)中的业务过滤字段busiFilterField不能为空！");

  let selectedRecord = null
  let datasource = manager.lookup({
    datasourceName: dataSourceName
  })
  try {
    if (!nodeId) selectedRecord = datasource.getCurrentRecord()
    else selectedRecord = datasource.getRecordById(nodeId)
  } catch (e) {
    throw new Error('isLeaf函数执行获取树数据时出错：' + e.message)
  }
  if (selectedRecord == null) {
    let msg = nodeId
      ? '树数据中不存在ID为' + nodeId + '的记录'
      : '树数据中当前行记录为空'
    throw new Error('isLeaf函数执行出错:' + msg)
  }

  try {
    let treeViewModel = treeManager.lookup({
      datasourceName: dataSourceName,
      treeStruct: treeStruct
    })
    let children = treeViewModel.getNodeById(nodeId)
    return children.isLeaf()
  } catch (e) {
    throw new Error('isLeaf函数执行出错：' + e.message)
  }
}

let getPropertyValue = function (obj, propertyName) {
  if (obj == null || propertyName == null || propertyName == '') return null
  for (let propName in obj) {
    if (propName.toLocaleLowerCase() == propertyName.toLocaleLowerCase())
      return obj[propName]
  }
  return null
}

let parseCfgObj = function (cfgStr) {
  // "type:1,pidField:PID,treeCodeField:InnerCode,orderField:orderNo,isLeafField:isLeaf,busiFilterField:myBusiField"
  if (stringUtil.isEmpty(cfgStr) || stringUtil.isEmpty(stringUtil.trim(cfgStr)))
    throw new Error('isLeaf函数的第3个参数(树配置信息)不能为空')
  cfgStr = stringUtil.trim(cfgStr)
  let pairs = cfgStr.split(',')
  if (pairs == null || pairs.length == 0)
    throw new Error('isLeaf函数的第3个参数(树配置信息)格式错误:' + cfgStr)

  let cfgObj = {}
  for (let i = 0; i < pairs.length; i++) {
    let t = stringUtil.trim(pairs[i])
    if (stringUtil.isEmpty(t))
      throw new Error('isLeaf函数的第3个参数(树配置信息)格式错误：' + cfgStr)
    let tmps = t.split(':')
    if (tmps == null || tmps.length == 0 || tmps.length > 2)
      throw new Error(
        'isLeaf函数的第3个参数(树配置信息)中的[' + t + ']格式错误：' + cfgStr
      )
    let name = stringUtil.trim(tmps[0])
    let value = tmps.length == 2 ? tmps[1] : null
    cfgObj[name] = value
  }
  return cfgObj
}

export { main }
