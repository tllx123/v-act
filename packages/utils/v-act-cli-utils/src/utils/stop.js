const { clearStartProcId, getStartProcId } = require('./start.js')

const stop = function () {
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
