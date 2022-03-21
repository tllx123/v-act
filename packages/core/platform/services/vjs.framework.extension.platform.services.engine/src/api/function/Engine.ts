import { FunctionEngine } from '@v-act/vjs.framework.extension.platform.engine.function'

const execute = function (params: any) {
  return FunctionEngine.execute(params)
}

export { execute }
