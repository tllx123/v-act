const { clearStartProcId, getStartProcId } = require('./start.js')
const { getNextProcessPid, clearNextProcessPid } = require('./utils')

const stop = function () {
  const nextProcessPid = getNextProcessPid()
  if (nextProcessPid) {
    try {
      clearNextProcessPid()
      process.kill(nextProcessPid)
    } catch (e) {}
  }
  const startProcId = getStartProcId()
  if (startProcId) {
    try {
      clearStartProcId()
      process.kill(startProcId)
    } catch (e) {}
  }
}

module.exports = {
  stop
}
