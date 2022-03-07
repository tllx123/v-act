import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DatasourceManager as dsManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

export function getType() {
  return 'entity'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var code = property.code
    var entityCode = widgetProperty[code]
    if (typeof entityCode != 'undefined' || entityCode != null) {
      var scopeId = scopeManager.getCurrentScopeId()
      var prefix = isc.WidgetUtils.genWidgetRefId(scopeId, '')
      // 兼容处理以前旧窗体，原有控件数据源会经过isc.WidgetUtils.genWidgetRefId(scopeId,
      // this.TableName)处理
      if (entityCode.substring(0, prefix.length) == prefix) {
        entityCode = entityCode.substring(prefix.length)
      }
      var ds = dsManager.lookup({
        datasourceName: entityCode
      })
      if (ds) {
        widgetProperty[code] = ds.getOrginalDatasource().getOrginalDatasource()
      } else if (!property.hasOwnProperty('required') || property.required) {
        throw Error('实体定义不存在，请检查！实体编号：' + entityCode)
      }
    }
  }
}
