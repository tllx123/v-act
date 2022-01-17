const { startProject } = require('@v-act/cli-utils')
const cache = require('@v-act/cache').get('v-act-project-cli')
const processPids = cache.get('processPids') || []
processPids.push(process.pid)
cache.put('processPids', processPids)
cache.save()
startProject()
