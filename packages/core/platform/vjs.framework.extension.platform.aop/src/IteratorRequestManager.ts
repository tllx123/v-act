import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let Manager = function () {
  //任务列表
  this.requestList = []
}

Manager.prototype = {
  remove: function (rq) {
    for (let i = 0, request; (request = this.requestList[i]); i++) {
      if (request === rq) {
        arrayUtil.remove(this.requestList, request)
        i--
        break
      }
    }
  },

  get: function (id) {
    for (let i = 0, request; (request = this.requestList[i]); i++) {
      if (request.getId() == id) {
        return request
      }
    }
    return null
  },

  addRequest: function (request) {
    this.requestList.push(request)
  }
}

let singlton = new Manager()

export function initModule(sBox) {}

const addRequest = function (request) {
  let taskId = uuid.generate()
  request.setId(taskId)
  singlton.addRequest(request)
  request.start()
  return taskId
}

const remove = function (instanceId) {
  let rq = singlton.get(instanceId)
  if (rq) {
    rq.stop()
    singlton.remove(rq)
  }
}

export {
  _putAop,
  addRequest,
  clear,
  getHook,
  init,
  isDebugger,
  isInited,
  remove,
  update
}
