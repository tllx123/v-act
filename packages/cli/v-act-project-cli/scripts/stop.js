const { stop } = require('@v-act/cli-utils')
stop()
const cache = require('@v-act/cache').get('v-act-project-cli')
const processPids = cache.get('processPids') || []
processPids.forEach((pid) => {
  try {
    process.kill(pid)
  } catch (e) {}
})
