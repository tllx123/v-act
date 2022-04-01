/**
 * 加载业务流程实例图函数
 *
 */
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
var main = function (param: any) {
  var args = param.getArgs()
  var processDefinitionId = args.length > 0 ? args[0] : null
  var processInstanceId = args.length > 1 ? args[1] : null
  var destControlId = args.length > 2 ? args[2] : null
  var expression =
    'VWorkFlowLoadGraphFunc("' +
    processDefinitionId +
    '", "BA_WORKFLOW_DF_BIZ_PROCDEF", "ProcessDefinitionId")'
  var findParam = {
    expression: expression
  }
  var scope = scopeManager.getWindowScope()
  var windowCode = scope.getWindowCode()

  var result: any = null
  var isError
  operation.request({
    windowCode: windowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: findParam,
    success: function (rs: any) {
      result = rs
    },
    error: function (rs: any) {
      result = rs
      isError = true
    }
  })

  if (isError == true) {
    throw new Error('执行表达式错误,result = ' + result)
  }
  isError = false

  var json = result.data.result
  if (json == null || json == undefined) {
    return
  }
  var obj = jsonUtil.json2obj(json)
  if (obj == null || obj == undefined) {
    return
  }

  if (result != null) {
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
  }
  result = null
  json = null
  obj = null

  // 获取流程实例数据，并设置到流程监控图上
  var getInstnceDataExpr =
    'VWorkFlowLoadInstanceGraphFunc("' + processInstanceId + '")'

  var findInstanceParam = {
    expression: getInstnceDataExpr
  }

  operation.request({
    windowCode: windowCode,
    operation: 'WebExecuteFormulaExpression',
    isAsync: false,
    params: findInstanceParam,
    success: function (rs: any) {
      result = rs
    },
    error: function (rs: any) {
      result = rs
      isError = true
    }
  })

  var instanceDataJson = null
  if (result != null) {
    obj = result.data.result
    if (obj == null || obj == undefined) {
      return
    }
    instanceDataJson = obj
  }

  //先把所有线设为变灰
  widgetAction.executeWidgetAction(destControlId, 'setEdgeStyle', 1)

  //记录已设置的活动
  var hasSetImageStyles = {}
  //流程数据
  var processExecutions = !instanceDataJson
    ? null
    : instanceDataJson.processExecutions
  // liangmf 2013-03-27 由于processExecutions查询时是使用 order by startTime desc，所以必须倒序一遍，保证环节最新的数据在列表的后面
  processExecutions = processExecutions.reverse()
  if (processExecutions && processExecutions.length > 0) {
    for (var i = 0; i < processExecutions.length; i++) {
      var processExecution = processExecutions[i]
      var activityId = processExecution.activityId
      var activityType = processExecution.activityType
      var state = processExecution.state
      var imgSytleKey = state + 'Image' //约定Key为状态+Image,如RunningImage,与增加活动规则(AddFlowActivity)约定
      var imgStyle = widgetAction.executeWidgetAction(
        destControlId,
        'getCellAttr',
        activityId,
        imgSytleKey
      )
      //if (imgStyle) {
      //widgetAction.executeWidgetAction(destControlId, "setCellStyle", activityId, imgStyle);
      //}else{
      //根据活动类型与状态取默认的背景图
      var defaultImageSrc =
        'itop/common/images/JGActivityPanel/' + activityType + state + '.gif'
      widgetAction.executeWidgetAction(
        destControlId,
        'setCellStyle',
        activityId,
        defaultImageSrc
      )
      //}
      hasSetImageStyles[activityId] = activityId
      // 一般节点关联情况
      if (
        processExecution.fromActivityId &&
        processExecution.fromActivityId != ''
      ) {
        var fromActivityId = processExecution.fromActivityId
        widgetAction.executeWidgetAction(
          destControlId,
          'setEdgeStyle',
          2,
          fromActivityId,
          activityId
        )
      }

      // 处理父亲为判断节点的情况
      if (
        processExecution.determineParentActivityId &&
        processExecution.determineParentActivityId != ''
      ) {
        var parentActivityId = processExecution.determineParentActivityId
        widgetAction.executeWidgetAction(
          destControlId,
          'setEdgeStyle',
          2,
          parentActivityId,
          activityId
        )
      }

      // 处理父亲为分支节点的情况
      if (
        processExecution.forkParentActivityId &&
        processExecution.forkParentActivityId != ''
      ) {
        var parentActivityId = processExecution.forkParentActivityId
        widgetAction.executeWidgetAction(
          destControlId,
          'setEdgeStyle',
          2,
          parentActivityId,
          activityId
        )
      }

      // 处理父亲为汇聚节点的情况
      if (
        processExecution.joinParentActivityId &&
        processExecution.joinParentActivityId != ''
      ) {
        var parentActivityId = processExecution.joinParentActivityId
        widgetAction.executeWidgetAction(
          destControlId,
          'setEdgeStyle',
          2,
          activityId,
          parentActivityId
        )
      }
    }
  }
  //把还没有设置背景图的活动都设置为灰
  var allActivityIds = widgetAction.executeWidgetAction(
    destControlId,
    'getAllActivityID'
  )
  if (allActivityIds && allActivityIds.length > 0) {
    for (var i = 0; i < allActivityIds.length; i++) {
      var actId = allActivityIds[i]
      if (!(actId in hasSetImageStyles)) {
        //没有设置的活动把背景图设为“未开始”状态
        var imgStyle = widgetAction.executeWidgetAction(
          destControlId,
          'getCellAttr',
          actId,
          'NotStartImage'
        )
        if (imgStyle) {
          if (imgStyle.startsWith('itop/resources/functional_workflow_')) {
            imgStyle =
              'itop/common/images/JGActivityPanel/' +
              imgStyle.replace('itop/resources/functional_workflow_', '')
          }
          widgetAction.executeWidgetAction(
            destControlId,
            'setCellStyle',
            actId,
            imgStyle
          )
        }
      }
    }
  }

  return true
}

//注册主入口方法(必须有)
export { main }
