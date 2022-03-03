import * as mathUtil from 'module'
import * as dbManager from 'module'
import * as viewModel from 'module'
import * as viewContext from 'module'
import * as jsTool from 'module'
// 加载mathUtil模块
let undefined

let undefined

let undefined

let undefined

let undefined

exports.initModule = function () {}
// 主入口(必须有)
let main = function (varName, entityName, clearTarget) {
  if (mathUtil.isEmpty(varName)) {
    throw new Error('组件变量为空，请检查')
  }
  if (mathUtil.isEmpty(entityName)) {
    throw new Error('实体变量为空，请检查')
  }

  let isClear = false

  if (!mathUtil.isEmpty(clearTarget)) {
    isClear = clearTarget
  }

  let val = viewContext.getVariableValue(varName)

  //校验组件变量是否实体
  let isDs = dbManager.isDataSource(val)

  if (isDs) {
    //清除数据源
    if (isClear == true) {
      viewModel.getDataModule().resetDS(entityName)
    }

    let fieldCodes = []
    let allRecords = val.getRecords()
    if (allRecords.length > 0) {
      let record = allRecords[0]
      let metadata = val.getMetadata()
      let sourceFieldMap = {}
      for (let i = 0, model; (model = metadata[i]); i++) {
        let fields = model.fields
        for (let j = 0, field; (field = fields[j]); j++) {
          sourceFieldMap[field.code] = true
        }
      }
      let aimFieldObjs = viewModel
        .getMetaModule()
        .getMetadataFieldsByDS(entityName)

      //取需要复制的字段
      for (let j = 0; j < aimFieldObjs.length; j++) {
        let aimField = aimFieldObjs[j]
        let code = aimField.getCode()
        if (code.toLowerCase() != 'id' && sourceFieldMap.hasOwnProperty(code)) {
          fieldCodes.push(code)
          continue
        }
      }

      let insertRecords = []
      for (let i = 0; i < allRecords.length; i++) {
        //设置需要复制的字段的值
        let insertRecord = viewModel
          .getDataModule()
          .createEmptyRecordByDS(entityName, true)
        let re = allRecords[i]
        for (let j = 0; j < fieldCodes.length; j++) {
          insertRecord.set(fieldCodes[j], re.get(fieldCodes[j]))
        }
        insertRecords.push(insertRecord)
      }
    }

    if (insertRecords && insertRecords.length > 0) {
      viewModel.getDataModule().insertByDS(entityName, insertRecords)
    }
  } else {
    throw new Error('组件变量必须为实体类型，请检查')
  }
}
export { main }
