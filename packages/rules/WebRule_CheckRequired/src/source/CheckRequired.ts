import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { MapUtil as mapUtil } from '@v-act/vjs.framework.extension.util'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { EasyTemplateUtil as easyTemplateUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let sb
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {
  sb = sBox
}

let executeExpress = function (ruleContext, value) {
  if (null == value || '' == value) return value
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  let result = formulaUtil.execute({
    expression: value,
    context: context
  })
  return result
}

// 规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则上下文中的规则配置值
  let ruleCfgValue = ruleContext.getRuleCfg()
  // 处理规则配置值
  let inParams = ruleCfgValue['inParams']
  let inParamsObjs = jsonUtil.json2obj(inParams)
  let validatorItems = inParamsObjs['fieldList']
  //{"fieldList":[{"chineseName":"FieldData1","field":"HT_QYZZ.FieldData1"},{"chineseName":"FieldData4","field":"HT_HTJS.FieldData4"}],"type":"0"}
  let messageType = inParamsObjs['type']
  // 根据key获取规则配置参数值
  let checkMsgs = []

  let tableFieldsMap = new mapUtil.Map()
  /* 问题实体 */
  let errorQuired = []
  if (validatorItems != null && validatorItems.length > 0) {
    for (let index = 0; index < validatorItems.length; index++) {
      let columns = validatorItems[index]
      let columnName = columns['field']
      let array = columnName.split('.')
      let dsName = columnName.substring(0, columnName.indexOf('.'))
      let filedName = array[1]
      let key = dsName.toLowerCase()
      let fields = tableFieldsMap.get(key)
      if (fields == null) {
        //fields=viewModel.getMetaModule().getMetadataFieldsByDS(dsName);
        fields = datasourceManager
          .lookup({
            datasourceName: dsName
          })
          .getMetadata()
          .getFields()
        tableFieldsMap.put(key, fields)
      }

      //Task20181123097：字段名称暂不支持多语言
      //				var fieldNameCN = executeExpress(ruleContext, columns.fieldName);
      //				if(null == fieldNameCN || "" == fieldNameCN){
      //					fieldNameCN = filedName;
      //				}

      let fieldNameCN = ''
      for (let i = 0; i < fields.length; i++) {
        if (filedName.toLowerCase() == fields[i].getCode().toLowerCase()) {
          fieldNameCN = fields[i].getName()
          if (null == fieldNameCN || '' == fieldNameCN) {
            fieldNameCN = fields[i].getCode()
          }
          break
        }
      }
      /*
            for (var i = 0; i < fields.length; i++) {
                if (filedName.toLowerCase() == fields[i].getCode().toLowerCase()) {
                    fieldNameCN = fields[i].getName();
                    break;
                }
            }*/

      // 如果简体中文字段名称为空，取发布数据的中文名
      /*if (stringUtil.isEmpty(fieldNameCN)){
                fieldNameCN = columns["fieldName"];
            }
            
            // 如果简体中文字段名称为空，取英文名称
            if (stringUtil.isEmpty(fieldNameCN) && columnName.indexOf(".") > 0) {
                fieldNameCN = jsTool.getFieldName(columnName);
            } */
      columnName = columnName.substring(columnName.indexOf('.') + 1)
      //	var records = viewModel.getDataModule().getAllRecordsByDS(dsName);
      let records = datasourceManager
        .lookup({ datasourceName: dsName })
        .getAllRecords()
        .toArray()
      if (records != null && records.length > 0) {
        for (let tmp = 0; tmp < records.length; tmp++) {
          let record = records[tmp]
          let value = record.get(columnName)
          if ((!value && value != 0) || stringUtil.trim(String(value)) == '') {
            if (errorQuired.indexOf(dsName) == -1) {
              errorQuired.push(dsName)
            }
            // 如果只有一行数据，不必提示第*行，来源孟要锋BUG，2013-5-28
            if (records.length == 1) {
              let tmpl = i18n.get('【${a}】必填！', '必填规则的提示信息')
              tmpl = easyTemplateUtil
                .easyTemplate(tmpl, {
                  a: fieldNameCN
                })
                .toString()
              checkMsgs.push(tmpl)
            } else {
              let tree = treeManager.lookupByName({ datasourceName: dsName })
              let tmpl = i18n.get(
                '第${a}行【${b}】必填！',
                '必填规则的提示信息'
              )
              if (tree.length > 0) {
                //树
                if (tree.length > 1) {
                  //多个树
                  throw new Error(
                    '实体' + dsName + '绑定了多个树形实例，无法进行必填项检查。'
                  )
                  return
                }
                let id = record.getSysId()
                let index = tree[0].getIndexById(id)
                tmpl = easyTemplateUtil.easyTemplate(tmpl, {
                  a: index,
                  b: fieldNameCN
                })
              } else {
                tmpl = easyTemplateUtil.easyTemplate(tmpl, {
                  a: tmp + 1,
                  b: fieldNameCN
                })
              }
              checkMsgs.push(tmpl)
            }
          }
        }
      } else {
        //TODO: luohc说没有记录不用检查，说以后要改成检查的话找他(20120627)
        //checkMsgs.push(fieldName + "必填！");
      }
    }
  }
  let userConfirm = true
  let callback = function (val) {
    userConfirm = typeof val == 'boolean' ? val : userConfirm
    setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
    ruleContext.setRuleStatus(true)
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }
  if (checkMsgs.length > 0) {
    /* 校验不通过的才尝试校验窗体内div里面的必填 */
    validateVui(errorQuired)
    if (messageType == 0) {
      //提示，继续执行
      //				widgetAction.executeComponentAction("propmtDialog", checkMsgs.join("\n"), callback, false);
      dialogUtil.propmtDialog(checkMsgs.join('\n'), callback, false)
    } else if (messageType == 1) {
      //警告，继续执行
      //				widgetAction.executeComponentAction("warnDialog", checkMsgs.join("\n"), callback, false);
      dialogUtil.warnDialog(checkMsgs.join('\n'), callback, false)
    } else if (messageType == 2) {
      //错误，不能继续
      //				widgetAction.executeComponentAction("errorDialog", checkMsgs.join("\n"), callback, false);
      dialogUtil.errorDialog(checkMsgs.join('\n'), callback, false)
    } else if (messageType == 3) {
      //询问（确定/取消），根据用户选择继续或终止
      //				widgetAction.executeComponentAction("confirmDialog", checkMsgs.join("\n") + '\n确定要继续吗？', callback, false);
      dialogUtil.confirmDialog(checkMsgs.join('\n'), callback, false)
    } else if (messageType == 4) {
      //不提示
      setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
      //ruleContext.setRuleCallbackFireFlag(false);
      return true
    } else {
      alert('--------------------')
    }
    //ruleContext.setRuleCallbackFireFlag(true);
    ruleContext.markRouteExecuteUnAuto()
  } else {
    setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
  }
  return true
}

let validateVui = function (entityCodes) {
  let windowScope = scopeManager.getWindowScope()
  let widgets = windowScope.getWidgets()
  if (widgets) {
    for (let code in widgets) {
      if (
        widgets.hasOwnProperty(code) &&
        widgets[code].type &&
        widgets[code].type == 'JGDiv'
      ) {
        widgetAction.executeWidgetAction(code, 'validate', entityCodes)
      }
    }
  }
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, result, userConfirm) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isCheckRequiredOK: result, //业务返回结果：校验是否通过
      confirm: userConfirm
    })
  }
}

export { main }
