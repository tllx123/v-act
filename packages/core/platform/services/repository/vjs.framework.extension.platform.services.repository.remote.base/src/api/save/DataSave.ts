/**
 * @module DataSave
 * @desc 数据保存模块<br/>
 * vjs名称：vjs.framework.extension.platform.services.repository.remote.base<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.repository.save<br/>
 * @example
 *  使用前,请在vjs配置文件中添加对vjs.framework.extension.platform.services.repository.remote.base模块依赖
 * 	var saver = sandbox.getService("vjs.framework.extension.platform.services.repository.save");
 *  saver.save({
 * 		"dataSchemas":[{
 * 			"dataSource":"datasource1",
 * 			"datas":[{
 * 				"id":"id1",
 * 				"field1":"a",
 * 				"field2":"b",
 * 				"__ds_state__":"insertorupdate"
 * 			},{
 * 				"id":"id2",
 * 				"field1":"a",
 * 				"field2":"b",
 * 				"__ds_state__":"delete"
 *			}],
 * 			"metadata":metadata
 * 		}],
 * 		"treeStructs":null,
 * 		"success":function(){alert("保存成功")}
 * });
 */

import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as operation } from '@v-act/vjs.framework.extension.system.rpc'

/**
 * 保存数据到后台
 * @param {Object} params 参数信息
 * {
 * 		dataSchemas : Array<Object> 数据模型
 * 		[{
 *			"dataSource": String 数据源名称
 * 			"datas" : Array<Object> 保存数据
 * 			"metadata" : Array<Object> 元数据信息
 * 		}]
 * 		treeStructs: Array<Object> 树形结构配置
 * 		transactionId : String 事务id
 * 		success : Function 提交成功后回调
 * }
 */
export default function save(params: any) {
  var dataSchemas = params.dataSchemas,
    treeStructs = params.treeStructs,
    success = params.success,
    transactionId = params.transactionId
  var scope = scopeManager.getScope()
  operation.invokeOperation({
    param: {
      saveDatas: dataSchemas,
      saveMode: 'normal',
      treeStructMapArray: treeStructs
    },
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode == undefined ? null : scope.getWindowCode(),
    operationName: 'Save',
    transactionId: transactionId,
    isAsync: false,
    afterResponse: success
  })
}
