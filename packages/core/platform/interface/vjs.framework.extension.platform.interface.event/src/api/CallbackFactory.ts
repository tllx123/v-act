import * as Callback from './api/Callback'

let undefined

exports.initModule = function (sb) {}

exports.Types = {
  Success: 'Success',
  Fail: 'Fail'
}

const create = function (params) {
  return new Callback(params.type, params.handler)
}

const isCallback = function (inst) {
  return inst instanceof Callback
}

export { create, isCallback }
