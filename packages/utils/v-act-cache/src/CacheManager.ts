import { existsSync, unlinkSync } from 'fs'
import { resolve } from 'path'

import Cache from './Cache'

const MEMERY_CACHE_POOL: { [pops: string]: Cache } = {}

const _getSavePath = function (namespace: string) {
  return resolve(__dirname, 'storage', namespace + '.json')
}

const get = function (namespace: string): Cache {
  if (MEMERY_CACHE_POOL[namespace]) {
    return MEMERY_CACHE_POOL[namespace]
  }
  const cache = new Cache(_getSavePath(namespace))
  MEMERY_CACHE_POOL[namespace] = cache
  return cache
}

const clear = function (namespace: string): void {
  const cache = MEMERY_CACHE_POOL[namespace]
  if (cache) {
    cache.clear()
  }
}

const remove = function (namespace: string) {
  delete MEMERY_CACHE_POOL[namespace]
  const savePath = _getSavePath(namespace)
  if (existsSync(savePath)) {
    unlinkSync(savePath)
  }
}

export { clear, get, remove }
