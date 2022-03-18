export function initModule(sb) {}

const inputListen = function (el: any, callBack: any) {
  if (!callBack instanceof Function || !el instanceof HTMLElement) {
    return
  }
  el.fn = callBack
  el.cpLock = false
  el.addEventListener('compositionstart', function (e) {
    this.cpLock = true
  })
  el.addEventListener('compositionend', function (e) {
    this.cpLock = false
    if (!this.cpLock) this.fn()
  })
  el.addEventListener('input', function (e) {
    if (!this.cpLock) this.fn()
  })
}

export { inputListen }
