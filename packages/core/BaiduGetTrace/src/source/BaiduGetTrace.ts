import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { Baidutrace as BaiduTrace } from '@v-act/vjs.framework.extension.platform.services.native.mobile'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ProgressBarUtil as progressbar } from '@v-act/vjs.framework.extension.ui.common.plugin.services.progressbar'

let undefined
exports.initModule = function (sBox) {
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  let track_entity_name = experssFunc(
    inParamObj.track_entity_name,
    routeContext
  )
  let start_time = experssFunc(inParamObj.start_time, routeContext)
  start_time = getTime(start_time)
  let end_time = inParamObj.end_time
  if (end_time) {
    end_time = experssFunc(inParamObj.end_time, routeContext)
    end_time = getTime(end_time)
  } else {
    end_time = Math.round(new Date().getTime() / 1000)
  }
  let entityCode = inParamObj.entity_name
  let field_longitude = inParamObj.longitude
  let field_latitude = inParamObj.latitude
  let field_loc_time = inParamObj.loc_time

  let scopeId = scopeManager.getCurrentScopeId()
  let dataCallback = function (result) {
    if (undefined != scopeId) {
      scopeManager.openScope(scopeId)
    }
    let isSuccess = result.isSuccess
    let errorMsg = result.errorMsg
    let points = result.points
    let distance = result.distance
    if (isSuccess == true) {
      //设置实体的值
      setEntity(
        points,
        entityCode,
        field_longitude,
        field_latitude,
        field_loc_time,
        distance,
        routeContext
      )
    }
    //设置规则的返回值
    setBusinessRuleResult(ruleContext, isSuccess, errorMsg, distance)
    scopeManager.closeScope()
    //			progressbar.hideProgress();
    ruleContext.fireRouteCallback()
  }
  let dataCallbackAsync = ruleContext.genAsynCallback(dataCallback)
  //		progressbar.showProgress("正在获取轨迹数据...");
  getTraceData(
    track_entity_name,
    start_time,
    end_time,
    ruleContext,
    dataCallbackAsync
  )
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 获取轨迹点
 *
 * return : {
 * 		isSuccess : true,
 * 		errorMsg  : "",
 * 		points    : [{longitude:1,latitude:2,loc_time:3}...],
 * 		distance  : 0
 * }
 */
let getTraceData = function (
  entity_name,
  start_time,
  end_time,
  ruleContext,
  callback
) {
  let host = location.href.substring(
    0,
    location.href.indexOf('module-operation')
  )
  if (window.cordova) {
    host = GlobalVariables.getServerUrl() + '/'
  }
  let ajaxUrl =
    host + 'module-operation!executeOperation?operation=BaiduGetTrace'
  let result = {}
  let distance = 0
  let successCB = function (data) {
    let dataObj = $.parseJSON(data.responseText)
    let allPoints = []
    let isSuccess = dataObj.success
    let errorMsg = dataObj.errorMsg
    if (isSuccess == true) {
      let traceDatas = dataObj.traceData
      for (let i = 0; i < traceDatas.length; i++) {
        let traceData = traceDatas[i]
        distance = traceData.distance
        let start_point = traceData.start_point
        let end_point = traceData.end_point
        allPoints.push(start_point)
        let points = traceData.points
        for (let j = 0; j < points.length; j++) {
          allPoints.push(points[j])
        }
        allPoints.push(end_point)
      }
    }
    console.log(dataObj)
    console.log(allPoints)
    result['isSuccess'] = isSuccess
    result['errorMsg'] = errorMsg
    result['points'] = allPoints
    result['distance'] = distance
    callback(result)
  }
  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: {
      entity_name: entity_name,
      start_time: start_time,
      end_time: end_time
    },
    isAsync: true,
    afterResponse: successCB
  })
}

/**
 * 设置实体，赋值实体之前清空记录
 */
let setEntity = function (
  points,
  entityCode,
  field_longitude,
  field_latitude,
  field_loctime,
  distance,
  routeContext
) {
  let dataSource = getDataSource(entityCode, routeContext)
  let insertRecords = []
  for (let i = 0; i < points.length; i++) {
    let point = points[i]
    if (point.longitude != 0 && point.latitude != 0) {
      let emptyRecord = dataSource.createRecord()
      emptyRecord.set(field_longitude, point.longitude)
      emptyRecord.set(field_latitude, point.latitude)
      emptyRecord.set(field_loctime, point.loc_time)
      insertRecords.push(emptyRecord)
    }
  }
  dataSource.clear()
  if (insertRecords.length > 0) {
    dataSource.insertRecords({
      records: insertRecords,
      position: 3
    })
  }
}

let getTime = function (date) {
  date = date.substring(0, 19)
  date = date.replace(/-/g, '/')
  let timestamp = new Date(date).getTime() / 1000
  return timestamp
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, isSuccess, errorMsg, distance) {
  errorMsg = errorMsg ? errorMsg : ''
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isSuccess: isSuccess,
      errorMsg: errorMsg,
      distance: distance
    })
  }
}

/**
 * desc 执行表达式
 * experss 表达式
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.services.engine":null,
 * services:
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 *
 * */
function experssFunc(experss, routeContext) {
  if (experss == null || experss == '') {
    return null
  }
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

//获取实体对象
function getDataSource(entityCode, routeContext) {
  let dsName = entityCode
  let datasource = null
  if (DBFactory.isDatasource(dsName)) {
    datasource = dsName
  } else {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = manager.lookup({
        datasourceName: dsName
      })
    } else {
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  return datasource
}

export { main }
