import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let Snapshot = function () {
  // @ts-ignore
  this.id = uuid.generate()
  // @ts-ignore
  this.datasourceSnapshot = {}
}

Snapshot.prototype = {
  initModule: function (sb: any) {},

  getId: function () {
    return this.id
  },

  registerDatsourceSnapshot: function (datasourceName: string, snapshot: any) {
    this.datasourceSnapshot[datasourceName] = snapshot
  },

  getDatasourceSnapshot: function (datasourceName: string) {
    return this.datasourceSnapshot[datasourceName]
  }
}

export default Snapshot
