//@ts-nocheck
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { DropDownSourceUtil as dropDownSourceUtil } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

const main = function (param: FunctionContext) {
  let args = param.getArgs()
  let widgetId = args[0]
  let IsLoadData = args[1]
  let datas = []
  let data = widgetProperty.get(widgetId, 'DropDownSource')
  if (typeof data !== 'object') {
    data = jsonUtil.json2obj(data)
  }
  if (data != undefined) {
    let dataSourceSetting = data['DataSourceSetting']
    let dataSourceType = dataSourceSetting['DataSourceType']
    dataSourceType = dataSourceType.toString()
    // 表、查询模式要考虑是否需要重新获取数据
    if (dataSourceType == 'TableQuery') {
      let IsWhereRestrict = data['IsWhereRestrict']
      let whereRestrict = dropDownSourceUtil.genwhereRestrict(dataSourceSetting)
      // 根据每次请求的条件判断是否需要重新获取数据
      if (
        !(
          jsonUtil.obj2json(IsWhereRestrict) == jsonUtil.obj2json(whereRestrict)
        ) ||
        IsLoadData
      ) {
        let valueField = widgetProperty.get(widgetId, 'IDColumnName')
        let textField = widgetProperty.get(widgetId, 'ColumnName')
        datas = dropDownSourceUtil.genTableQuery(
          dataSourceSetting,
          whereRestrict,
          valueField,
          textField,
          widgetId
        )
        data['uiData'] = datas
      } else {
        // 条件一致直接获取缓存
        datas = data['uiData']
      }
      // 更新缓存数据
      data['IsWhereRestrict'] = whereRestrict
      widgetProperty.set(widgetId, 'DropDownSource', data)
    } else {
      //其它模式直接从缓存获取数据
      datas = data['uiData']
    }
  }
  return datas
}

export { main }
