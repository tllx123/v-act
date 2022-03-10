import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let Snapshot = function () {
  this.id = uuid.generate()
  this.datasourceSnapshot = {}
}

Snapshot.prototype = {
  initModule: function (sb) {},

  getId: function () {
    return this.id
  },

  registerDatsourceSnapshot: function (datasourceName, snapshot) {
    this.datasourceSnapshot[datasourceName] = snapshot
  },

  getDatasourceSnapshot: function (datasourceName) {
    return this.datasourceSnapshot[datasourceName]
  }
}

export default Snapshot
