import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sandbox) {}

const loadDropDownSourceFromEntity = function (widgetCode: string) {
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  let dropDownSource = widgetContext.get(widgetCode, 'DropDownSource')
  if (typeof dropDownSource !== 'object') {
    dropDownSource = jsonUtil.json2obj(dropDownSource)
  }
  let valueField = widgetProperty.get(widgetCode, 'IDColumnName')
  let textField = widgetProperty.get(widgetCode, 'ColumnName')
  let dataSourceSetting = dropDownSource.DataSourceSetting
  if (dataSourceSetting.DataSourceType == 'Entity') {
    let dataConfig = dataSourceSetting.DataConfig
    let data = []
    // 获取常量记录
    let entityConstData = dataConfig.EntityConstData
    if (entityConstData && entityConstData.ConstData) {
      let constDatas = entityConstData.ConstData
      for (let i = 0; i < constDatas.length; i++) {
        let temp = {}
        let cData = constDatas[i]
        let idColumn = cData.id
        let textColumn = cData.text
        temp[textField] = textColumn
        temp[valueField] = idColumn
        temp['id'] = idColumn
        temp['text'] = textColumn
        if (cData.selected && cData.selected.toLowerCase() === 'true') {
          temp['default'] = true
        } else {
          temp['default'] = false
        }
        data.push(temp)
      }
    }
    // 获取实体记录
    let entityName = dataConfig.SourceName
    let showColumn = dataConfig.ShowColumn
    let saveColumn = dataConfig.SaveColumn
    let entity = datasourceUtil.getDatasource(entityName)
    let records = entity.getAllRecords().toArray()
    if (records && records.length > 0) {
      for (let i = 0; i < records.length; i++) {
        let temp = {}
        let valueMap = records[i].toMap()
        let idColumn = valueMap[saveColumn]
        let textColumn = valueMap[showColumn]
        // 存储所有data 如果下拉数据为多列显示
        if (
          dataSourceSetting.DataConfig.IsPickListFields &&
          dataSourceSetting.DataConfig.IsPickListFields + '' === 'true'
        )
          temp = valueMap
        temp[textField] = textColumn
        temp[valueField] = idColumn
        temp['id'] = idColumn
        temp['text'] = textColumn
        data.push(temp)
      }
    }
    widget.loadData(data)
  }
}

export { loadDropDownSourceFromEntity }
