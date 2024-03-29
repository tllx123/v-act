import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

import * as utils from './Utils'

class RollbackRequest {
  //@ts-ignore
  steps
  //@ts-ignore
  instance
  //@ts-ignore
  isAsync
  //@ts-ignore
  index
  //@ts-ignore
  status
  //@ts-ignore
  intervalIndex

  constructor(params: any) {
    this.steps = params.steps
    this.instance = params.instance
    this.isAsync = !!params.isAsync
    this.index = 0
    this.status = 0 //1:回滚成功，2:废弃
    this.intervalIndex = null
  }

  start() {
    if (this.index < this.steps.length) {
      let time = this.steps[this.index++]
      if (time > 0) {
        setTimeout(
          (function (rq) {
            return function () {
              rq._rollback()
            }
          })(this),
          time
        )
      } else {
        this._rollback()
      }
    } else {
      this.status = 2
    }
  }

  _genFailCallback() {
    let rq = this
    return function (e: any) {
      let msg =
        '[RollbackRequest.rollback]第' +
        rq.index +
        '次尝试重新回滚事务失败，' +
        (rq.index < rq.steps.length ? '等待下一次重试,' : '') +
        '事务id：' +
        rq.instance.getTransactionId() +
        '，失败原因：' +
        e.message
      log.warn(msg)
      rq.start()
    }
  }

  _genSuccessCallback() {
    let rq = this
    return function () {
      log.warn(
        '[RollbackRequest.rollback]第' +
          rq.index +
          '次回滚事务成功，事务id：' +
          rq.instance.getTransactionId()
      )
      rq.status = 1
    }
  }

  _rollback() {
    log.warn(
      '[RollbackRequest.rollback]第' +
        (this.index == 0 ? 1 : this.index) +
        '次尝试重新回滚事务，事务id：' +
        this.instance.getTransactionId()
    )
    utils.rollback({
      isAsync: this.isAsync,
      componentCode: this.instance.getComponentCode(),
      transactionId: this.instance.getTransactionId(),
      success: this._genSuccessCallback(),
      fail: this._genFailCallback()
    })
  }

  isAbandoned() {
    return this.status != 0
  }
}

export default RollbackRequest
