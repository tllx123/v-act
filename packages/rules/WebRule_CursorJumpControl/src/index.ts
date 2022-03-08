﻿/**
 * 光标跳转控制
 * 当条件满足时跳转光标到指定的控件
 */

import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { exception, widget }

const main = function (ruleContext) {
  return new Promise(function (resolve, reject) {
    try {
      var inParamObj = ruleContext.getVplatformInput()
      var widgetId = inParamObj['ControlCode']
      if (!widgetId) {
        throw vds.exception.newConfigException(
          '光标跳转规则中配置参数控件ID不能为空！'
        )
      }
      vds.widget.execute(widgetId, 'setFocus', [widgetId])
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

exports.main = main

export { main }
