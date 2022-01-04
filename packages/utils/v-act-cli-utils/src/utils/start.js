const childProcess = require('child_process')
const path = require('path')
const program = require('commander')
const cache = require('@v-act/cache').get('v-act-cli-utils')
program.option('-p, --port <port>', '端口号')
const startProcCacheKey = 'StartProcessPid'

function _start(command) {
  const pid = cache.get(startProcCacheKey)
  if (pid) {
    try {
      process.kill(pid)
    } catch (e) {}
  }
  proc = childProcess.exec(
    command,
    {
      cwd: process.cwd()
    },
    function (err, stdout, stderr) {
      if (err) {
        throw err
      }
    }
  )
  cache.put(startProcCacheKey, proc.pid)
  cache.save()
  proc.stdout.on('data', (data) => {
    console.log(data)
  })

  proc.stderr.on('data', (data) => {
    console.log(data)
  })
}

module.exports = {
  getStartProcId: function () {
    return cache.get(startProcCacheKey)
  },
  clearStartProcId: function () {
    cache.remove(startProcCacheKey)
    cache.save()
  },
  startProject: function () {
    program.parse(process.argv)
    const options = program.opts()
    const port = options.port
    _start(port ? `next dev -p ${port}` : 'next dev')
  },

  startComponent: function () {
    _start(
      'react-app-rewired start --config-overrides ' +
        path.resolve(__dirname, '../../build/v-act/v-act-config-overrides.js')
    )
  }
}
