import Callback from './Callback'

const Types = {
  Success: 'Success',
  Fail: 'Fail'
}

const create = function (params: {
  type: string
  handler: (...args: any[]) => void
}) {
  return new Callback(params.type, params.handler)
}

const isCallback = function (inst: any) {
  return inst instanceof Callback
}

export { create, isCallback, Types }
