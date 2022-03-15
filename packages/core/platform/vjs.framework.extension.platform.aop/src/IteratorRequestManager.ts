import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

class Manager{
  requestList:any = []

  remove(rq:any) {
    for (let i = 0, request; (request = this.requestList[i]); i++) {
      if (request === rq) {
        arrayUtil.remove(this.requestList, request)
        i--
        break
      }
    }
  }
  get(id:string) {
    for (let i = 0, request; (request = this.requestList[i]); i++) {
      if (request.getId() == id) {
        return request
      }
    }
    return null
  }
  addRequest(request:any) {
    this.requestList.push(request)
  }
}


let singlton = new Manager()


const addRequest = function (request:any) {
  let taskId = uuid.generate()
  request.setId(taskId)
  singlton.addRequest(request)
  request.start()
  return taskId
}

const remove = function (instanceId:string) {
  let rq = singlton.get(instanceId)
  if (rq) {
    rq.stop()
    singlton.remove(rq)
  }
}

export {
  //_putAop,
  addRequest,
  //clear,
  //getHook,
  //init,
  //isDebugger,
  //isInited,
  remove,
  //update
}
