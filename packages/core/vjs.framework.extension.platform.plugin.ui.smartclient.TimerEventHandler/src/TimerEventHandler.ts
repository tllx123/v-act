exports.initModule = function (sBox) {
  isc.ClassFactory.defineClass('TimerEventHandler')
  isc.TimerEventHandler.addClassProperties({
    actions: []
  })
  isc.TimerEventHandler.addClassMethods({
    push: function (func) {
      isc.TimerEventHandler.actions.push(func)
    },
    run_next: function () {
      while (isc.TimerEventHandler.actions.length > 0) {
        let action = isc.TimerEventHandler.actions.shift()
        action()
        setTimeout(function () {
          isc.TimerEventHandler.run_next()
        }, 10)
      }
    },
    run: function (dofun) {
      isc.TimerEventHandler.run_next()
    }
  })
}
