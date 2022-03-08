import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

export function initModule(sBox) {}

const getPagingInfoByDataSource = function (entityName) {
  let widgetCodes = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: entityName
  })
  let pageInfo
  if (widgetCodes) {
    for (let i = 0; i < widgetCodes.length; i++) {
      let widgetCode = widgetCodes[i]
      if (widgetAction.isWidgetActionExist(widgetCode, 'getPageInfo')) {
        pageInfo = widgetAction.executeWidgetAction(
          widgetCode,
          'getPageInfo',
          widgetCode
        )
        if (pageInfo) {
          log.debug(
            '[Pagination.getPagingInfoByDataSource]当前获取分页信息的控件为：' +
              widgetCode
          )
          return pageInfo
        }
      }
    }
  }
  pageInfo = { recordStart: -1, pageSize: -1 }
  return pageInfo
}

export { getPagingInfoByDataSource }
