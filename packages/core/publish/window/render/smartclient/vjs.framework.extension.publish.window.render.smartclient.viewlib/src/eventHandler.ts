import { Control, ControlSchema } from '@v-act/schema-types'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

export default function eventHandler(params: Record<string, any>) {
  const {
    scopeId: instanceId,
    winDatas: { controls }
  } = params
  if (controls && controls.control) {
    let controlList = controls.control
    controlList = Array.isArray(controlList) ? controlList : [controlList]
    controlList.forEach((control: any) => {
      _enhanceControl(control, instanceId)
    })
  }
}

const _enhanceControl = function (control: ControlSchema, instanceId: string) {
  const controlCode = control.$.code
  if (control.events && control.events.event) {
    let eventList = control.events.event
    eventList = Array.isArray(eventList) ? eventList : [eventList]
    eventList.forEach((item: any) => {
      if (
        item &&
        item.$ &&
        item.$.code &&
        item.evaluateRule &&
        item.evaluateRule.$ &&
        item.evaluateRule.$.code
      ) {
        scopeManager.openScope(instanceId)
        const triggerEvent = item.$.code
        const evaluateRule = item.evaluateRule.$.code
        try {
          eventManager.addEventHandler(controlCode, triggerEvent, function () {
            ruleEngine.executeRouteRule({
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
      }
    })
  }

  if (control.controls && control.controls.control) {
    let controlList = control.controls.control
    controlList = Array.isArray(controlList) ? controlList : [controlList]
    controlList.forEach((con) => {
      _enhanceControl(con, instanceId)
    })
  }
}
