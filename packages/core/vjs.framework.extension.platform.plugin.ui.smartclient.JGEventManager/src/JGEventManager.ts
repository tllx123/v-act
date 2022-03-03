exports.initModule = function (sBox) {
  isc.ClassFactory.defineInterface('JGEventManager')
  isc.JGEventManager.addInterfaceMethods({
    on: function (eventName, handler) {
      if (this.listener.hasOwnProperty(eventName)) {
        let handlers = this.listener[eventName]
        handlers.push(handler)
      } else {
        throw Error(
          '控件[' + this.getClassName() + ']不支持[' + eventName + ']事件！'
        )
      }
    },
    un: function (eventName) {
      if (this.listener.hasOwnProperty(eventName)) {
        this.listener[eventName] = []
      } else {
        throw Error(
          '控件[' + this.getClassName() + ']不支持[' + eventName + ']事件！'
        )
      }
    }
  })
}
