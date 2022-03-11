/**
 *  必填项检查
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as i18n from '@v-act/vjs.framework.extension.platform.services.integration.vds.i18n'
import * as message from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as tree from '@v-act/vjs.framework.extension.platform.services.integration.vds.tree'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { ds, i18n, message, string, tree, widget }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      // 处理规则配置值
      let inParamsObjs = ruleContext.getVplatformInput()
      let validatorItems = inParamsObjs['fieldList']
      let messageType = inParamsObjs['type']
      // 根据key获取规则配置参数值
      let checkMsgs = []

      let tableFieldsMap: Record<string, any> = {}
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
          let fields = tableFieldsMap[key]
          if (fields == null) {
            fields = vds.ds.lookup(dsName).getMetadata().getFields()
            tableFieldsMap[key] = fields
          }

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

          columnName = columnName.substring(columnName.indexOf('.') + 1)
          let records = vds.ds.lookup(dsName).getAllRecords().toArray()
          if (records != null && records.length > 0) {
            for (let tmp = 0; tmp < records.length; tmp++) {
              let record = records[tmp]
              let value = record.get(columnName)
              if (
                (!value && value != 0) ||
                vds.string.trim(String(value)) == ''
              ) {
                if (errorQuired.indexOf(dsName) == -1) {
                  errorQuired.push(dsName)
                }
                // 如果只有一行数据，不必提示第*行，来源孟要锋BUG，2013-5-28
                if (records.length == 1) {
                  let tmpl = vds.i18n.get(
                    '【${a}】必填！',
                    '必填规则的提示信息'
                  )
                  tmpl = vds.string
                    .template(tmpl, {
                      a: fieldNameCN
                    })
                    .toString()
                  checkMsgs.push(tmpl)
                } else {
                  let tree = vds.tree.getAll(dsName)
                  let strTmpl = vds.i18n.get(
                    '第${a}行【${b}】必填！',
                    '必填规则的提示信息'
                  )
                  let tmpl
                  if (tree.length > 0) {
                    //树
                    if (tree.length > 1) {
                      //多个树
                      throw new Error(
                        '实体' +
                          dsName +
                          '绑定了多个树形实例，无法进行必填项检查。'
                      )
                    }
                    let id = record.getSysId()
                    let treeIndex = tree[0].getIndexById(id)
                    tmpl = vds.string.template(strTmpl, {
                      a: treeIndex,
                      b: fieldNameCN
                    })
                  } else {
                    tmpl = vds.string.template(strTmpl, {
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
      let callback = function (val: any) {
        userConfirm = typeof val == 'boolean' ? val : userConfirm
        setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
        resolve()
      }
      if (checkMsgs.length > 0) {
        /* 校验不通过的才尝试校验窗体内div里面的必填 */
        validateVui(errorQuired)
        if (messageType == 0) {
          //提示，继续执行
          let promise = vds.message.info(checkMsgs.join('\n'), { time: 0 })
          promise.then(callback).catch(reject)
        } else if (messageType == 1) {
          //警告，继续执行
          let promise = vds.message.warn(checkMsgs.join('\n'))
          promise.then(callback).catch(reject)
        } else if (messageType == 2) {
          //错误，不能继续
          let promise = vds.message.error(checkMsgs.join('\n'))
          promise.then(callback).catch(reject)
        } else if (messageType == 3) {
          //询问（确定/取消），根据用户选择继续或终止
          let promise = vds.message.confirm(checkMsgs.join('\n'))
          promise.then(callback).catch(reject)
        } else if (messageType == 4) {
          //不提示
          setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
          resolve()
        } else {
          alert('--------------------')
          resolve()
        }
      } else {
        setBusinessRuleResult(ruleContext, checkMsgs.length == 0, userConfirm)
        resolve()
      }
    } catch (ex) {
      reject(ex)
    }
  })
}

let validateVui = function (entityCodes: any) {
  let codes = vds.widget.getWidgetCodesByType('JGDiv')
  for (let code in codes) {
    vds.widget.execute(code, 'validate', [entityCodes])
  }
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(
  ruleContext: RuleContext,
  result: any,
  userConfirm: any
) {
  if (ruleContext.setResult) {
    ruleContext.setResult('isCheckRequiredOK', result)
    ruleContext.setResult('confirm', userConfirm)
  }
}
export { main }
