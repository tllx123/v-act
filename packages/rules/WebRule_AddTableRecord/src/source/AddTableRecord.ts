import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { StoreTypes as storeTypes } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as datasourcemanager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { WindowVMMappingManager as windowVMManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let context

let rulecontext

export function initModule(sBox) {}

/**
 * 给数据源插入记录的对象
 * @param dataSourceName 数据源
 * @param numCount  插入的条数
 */
function AddTableRecord(dataSourceName, numCount) {
  this.dataSourceName = dataSourceName
  this.numCount = numCount
}

let getFieldName = function (fieldName) {
  let retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    retvalue = fieldName.split('.')[1]
  }
  return retvalue
}

/**
 * 插入记录的方法
 * @param defaultValueCfg 插入记录的默认值，结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 * @param position 插入记录的位置（相比选中行，具体的逻辑在对应控件的hanlder中处理）
 */
AddTableRecord.prototype.insertRecords = function (
  datasource,
  defaultValueCfg,
  position
) {
  let insertRecords = []
  // var initEmptyRecord=viewModel.getDataModule().createEmptyRecordByDS(this.dataSourceName);
  //		var datasource = datasourcemanager.lookup({
  //			"datasourceName": this.dataSourceName
  //		});
  for (let i = 0; i < this.numCount; i++) {
    // var emptyRecord = initEmptyRecord.createNew();
    let emptyRecord = datasource.createRecord()
    for (let j = 0; j < defaultValueCfg.length; j++) {
      // TODO:
      let fieldName = getFieldName(defaultValueCfg[j]['fieldName'])
      let defaultValue = defaultValueCfg[j]['value']
      // emptyRecord.set(fieldName, defaultValue);
      emptyRecord.set(fieldName, defaultValue)
    }
    insertRecords.push(emptyRecord)
  }
  // TODO: 等待冬辉答复
  let actionMode = this.getActionMode(position)
  // viewModel.getDataModule().insertByDS(this.dataSourceName, insertRecords, null, null, actionMode);
  datasource.insertRecords({
    records: insertRecords,
    position: actionMode
  })
  return insertRecords
}

//	/**
//	 * 插入记录并直接提交
//	 * @param defaultValue 插入记录的默认值，结构为json格式：
//	 * 如：tablename.fieldName1:value1，tablename.fieldName2:value2｝
//	 * @param position 插入记录的位置（相比选中行，具体的逻辑在对应控件的hanlder中处理）
//	 * @param responseCallBack 回调函数
//	 */
//	AddTableRecord.prototype.insertRecordsAndSubmit = function (defaultValue, position, responseCallBack) {
//		var insertRecords = this.insertRecords(defaultValue, position);
//		// TODO:old_树结构数据参数，按需要看是否增加
//		var treeStructMapArray = null;
//		viewModel.getCmpModule().submitByDS(this.dataSourceName, true, responseCallBack, treeStructMapArray);
//		return insertRecords;
//	};

/**
 * 获取插入的位置信息
 * @param position 位置参数
 * "0","1", "2", "3" 分别代表选中行上方、下方、最前、最后
 */
AddTableRecord.prototype.getActionMode = function (position) {
  let actionMode
  switch (position) {
    case '0':
      actionMode = Datasource.Position.BEFORE // TODO:
      break
    case '1':
      actionMode = Datasource.Position.AFTER // TODO:
      break
    case '2':
      actionMode = Datasource.Position.TOP // TODO:
      break
    case '3':
      actionMode = null
      break
    case '':
      actionMode = null
      break
    default:
      log.warn(
        '[AddTableRecord.getActionMode]插入位置不正确,传入的actionMode:' +
          position +
          ',自动适配成插入到最后'
      )
      actionMode = null
      break
  }
  return actionMode
}
/**
 * 重置数据源（清空当前数据源数据），如果有依赖的数据源，一并重置
 * @param dsName 数据源
 */
let _resetDSRecursion = function (dsName, isCallObserver) {
  //        var relations = viewModel.getMetaModule().getRelationsBySrc(dsName);
  //
  //        // 处理主表
  //        viewModel.getDataModule().resetDS(dsName,isCallObserver);
  //
  //        // 如果有从表递归处理从表
  //        if(relations && relations.length > 0) {
  //            for(var i = 0; i < relations.length; i++) {
  //                var relation = relations[i];
  //                var refTableName = relation["refTableName"];
  //                _resetDSRecursion(refTableName,true);
  //            }
  //        }
  //		var datasource = datasourcemanager.lookup({
  //			"datasourceName": dsName
  //		});
  datasource.clear({ fireEvent: false })
}

/**
 * 是不是单值控件
 * @param dataSource 数据源名称
 * @return  widgetAttribute.storeType.SET | widgetAttribute.storeType.SINGLE_RECORD
 */
let isSingleStoreTypeByDataSource = function (dataSource) {
  let isSingle = true
  // var widgetIDs = viewModel.getMetaModule().getWidgetIdsByDataSource(dataSource);
  let widgetIDs = windowVMManager.getWidgetCodesByDatasourceName({
    datasourceName: dataSource
  })
  if (!widgetIDs || (util.isArray(widgetIDs) && widgetIDs.length <= 0)) {
    isSingle = false
  } else {
    for (let i = 0; i < widgetIDs.length; i++) {
      //var type = viewContext.getWidgetContext(widgetIDs[i], "widgetType");  	var type =  widgetContext.get(widgetIDs[i], "widgetType");
      //var storeType = viewContext.getWidgetStoreTypeFromContext(type);
      let storeType = widgetContext.getStoreType(widgetIDs[i])
      if (
        storeType == storeTypes.SET ||
        storeType == 'menu' ||
        storeType == 'DataList'
      ) {
        isSingle = false
        break
      }
    }
  }
  return isSingle
}
/**
 * 通过映射关系，获取新增记录的默认值
 * @param mappings 映射信息
 * @param tableName 目标表
 * @return 结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 */
let _getDefaultValue = function (datasource, mappings, tableName) {
  let returnValue = []
  if (!mappings || mappings.length <= 0) {
    return returnValue
  } else {
    for (let i = 0; i < mappings.length; i++) {
      let fieldValue = {}
      let srcField = mappings[i]['srcField']
      let destField = mappings[i]['destField']
      let fieldType = mappings[i]['fieldtype']

      fieldValue['fieldName'] = getFieldName(destField)

      //如果是字段
      if (fieldType === '1') {
        let dataSourceName = srcField.substring(0, srcField.indexOf('.'))
        // var selected = viewModel.getDataModule().getCurrentRowByDS(dataSourceName);
        let selected = datasource.getCurrentRecord()
        if (selected) {
          let fieldName = srcField.substring(
            srcField.indexOf('.') + 1,
            srcField.length
          )
          fieldValue['value'] = selected.get(fieldName)
        }
      } else if (fieldType === '2') {
        //如果是系统变量
        // fieldValue["value"] = viewContext.getSystemVariableValue(srcField);
        fieldValue['value'] = componentParam.getVariant({
          code: srcField
        })
      } else if (fieldType === '3') {
        //如果是组件变量
        // fieldValue["value"] = viewContext.getVariableValue(srcField);
        fieldValue['value'] = windowParam.getInput({
          code: srcField
        })
      } else if (fieldType === '4' || fieldType === 'expression') {
        //如果是表达式
        // fieldValue["value"] = formulaUtil.evalExpression(srcField);

        context = new ExpressionContext()
        let routeRuntime = rulecontext.getRouteContext()
        context.setRouteContext(routeRuntime)

        fieldValue['value'] = engine.execute({
          expression: srcField,
          context: context
        })
      }
      returnValue.push(fieldValue)
    }
  }
  return returnValue
}
//规则主入口(必须有)
const main = function (ruleContext) {
  rulecontext = ruleContext
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let numCountFormula = inParamsObj['NumCount']
  //初始值来源的映射信息
  let mappings = inParamsObj['Mappings']
  //增加记录的数据源的主表
  let masterTable = inParamsObj['MasterTable']
  //增加记录的数据源
  let tableName = inParamsObj['TableName']
  //实体类型
  let EntityType = inParamsObj['TableType']
  //增加是否先生成数据ID标识
  let isCreateRe = inParamsObj['IsCreateRe']
  let position = inParamsObj['AddLocation']
  if (!position) {
    position = '3'
  }
  let datasource = getDataSource(tableName, ruleContext, EntityType) //根据类型获取数据源
  context = new ExpressionContext()
  let routeRuntime = ruleContext.getRouteContext()
  context.setRouteContext(routeRuntime)
  let numCount = engine.execute({
    expression: numCountFormula,
    context: context
  })

  if (isNaN(numCount)) {
    dialogUtil.propmtDialog('表达式执行结果不合法，请检查表达式！', null, false)
    return false
  }
  if (numCount <= 0) {
    return
  }
  if (undefined == EntityType || EntityType == 'window') {
    //判断是否是单值，是单值时清空原来的数据, 多值的话不需要清空
    let isSingle = isSingleStoreTypeByDataSource(tableName)
    if (isSingle) {
      datasource.clear({ fireEvent: false }) //_resetDSRecursion(datasource, false);
      if (numCount > 1) {
        //rendererUtil.propmtDialog("单值控件不允许一次插入多条数据！", false);
        dialogUtil.propmtDialog('单值控件不允许一次插入多条数据！', null, false)
        return false
      }
    }
  }

  let insertRecords = null
  if (masterTable) {
    //如果主表不为空
    //var selectedData = viewModel.getDataModule().getCurrentRowByDS(masterTable);
    let selectedData = datasourcemanager
      .lookup({
        datasourceName: masterTable
      })
      .getCurrentRecord()
    if (!selectedData) {
      //rendererUtil.propmtDialog("新增记录发生错误：关联父表没有选中记录！", false);
      dialogUtil.propmtDialog(
        '新增记录发生错误：关联父表没有选中记录！',
        null,
        false
      )
      return false
    }
  }
  let insertOper = new AddTableRecord(tableName, numCount)

  let defaultValue = _getDefaultValue(datasource, mappings, tableName)
  //        if((isCreateRe + "").toLowerCase() == "true") {
  //            var responseCallBack = function(result) {
  //                if(result.success != true) {
  //                    //rendererUtil.propmtDialog("新增保存失败!请检查数据有效性！", false);
  //					dialogUtil.propmtDialog("新增保存失败!请检查数据有效性！", null, false);
  //                }
  //            };
  //            insertRecords = insertOper.insertRecordsAndSubmit(defaultValue, position, responseCallBack);
  //        } else {
  //            insertRecords = insertOper.insertRecords(defaultValue, position);
  //        }
  insertRecords = insertOper.insertRecords(datasource, defaultValue, position)
}
/**
 * 获取数据源
 * @param ds 数据源名称
 * @param ruleContext 规则上下文
 * @param EntityType 实体类型
 */
let getDataSource = function (ds, ruleContext, EntityType) {
  let dsName = ds
  let datasource = null
  if (undefined == EntityType || EntityType == 'window') {
    datasource = datasourcemanager.lookup({
      datasourceName: dsName
    })
  } else {
    switch (EntityType) {
      case 'ruleSetInput':
        dsName = 'BR_IN_PARENT.' + dsName
        break
      case 'ruleSetVar':
        dsName = 'BR_VAR_PARENT.' + dsName
        break
      case 'ruleSetOutput':
        dsName = 'BR_OUT_PARENT.' + dsName
        break
    }
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    datasource = engine.execute({
      expression: dsName,
      context: context
    })
  }
  if (!datasource)
    throw new Error(
      '规则[AddTableRecord]：找不到参数中的实体！实体编码：' + dsName
    )
  return datasource
}

export { main }
