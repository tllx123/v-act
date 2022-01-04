#!/usr/bin/env node

const cache = require('@v-act/cache').get('v-act-v3dev-component-watcher')
const pid = cache.get('WatcherPropcessPid')
if (pid) {
  cache.remove('WatcherPropcessPid')
  cache.save()
  try {
    process.kill(pid)
  } catch (e) {}
}
