﻿/**
 * 校验验证码
 * */
function getCookie(name: string) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

import * as environment from '@v-act/vjs.framework.extension.platform.services.integration.vds.environment'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as message from '@v-act/vjs.framework.extension.platform.services.integration.vds.message'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

interface datas {
  success: boolean
  msg: string
}

interface result {
  [key: string]: any
}

interface responseObj {
  [key: string]: any
}

// 规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise((resolve, reject) => {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      //图片组件ID
      var widgetId = inParamsObj['picId']
      //生成目标：imageControl(图片控件), fileID（文件标识）
      var buildTargetType =
        'fileID' == inParamsObj['buildTargetType'] ? 'fileID' : 'imageControl'
      var fileIDReceiveTargetType = inParamsObj['fileIDReceiveTargetType']
        ? inParamsObj['fileIDReceiveTargetType']
        : null
      var valueTarget = inParamsObj['fileIDReceiveTarget']
      //是否重置
      var isReset = inParamsObj['isReset']
      //输入的验证码
      var inputCode = expression.execute(inParamsObj['inputCode'], {
        ruleContext: ruleContext
      })

      var iden = getCookie('v_platform_make_code_iden')

      inParamsObj.inputCode = inputCode
      //文件标识
      inParamsObj.fileId = iden

      if (
        undefined == inputCode ||
        null == inputCode ||
        undefined == widgetId ||
        null == widgetId
      ) {
        if ('fileID' != buildTargetType) {
          //设置返回值
          setBusinessRuleResult(ruleContext, false, resolve)
          return
        }
      }

      var outFlag = false
      var callback = function (responseObj: responseObj) {
        var successTemp = responseObj.IsSuccess
        if (!successTemp) {
          HandleException('session过期或生成的验证码为空，请重新生成验证码.')
        }

        outFlag = responseObj.OutFlag
        if (!outFlag) {
          //如果选中重置调用重新生成验证码
          if (isReset) {
            var iden = string.uuid()
            document.cookie = 'v_platform_make_code_iden=' + iden
            if ('fileID' == buildTargetType) {
              var success = function (datas: datas) {
                switch (fileIDReceiveTargetType) {
                  case 'ruleSetInput':
                    ruleContext.getMethodContext().setInput(valueTarget, iden)
                    break
                  case 'ruleSetVar':
                    ruleContext
                      .getMethodContext()
                      .setVariable(valueTarget, iden)
                    break
                  case 'ruleSetOutput':
                    ruleContext.getMethodContext().setOutput(valueTarget, iden)
                    break
                }
              }

              rpc.callCommandSync('FileCertImage', [], {
                isAsync: false,
                CertPicCode: iden,
                success: function (datas: datas) {
                  if (datas && datas.success) {
                    success(datas)
                    setBusinessRuleResult(ruleContext, outFlag, resolve)
                  } else {
                    var result = message.error(
                      '生成验证码失败' +
                        (datas.msg ? ', 错误信息：' + datas.msg : '')
                    )
                    result
                      .then(function () {
                        setBusinessRuleResult(ruleContext, outFlag, resolve)
                      })
                      .catch(reject)
                  }
                },
                fail: reject
              })
            } else {
              var moduleId = window.getCode()
              //xx参数防止图片组件接受相同地址时不刷新问题
              var url =
                environment.getContextPath() +
                'module-operation!executeOperation?moduleId=' +
                moduleId +
                '&operation=FileCertImage&xx=' +
                iden
              widget.execute(widgetId, 'setImageUrl', [url])
              //设置返回值
              setBusinessRuleResult(ruleContext, outFlag, resolve)
            }
          } else {
            //设置返回值
            setBusinessRuleResult(ruleContext, outFlag, resolve)
          }
        } else {
          //设置返回值
          setBusinessRuleResult(ruleContext, outFlag, resolve)
        }
      }

      var sConfig = {
        command: 'CommonRule_CheckCertCode',
        datas: [
          {
            code: 'InParams',
            type: 'char',
            value: string.toJson(inParamsObj)
          }
        ],
        params: { isAsyn: false, ruleContext: ruleContext }
      }
      var promise = rpc.callCommand(
        sConfig.command,
        sConfig.datas,
        sConfig.params
      )
      promise
        .then(() => {
          callback
        })
        .catch(reject)

      /** 异常处理方法
       * @ruleContext 规则上下文
       * @error_msg 提示信息
       * */
      function HandleException(error_msg: string) {
        let exceptionTemp = exception.newBusinessException(error_msg)
        exception.handle(exceptionTemp)
        throw exceptionTemp
      }

      /** 设置规则返回结果
       */
      function setBusinessRuleResult(
        ruleContext: RuleContext,
        result: boolean,
        resolve: (value: unknown) => void
      ) {
        if (ruleContext.setResult) {
          ruleContext.setResult('isValidateOK', result)
        }
        resolve('')
      }
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
