import {
  ExpressionContext,
  ExpressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { jsonUtil as JsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

const main = function (ruleContext) {
  debugger
  let runtimeRouteContext = ruleContext.getRouteContext()

  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = JsonUtil.json2obj(inParams)

  let longitudeValue = inParamsObj['longitude']
  let latitudeValue = inParamsObj['latitude']
  let lon1 = getExpressionValue(runtimeRouteContext, longitudeValue)
  let lat1 = getExpressionValue(runtimeRouteContext, latitudeValue)
  if (lon1 == null || lat1 == null) {
    DialogUtil.warnDialog('经度或纬度值为null，请检查。', null, false)
    setBusinessRuleResult(ruleContext, null, null)
    return
  }

  let entityType = inParamsObj['entityType']
  let entityCode = inParamsObj['entityCode']

  let longitudeFieldCode = inParamsObj['longitudeFieldCode']
  let latitudeFieldCode = inParamsObj['latitudeFieldCode']
  let lonFieldName = getFieldName(longitudeFieldCode)
  let latFieldName = getFieldName(latitudeFieldCode)

  let minDistance = null
  let minLon = null
  let minLat = null
  let datasource = DatasourceManager.lookup({ datasourceName: entityCode })
  if (datasource != null) {
    let records = datasource.getAllRecords().toArray()
    if (records != null) {
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        let lon2 = record.get(lonFieldName)
        let lat2 = record.get(latFieldName)
        if (lon2 == null || lat2 == null) continue

        let distance = getDistance(lon1, lat1, lon2, lat2)
        if (minDistance == null || distance < minDistance) {
          minDistance = distance
          minLon = lon2
          minLat = lat2
        }
      }
    }
  }

  setBusinessRuleResult(ruleContext, minLon, minLat)
  ruleContext.setRuleStatus(true)
  ruleContext.fireRuleCallback()
  ruleContext.fireRouteCallback()
}

/**
 * @param runtimeRouteContext 运行期上下文
 * @param srcExpression 表达式
 * @return 返回计算后的值
 */
let getExpressionValue = function (runtimeRouteContext, srcExpression) {
  if (srcExpression != null) {
    let expressionContext = new ExpressionContext()
    expressionContext.setRouteContext(runtimeRouteContext)

    let value = ExpressionEngine.execute({
      expression: srcExpression,
      context: expressionContext
    })

    return value
  }
}

/**
 * @param name 包含实体编码的实体字段名称(entityCode.fieldName)
 * @return 返回去掉实体编码的实体字段名称(fieldName)
 */
let getFieldName = function (name) {
  let result = name
  let nameArr = name.split('.')
  if (nameArr.length > 1) {
    result = nameArr[nameArr.length - 1]
  }
  return result
}

/**
 * 设置规则返回值，返回经度、纬度值
 * @param ruleContext 规则上下文
 * @param Lon 经度
 * @param Lat 纬度
 */
function setBusinessRuleResult(ruleContext, lon, lat) {
  if (ruleContext.setBusinessRuleResult) {
    let success = true
    if (lon == null || lat == null) success = false
    ruleContext.setBusinessRuleResult({
      isSuccess: success,
      longitude: lon,
      latitude: lat
    })
  }
}

// 地球半径平均值千米(km)
let EARTH_RADIUS = 6371.0

/**
 * 将角度换算为弧度
 *
 * @param degrees 角度
 * @return 弧度
 */
let ConvertDegreesToRadians = function (degrees) {
  return (degrees * Math.PI) / 180
}

let HaverSin = function (theta) {
  let v = Math.sin(theta / 2)
  return v * v
}

/**
 * 计算球面两点间的距离。
 *
 * @param lon1 经度1
 * @param lat1 纬度1
 * @param lon2 经度2
 * @param lat2 纬度2
 * @return 两点间的距离
 */
let getDistance = function (lon1, lat1, lon2, lat2) {
  // 经纬度转换成弧度
  lon1 = ConvertDegreesToRadians(lon1)
  lat1 = ConvertDegreesToRadians(lat1)
  lon2 = ConvertDegreesToRadians(lon2)
  lat2 = ConvertDegreesToRadians(lat2)

  // 差值
  let vLon = Math.abs(lon1 - lon2)
  let vLat = Math.abs(lat1 - lat2)

  // h is the great circle distance in radians, great
  // circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
  let h = HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * HaverSin(vLon)
  let distance = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h))
  return distance
}

export { main }
