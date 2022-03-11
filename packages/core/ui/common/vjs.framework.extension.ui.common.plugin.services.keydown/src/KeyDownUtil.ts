let sandbox:any

export function initModule(sb:any) {
  sandbox = sb
}

/**
 * 处理控件键盘按下事件
 */
let handleKeyDown = function (widgetCode:string, eventName:string) {
  let eventManager = sandbox.getService(
    'vjs.framework.extension.platform.services.view.event.EventManager'
  )
  let handler = eventManager.fireEvent(widgetCode, eventName)
  let syncFunc = eventManager.fireEvent(widgetCode, 'DBUpdate')
  return function () {
    let args = []
    for (let i = 0, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    let eventArgs = {
      isPrimitive: false,
      KeyCode:''
    }
    eventArgs.KeyCode = event.keyCode
    args.push(eventArgs)
    if (event.keyCode == 13) {
      syncFunc.call(this)
    }
    handler.apply(this, args)
  }
}

export { handleKeyDown }
