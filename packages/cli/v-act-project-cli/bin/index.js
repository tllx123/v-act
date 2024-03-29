#!/usr/bin/env node

const spawn = require('react-dev-utils/crossSpawn')
const utils = require('@v-act/utils')
const cache = require('@v-act/cache').get('v-act-project-cli')
const processPids = cache.get('processPids') || []
processPids.push(process.pid)
cache.put('processPids', processPids)

const args = process.argv.slice(2)
const scripts = [
  'build',
  'start',
  'stop',
  'test',
  'clear',
  'apply',
  'publish',
  'install',
  'pack',
  'preinstall'
]

const scriptIndex = args.findIndex((x) => scripts.indexOf(x) != -1)

const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

if (scripts.indexOf(script) != -1) {
  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    {
      stdio: 'inherit'
    }
  )
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      utils.Console.debug(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      )
    } else if (result.signal === 'SIGTERM') {
      utils.Console.debug(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      )
    }
    process.exit(1)
  }
  process.exit(result.status)
} else {
  utils.Console.error('未知脚本："' + script + '"，请检查输入！')
}
