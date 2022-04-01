import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetDatasource as widgetDatasource } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.logic.datasource'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import {
  DatasourcePuller as puller,
  DatasourcePusher as pusher
} from '@v-act/vjs.framework.extension.platform.services.domain.datasource'

//主入口(必须有)
const main2 = function (param: any) {
  var args = param.getArgs()
  var processDefinitionId = args.length > 0 ? args[0] : null
  var destControlId = args.length > 1 ? args[1] : null
  var scope = scopeManager.getScope()
  var currentWindowCode = scope.getWindowCode()

  var expression =
    'VWorkFlowLoadGraphFunc("' +
    processDefinitionId +
    '", "vbase_workflow.v_workflow_df_template", "id")'
  var findParam = {
    expression: expression
  }

  var scope = scopeManager.getScope()
  var currentWindowCode = scope.getWindowCode()
  operation.request({
    windowCode: currentWindowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: findParam,
    success: function (rs: any) {
      var json = rs.data.result
      if (json == null || json == undefined) {
        return
      }
      var obj = jsonUtil.json2obj(json)
      if (obj == null || obj == undefined) {
        return
      }
      // 获取查询得到的数据，并加载到对应的DB中
      var graphXML = obj.graphXML
      var datas = obj.datas
      var dataSourceName = widgetDatasource.getBindDatasourceName(destControlId)
      var records = puller.createRecords({
        datasourceName: dataSourceName,
        datas: datas
      })
      pusher.loadRecords({ datasourceName: dataSourceName, records: records })
      widgetAction.executeWidgetAction(destControlId, 'loadGraph', graphXML)
    },
    error: function (rs: any) {
      throw new Error('执行表达式错误.')
    }
  })
}
//注册主入口方法(必须有)
export { main2 }
