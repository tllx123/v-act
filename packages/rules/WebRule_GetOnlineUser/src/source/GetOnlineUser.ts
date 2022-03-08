import * as log from 'module'
import * as operationLib from 'module'
import * as rendererUtil from 'module'
import * as viewModel from 'module'

import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}
const main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)

  let dsName = inParamObj.dsName
  let isClearData = inParamObj.isClearData
  let mapping = inParamObj.mapping

  if (isEmpty(isClearData)) isClearData = 'false'

  let errorMsg = null
  if (isEmpty(dsName)) errorMsg = '目标实体不能为空'
  if (mapping == null || mapping.length == 0) {
    if (!isEmpty(errorMsg)) errorMsg += ','
    errorMsg = '实体字段映射不能为空'
  }

  if (!isEmpty(errorMsg)) {
    log.error(errorMsg)
    rendererUtil.errorDialog(errMsg)
    return false
  }
  // 赋值前清空原有数据
  if (isClearData == true || isClearData == 'true')
    viewModel.getDataModule().removeAllRecordsByDS(dsName)

  // 用户信息系统变量名与实体字段映射
  let sysVarNames = []
  for (let i = 0; mapping != null && i < mapping.length; i++) {
    sysVarNames[i] = mapping[i].sysVarName
  }
  let param = {
    systemVariableNames: sysVarNames
  }

  let paramData = jsonUtil.obj2json(param)
  // var result = viewOperation.doRequest(viewContext.getModuleId(),"GlobalLoginInfoGetter", paramData);

  let inputParams = {
    // ruleSetCode为活动集编号
    ruleSetCode: 'CommonRule_GetOnlineUser',
    // params为活动集输入参数
    params: {
      //				"InParams" : jsonUtil.obj2json(paramData)
      InParams: paramData
    }
  }
  let callback = function (responseObj) {
    let outputResult = responseObj.data.result
    let success = outputResult.IsSuccess.value
    if (!success) {
      throw new Error('获取在线用户数据出错')
    } else {
      let outDataResult = outputResult.OutData.value
      let arrOutData = jsonUtil.json2obj(outDataResult)
      let newRecords = []
      let emptyRecord = viewModel.getDataModule().createEmptyRecordByDS(dsName)
      for (let k = 0; arrOutData != null && k < arrOutData.length; k++) {
        let objVal = arrOutData[k]
        if (
          objVal.systemVariables == null ||
          objVal.systemVariables.length == 0
        )
          continue
        let sysVarValues = getSysVarValuesFrom(objVal.systemVariables)

        let newRecord = emptyRecord.createNew()
        // 用户信息系统变量名与实体字段映射
        for (let i = 0; mapping != null && i < mapping.length; i++) {
          let fieldName = mapping[i].fieldName
          let sysVarName = mapping[i].sysVarName

          let userInfo_sysVarValue = sysVarValues[sysVarName]

          let realFieldName = fieldName
          if (fieldName.indexOf('.') > 0)
            realFieldName = fieldName.split('.')[1]
          let realFieldValue = userInfo_sysVarValue

          newRecord.set(getFieldName(fieldName), realFieldValue)
        }
        newRecords.push(newRecord)
      }
      if (newRecords != null && newRecords.length > 0)
        viewModel.getDataModule().insertByDS(dsName, newRecords)
    }
  }
  operationLib.executeRuleSet(inputParams, callback)

  // if (!result.success == true) {
  // throw new Error("获取在线用户数据数据出错");
  // }
  //
  // var newRecords=[];
  // var emptyRecord =
  // viewModel.getDataModule().createEmptyRecordByDS(dsName);
  // for(var k=0;result.data!=null && k<result.data.length;k++)
  // {
  // var objVal=result.data[k];
  // if(objVal.systemVariables==null ||
  // objVal.systemVariables.length==0)
  // continue;
  // var sysVarValues=getSysVarValuesFrom(objVal.systemVariables);
  //
  // var newRecord = emptyRecord.createNew();
  // //用户信息系统变量名与实体字段映射
  // for(var i=0;mapping!=null && i<mapping.length;i++){
  // var fieldName=mapping[i].fieldName;
  // var sysVarName=mapping[i].sysVarName;
  //
  // var userInfo_sysVarValue=sysVarValues[sysVarName];
  //
  // var realFieldName=fieldName;
  // if(fieldName.indexOf(".")>0)
  // realFieldName=fieldName.split(".")[1];
  // var realFieldValue=userInfo_sysVarValue;
  //
  // newRecord.set(getFieldName(fieldName) ,realFieldValue);
  // }
  // newRecords.push(newRecord) ;
  // }
  // if(newRecords!=null && newRecords.length>0)
  // viewModel.getDataModule().insertByDS(dsName, newRecords);
}

let getFieldName = function (fieldName) {
  if (fieldName != null && fieldName.indexOf('.') > 0)
    return fieldName.split('.')[1]
  return fieldName
}

function isEmpty(obj) {
  return obj == null || obj == ''
}

function getSysVarValuesFrom(systemVariables) {
  let ret = []
  for (let i = 0; systemVariables != null && i < systemVariables.length; i++) {
    ret[systemVariables[i].name] = systemVariables[i].value
  }
  return ret
}

export { main }
