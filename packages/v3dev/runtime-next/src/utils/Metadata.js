const path = require('path')
const fs = require('fs')
let MENMERY_CACHE = null

module.exports = {
  get: function () {
    try {
      if (!MENMERY_CACHE) {
        const p = path.resolve(__dirname, '../../', 'metadata.json')
        MENMERY_CACHE = JSON.parse(fs.readFileSync(p))
      }
    } catch (e) {
      MENMERY_CACHE = {}
    }
    return MENMERY_CACHE
  },

  save: function () {
    try {
      const p = path.resolve(__dirname, '../../', 'metadata.json')
      fs.writeFileSync(p, JSON.stringify(MENMERY_CACHE, null, '\t'))
    } catch (e) {}
  }
}
