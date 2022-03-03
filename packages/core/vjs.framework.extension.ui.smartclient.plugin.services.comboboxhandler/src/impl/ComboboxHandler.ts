import * as viewContext from 'module'
import * as dbManager from 'module'
import * as jsonUtil from 'module'

let sandbox, widgetContext

exports.initModule = function (sBox) {
  if (sBox) {
    sandbox = sBox
    widgetContext = sandbox.getService(
      'vjs.framework.extension.widget.manager.widgetContext'
    )
  }
}

const loadDropDownSourceFromEntity = function (widgetCode) {
  let widget = widgetContext.get(widgetCode, 'widgetObj')
  let dropDownSource = widgetContext.get(widgetCode, 'DropDownSource')
  if (typeof dropDownSource !== 'object') {
    dropDownSource = jsonUtil.json2obj(dropDownSource)
  }
  let valueField = viewContext.getWidgetProperty(widgetCode, 'IDColumnName')
  let textField = viewContext.getWidgetProperty(widgetCode, 'ColumnName')
  let dataSourceSetting = dropDownSource.DataSourceSetting
  if (dataSourceSetting.DataSourceType == 'Entity') {
    let dataConfig = dataSourceSetting.DataConfig
    let data = []
    //获取常量记录
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
    //获取实体记录
    let entityName = dataConfig.SourceName
    let showColumn = dataConfig.ShowColumn
    let saveColumn = dataConfig.SaveColumn
    let entity = dbManager.getDB(entityName)
    let records = entity.getRecords()
    if (records && records.length > 0) {
      for (let i = 0; i < records.length; i++) {
        let temp = {}
        let valueMap = records[i].toMap()
        let idColumn = valueMap[saveColumn]
        let textColumn = valueMap[showColumn]
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
