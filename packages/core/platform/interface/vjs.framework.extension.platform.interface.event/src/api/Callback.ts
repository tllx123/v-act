/**
 * @namesapce Callback
 * @class Callback
 * @desc 回调定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.event
 */
class Callback {
  type: string
  handler: (...args: any[]) => void

  constructor(type: string, handler: (...args: any[]) => void) {
    this.type = type
    this.handler = handler
  }

  getType() {
    return this.type
  }

  getHandler() {
    return this.handler
  }
}

export default Callback
