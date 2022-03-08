/**
 *  获取树和树表控件特定节点及子节点的id集合
    代码示例：
    GetTreeEntityIds("JGTreeGrid1","1","-")
    返回值为："1-2-4-3"
    参数1：树/树表控件编码，必填（字符串类型）
    参数2：记录id，选填，默认为当前行记录id（字符串类型）
    参数3：分隔符，选填，默认为 ","（字符串类型）
    返回值为字符串类型

*/
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as tree from '@v-act/vjs.framework.extension.platform.services.integration.vds.tree'
const vds = { widget, exception, tree }

const main = function (widgetCode, recordId, spitStr) {
  if (!widgetCode || '' == widgetCode) {
    var exception =
      vds.exception.newConfigException('函数第一个参数,实体编码不能为空!')
    throw exception
  }
  //获取控件树形结构
  var pidField = vds.widget.getProperty(widgetCode, 'PIDColumn')
  var orderField = vds.widget.getProperty(widgetCode, 'OrderNoColumn')
  var treeCodeField = vds.widget.getProperty(widgetCode, 'InnerCodeColumn')
  var leftField = vds.widget.getProperty(widgetCode, 'LeftCodeColumn')
  var rightField = vds.widget.getProperty(widgetCode, 'RightCodeColumn')
  var isLeafField = vds.widget.getProperty(widgetCode, 'LeafNode')
  //获取实体名
  var tableName = vds.widget.getDatasourceCodes(widgetCode)

  var treeStruct = {
    type: '1',
    pidField: pidField,
    treeCodeField: treeCodeField,
    orderField: orderField,
    isLeafField: isLeafField,
    leftField: leftField,
    rightField: rightField
  }
  //获取树形实体

  var tree = vds.tree.lookup(tableName, treeStruct)
  //获取节点id(若为空，则取当前记录)
  if (recordId == '') {
    //获取当前记录
    var record = tree.getCurrentRecord()
    var recordId = record.getSysId()
    //var recordId = record.get("id");
  }
  var node = tree.getNodeById(recordId)
  var ids = [recordId]
  ids = ids.concat(iterate(node))
  //设置返回结果
  if (spitStr == '') {
    spitStr = ','
  }
  return ids.join(spitStr)
}
export { main }

var iterate = function (parent) {
  var ids = []
  var nodSet = parent.getChildren()
  nodSet.iterate(function (node) {
    ids.push(node.getSysId())
    var rs = iterate(node)
    for (var i = 0, l = rs.length; i < l; i++) {
      ids.push(rs[i])
    }
  })
  return ids
}
