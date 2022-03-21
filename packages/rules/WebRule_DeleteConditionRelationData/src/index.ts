/**
 * 删除数据库中的记录
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, log, object, rpc, string }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParamsObj: { (x: string): any } = ruleContext.getVplatformInput()
      var dtChileMaps: undefined | null | any[] = inParamsObj['dtChileMaps']
      var treeStructs: any[] = inParamsObj['treeStruct']

      var treeStruct = null
      if (
        //@ts-ignore
        !vds.object.isArray(treeStructs) ||
        //@ts-ignore
        (vds.object.isArray(treeStructs) && treeStructs.length < 1)
      ) {
        treeStruct = null
      } else {
        treeStruct = treeStructs[0]
      }

      // 组装后台删除数据条件
      var isDelete = false // 后台是否删除数据标记位
      if (
        undefined != dtChileMaps &&
        null != dtChileMaps &&
        dtChileMaps.length > 0
      ) {
        for (var i = 0; i < dtChileMaps.length; i++) {
          var delCfg: Record<string, any> = dtChileMaps[i]
          var dsWhere: string = delCfg.dsWhere
          delCfg['sql'] = null
          if (undefined != dsWhere && null != dsWhere && dsWhere.length > 0) {
            // 有进行字段的配置，按照配置生成条件sql
            var w: {
              addCondition: (x: string) => void
              toWhere: () => string
              toParameters: () => string
            } = vds.ds.createWhere({
              methodContext: ruleContext.getMethodContext()
            })
            w.addCondition(dsWhere)
            delCfg['sql'] = w.toWhere()
            delCfg['parameters'] = w.toParameters()
          } else {
            // TODO:预留 没有附加条件时，是否需要进行其他处理
          }
        }
        isDelete = true
      }
      inParamsObj['isDelete'] = isDelete

      var isSave: boolean = false // 后台是否需要保存标记位
      var changeDsArr: any[] = [] // 保存的删除数据源
      inParamsObj['isSave'] = isSave

      // 调用完活动集之后的回调方法
      var callback: any = function (responseObj: { IsSuccess: boolean }) {
        try {
          var success: boolean = responseObj.IsSuccess
          if (success != true) {
            throw new Error('删除数据失败')
          }
          // 重新设置页面删除的标记位
          if (changeDsArr) {
            for (
              var changeIndex = 0;
              changeIndex < changeDsArr.length;
              changeIndex++
            ) {
              var datasource = vds.ds.lookup(changeDsArr[changeIndex])
              datasource && datasource.clearRemoveDatas()
            }
          }

          resolve()
        } catch (ex) {
          reject(ex)
        }
      }

      var errorCallback: any = function (responseObj: { message: string }) {
        vds.log.error(responseObj.message)
        reject(responseObj)
      }

      var sConfig = {
        command: 'CommonRule_DeleteConditionRelationData',
        datas: [
          {
            code: 'SaveAndDeleteConfig',
            type: 'char',
            value: vds.string.toJson(inParamsObj)
          }
        ],
        params: { isAsyn: true, ruleContext: ruleContext }
      }
      var promise = vds.rpc.callCommand(
        sConfig.command,
        sConfig.datas,
        sConfig.params
      )
      promise.then(callback).catch(errorCallback)

      return true
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
