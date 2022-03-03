import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

let undefined

exports.initModule = function (sb) {}

let handleKeyDown = function (widgetCode, eventName) {
  let handler = eventManager.fireEvent(widgetCode, eventName)
  let syncFunc = eventManager.fireEvent(widgetCode, 'DBUpdate')
  return function () {
    let args = []
    for (let i = 0, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    let eventArgs = {
      isPrimitive: false
    }
    eventArgs.KeyCode = event.keyCode
    args.push(eventArgs)
    if (event.keyCode == 13) {
      syncFunc.call(this)
    }
    handler.apply(this, args)
  }
}

export { loadDropDownSourceFromEntity, handleKeyDown }
