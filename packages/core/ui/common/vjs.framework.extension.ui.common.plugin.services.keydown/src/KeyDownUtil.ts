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
    //@ts-ignore
    eventArgs.KeyCode = event.keyCode
    args.push(eventArgs)
    //@ts-ignore
    if (event.keyCode == 13) {
      //@ts-ignore
      syncFunc.call(this)
    }
    //@ts-ignore
    handler.apply(this, args)
  }
}

export { handleKeyDown }
