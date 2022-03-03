import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as widgetMapping } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let sandbox
let undefined
let undefined
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  if (args.length != 3) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数参数个数必须为3个!'
    })
    throw exception
  }
  let widgetCode = args[0]
  let recordId = args[1]
  let spitStr = args[2]
  if (!widgetCode || '' == widgetCode) {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '函数第一个参数,实体编码不能为空!'
    })
    throw exception
  }
  //获取控件树形结构
  let pidField = widgetContext.get(widgetCode, 'PIDColumn')
  let orderField = widgetContext.get(widgetCode, 'OrderNoColumn')
  let treeCodeField = widgetContext.get(widgetCode, 'InnerCodeColumn')
  let leftField = widgetContext.get(widgetCode, 'LeftCodeColumn')
  let rightField = widgetContext.get(widgetCode, 'RightCodeColumn')
  let isLeafField = widgetContext.get(widgetCode, 'LeafNode')
  //获取实体名
  let tableName = widgetMapping.getDatasourceNamesByWidgetCode({
    widgetCode: widgetCode
  })
  /*var treeStruct = {
         "type": "1",
         "pidField": "code",
         "treeCodeField": "InnerCode",
         "orderField": "OrderNo",
         "isLeafField": "IsLeaf",
         "leftField": "LeftCode",
         "rightField": "RightCode"
       };*/
  let treeStruct = {
    type: '1',
    pidField: pidField,
    treeCodeField: treeCodeField,
    orderField: orderField,
    isLeafField: isLeafField,
    leftField: leftField,
    rightField: rightField
  }
  //获取树形实体
  let treeManager = sandbox.getService(
    'vjs.framework.extension.platform.services.model.manager.tree.TreeManager'
  )
  let tree = treeManager.lookup({
    datasourceName: tableName,
    treeStruct: treeStruct
  })
  //获取节点id(若为空，则取当前记录)
  if (recordId == '') {
    //获取当前记录
    let record = tree.getCurrentRecord()
    let recordId = record.getSysId()
    //var recordId = record.get("id");
  }
  let node = tree.getNodeById(recordId)
  let ids = [recordId]
  ids = ids.concat(iterate(node))
  //设置返回结果
  if (spitStr == '') {
    spitStr = ','
  }
  return ids.join(spitStr)
}
//迭代获取子节点
let iterate = function (parent) {
  let ids = []
  let nodSet = parent.getChildren()
  nodSet.iterate(function (node) {
    ids.push(node.getSysId())
    let rs = iterate(node)
    for (let i = 0, l = rs.length; i < l; i++) {
      ids.push(rs[i])
    }
  })
  return ids
}

export { main }
