import { Control } from '@v-act/schema-types'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

export default function eventHandler(params: Record<string, any>) {
  const {
    scopeId: instanceId,
    winDatas: { controls }
  } = params
  if (controls && controls.length > 0) {
    controls.forEach((control: any) => {
      _enhanceControl(control, instanceId)
    })
  }
}

const _enhanceControl = function (control: Control, instanceId: string) {
  const properties = control.properties
  const controlCode = properties.code

  if (Array.isArray(control.event)) {
    control.event.forEach((item: any) => {
      scopeManager.openScope(instanceId)
      const triggerEvent = item.eventCode
      const evaluateRule = item.evaluateRule

      const $addEventHandler = eventManager.addEventHandler
      const $executeRouteRule = ruleEngine.executeRouteRule

      try {
        $addEventHandler(controlCode, triggerEvent, function () {
          $executeRouteRule({
            ruleSetCode: triggerEvent,
            ruleCode: evaluateRule,
            args: arguments,
            argMapping: {},
            argIndex: {}
          })
        })
      } catch (error) {
        console.error(
          `vjs.framework.extension.publish.window.render.smartclient.viewlib报错了：${error}`
        )
      } finally {
        scopeManager.closeScope()
      }
    })
  }

  const controls = control.controls
  if (controls && controls.length > 0) {
    controls.forEach((con) => {
      _enhanceControl(con, instanceId)
    })
  }
}
