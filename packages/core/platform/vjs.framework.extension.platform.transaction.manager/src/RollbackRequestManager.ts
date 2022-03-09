import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'

let requestList = []
let intervalIndex = null

export function initModule(sb) {}

const add = function (request) {
  requestList.push(request)
  request.start()
  if (intervalIndex == null) {
    intervalIndex = setInterval(
      (function (list) {
        return function () {
          for (var i = 0; i < list.length; i++) {
            var rq = list[i]
            if (rq.isAbandoned()) {
              arrayUtil.remove(list, rq)
              i--
            }
          }
          if (list.length == 0) {
            clearInterval(intervalIndex)
            intervalIndex = null
          }
        }
      })(requestList),
      3000
    )
  }
}

export { add }
