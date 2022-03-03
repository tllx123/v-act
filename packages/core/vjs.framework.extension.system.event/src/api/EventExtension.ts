import * as EE from './impl/eventemitter2'

let undefined
let EEInstancePool = {}
exports.initModule = function () {}

const getInstance = function (name) {
  if (!EEInstancePool[name]) {
    EEInstancePool[name] = new EE.EventEmitter2({
      //
      // use wildcards.
      //
      wildcard: true,
      //
      // the delimiter used to segment namespaces, defaults to `.`.
      //
      delimiter: '.',
      //
      // if you want to emit the newListener event set to true.
      //
      newListener: false,
      //
      // max listeners that can be assigned to an event, default 10.
      //
      maxListeners: 5000
    })
  }
  return EEInstancePool[name]
}

export { getInstance }
