/**
 *	生成验证码
 */
/*
vds.import(
  'vds.window.*',
  'vds.string.*',
  'vds.rpc.*',
  'vds.message.*',
  'vds.environment.*',
  'vds.widget.*'
)
*/
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as environment from '@v-act/vjs.framework.extension.platform.services.integration.vds.environment'
import * as message from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const vds = { window, string, widget, rpc, environment, message }

/**
 * 规则入口
 */
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      if (!inParamsObj) {
        //建议兼容
        inParamsObj = ''
      }
      var widgetId = inParamsObj['picCode']
      var buildTargetType =
        'fileID' == inParamsObj['buildTargetType'] ? 'fileID' : 'imageControl'
      var fileIDReceiveTargetType = inParamsObj['fileIDReceiveTargetType']
        ? inParamsObj['fileIDReceiveTargetType']
        : null
      var valueTarget = inParamsObj['fileIDReceiveTarget']
      var moduleId = vds.window.getCode()
      var iden = vds.string.uuid()
      document.cookie = 'v_platform_make_code_iden=' + iden
      if ('fileID' == buildTargetType) {
        var success = function () {
          var methodContext = ruleContext.getMethodContext()
          switch (fileIDReceiveTargetType) {
            case 'ruleSetInput':
              methodContext.setInput(valueTarget, iden)
              break
            case 'ruleSetVar':
              methodContext.setVariable(valueTarget, iden)
              break
            case 'ruleSetOutput':
              methodContext.setOutput(valueTarget, iden)
              break
          }
          resolve()
        }
        //原规则同步，暂时不能调用异步
        var promise = vds.rpc.callCommandSync('FileCertImage', [], {
          isAsync: false,
          isRuleSetCode: false,
          success: function (datas) {
            if (datas && datas.success) {
              success()
            } else {
              var promise = vds.message.error(
                '生成验证码失败' + (datas.msg ? ', 错误信息：' + datas.msg : '')
              )
              promise.then(resolve).catch(reject)
            }
          },
          fail: reject
        })
        // promise.then(function (datas) {
        // 	if (datas && datas.success) {
        // 		success();
        // 	} else {
        // 		var promise = vds.message.error("生成验证码失败" + (datas.msg ? ", 错误信息：" + datas.msg : ""));
        // 		promise.then(resolve).catch(reject);
        // 	}
        // }).catch(reject);
      } else {
        //xx参数防止图片组件接受相同地址时不刷新问题
        var url =
          vds.environment.getContextPath() +
          'module-operation!executeOperation?moduleId=' +
          moduleId +
          '&operation=FileCertImage&xx=' +
          vds.string.uuid()
        vds.widget.execute(widgetId, 'setImageUrl', [url])
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
