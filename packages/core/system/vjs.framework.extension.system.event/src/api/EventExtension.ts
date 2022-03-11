import EventEmitter2 from '../impl/eventemitter2'

let EEInstancePool: { [code: string]: any } = {}

const getInstance = function (name: string) {
  if (!EEInstancePool[name]) {
    EEInstancePool[name] = new EventEmitter2({
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
