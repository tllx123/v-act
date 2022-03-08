﻿/**
 * 获取当前位置的经纬度
 */

import * as app from '@v-act/vjs.framework.extension.platform.services.integration.vds.app'
const vds = { app }

const main = function (ruleContext) {
  return new Promise(function (resolve, reject) {
    try {
      var success = function (result) {
        if (ruleContext.setResult) {
          //纬度
          ruleContext.setResult('latitude', result.coords.latitude)
          //经度
          ruleContext.setResult('longitude', result.coords.longitude)
          ruleContext.setResult('isSuccess', true)
        }
        resolve()
      }
      var error = function (result) {
        if (ruleContext.setResult) {
          ruleContext.setResult('isSuccess', false)
        }
        resolve()
      }
      var promise = vds.app.getCurrentPosition()
      promise.then(success).catch(error)
    } catch (ex) {
      reject(ex)
    }
  })
}

export { main }
