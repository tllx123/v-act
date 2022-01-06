#!/usr/bin/env node

const path = require('path')
const index = require('../src/index')
const Cache = require('../src/utils/Cache')
const cache = require('@v-act/cache').get('v-act-v3dev-component-watcher')
const pid = cache.get('WatcherPropcessPid')
if (pid) {
  try {
    process.kill(pid)
  } catch (e) {}
}
cache.put('WatcherPropcessPid', process.pid)
cache.save()
Cache.scanVActWidgets()
const cwd = process.cwd()
index.watch(path.resolve(cwd, 'v3dev'))
