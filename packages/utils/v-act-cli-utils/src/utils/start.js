const childProcess = require('child_process')
const path = require('path')
const program = require('commander')
program.option('-p, --port <port>', '端口号')

function _start(command) {
  var proc = childProcess.exec(
    command,
    { cwd: process.cwd() },
    function (err, stdout, stderr) {
      if (err) {
        throw err
      }
    }
  )

  proc.stdout.on('data', (data) => {
    console.log(data)
  })

  proc.stderr.on('data', (data) => {
    console.log(data)
  })
}

module.exports = {
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
