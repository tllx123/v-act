import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let historyStack: Array<Record<string, any>> = []

//@ts-ignore
// History.Adapter.bind(window, 'popstate', function () {
//   let index = historyStack.length
//   --index
//   let unit = historyStack[index]
//   if (unit) {
//     if (unit.isInit() && unit.async) {
//       unit.fire()
//     } else {
//       unit.markInit()
//     }
//   }
// })
class Unit {
  async: boolean
  title: string
  isVirtual: boolean
  id: string
  flag: boolean
  callback: Function | null
  args: Record<string, any> | null
  currentScopeId: string

  constructor(params: Record<string, any>, isVirtual: boolean) {
    this.async = true
    this.title = params.title ? params.title : document.title
    this.isVirtual = isVirtual
    this.id = uuid.generate()
    this.flag = false
    this.callback = params ? params.callback : null
    this.args = params ? params.params : null
    this.currentScopeId = params.currentScopeId
  }

  getId() {
    return this.id
  }

  isInit() {
    return this.flag
  }

  markInit() {
    this.flag = true
  }

  getTitle() {
    return this.title
  }

  markUnInit() {
    this.flag = false
  }

  fire() {
    if (this.flag) {
      //				EventManager.fireEvent("WXConfirmWhenGoBack","popstate")();
      //				EventManager.fireEventByName("popstate");
      let scopeId = this.currentScopeId
      if (scopeId) ScopeManager.openScope(scopeId)
      let windowScope = ScopeManager.getWindowScope()
      if (scopeId) ScopeManager.closeScope()

      let cb = (function (tmpThis, winScope) {
        return function () {
          if (!winScope.isExitWindow()) {
            setTimeout(
              (function (unit) {
                return function () {
                  unit.async = true
                }
              })(tmpThis),
              1
            )
            tmpThis.async = false
            //							tmpThis.markUnInit();
            //							alert(2);
            _pushHistory()
            //							_addBrowserHistory(this.getId(),this.getTitle());
            return
          } else {
            if (tmpThis.isVirtual) {
              //@ts-ignore
              History.back()
              removeHistory(tmpThis.getId())
            } else {
              removeHistory(tmpThis.getId())
              if (tmpThis.callback) {
                tmpThis.callback.apply(tmpThis, [tmpThis.args])
              }
            }
          }
        }
      })(this, windowScope)
      this.markUnInit()
      windowScope.fireBeforeExitEvent('popstate', cb)
      //				if(!windowScope.isExitWindow()){
      //					windowScope.setDefaultExitWindow();
      //					setTimeout((function(unit){return function(){unit.async=true;}})(this),1);
      //					this.async=false;
      //					this.markUnInit();
      ////					alert(2);
      //					_pushHistory();
      ////					_addBrowserHistory(this.getId(),this.getTitle());
      //					return;
      //				}else{
      //					if(this.isVirtual){
      //						History.back();
      //					}else{
      //						if(this.callback){
      //							this.callback.apply(this,[this.args]);
      //						}
      //					}
      //				}
      //				exports.removeHistory(this.getId());
    } else {
      this.flag = true
    }
  }
}

const _addBrowserHistory = function (id: string, title: string) {
  let fiexdName = '_V3HistoryRandom'
  let data = { id: id }
  //		History.pushState(data, title, "?random="+uuid.generate());
  //		var newTitle = title ? title : " ";
  let paramArr = document.URL.split('?')[1].split('&')
  let newParam = '?'
  for (let i = 0, l = paramArr.length; i < l; i++) {
    let param = paramArr[i]
    if (param.indexOf(fiexdName) == -1) {
      newParam = newParam + param + '&'
    }
  }
  newParam = newParam + fiexdName + '=' + uuid.generate()
  //@ts-ignore
  History.pushState(data, title, newParam)
  //		alert("1");
}

const _pushHistory = function () {
  let state = {
    title: 'title',
    url: '#'
  }
  window.history.pushState(state, 'title', '#')
}

const addHistory = function (params: Record<string, any>) {
  let unit = new Unit(params, false)
  let id = unit.getId()
  historyStack.push(unit)
  let data = { id: id }
  let title = unit.getTitle()
  //@ts-ignore
  History.pushState(data, title, null)
  //		_addBrowserHistory(id,params.title);
  return id
}

const replaceHistory = function (params: Record<string, any>) {
  /* 从历史记录堆栈中获取最后一条记录，并执行回调 */
  if (historyStack && historyStack.length > 0) {
    /* pop 移除最后一条数据，并返回移除的数据 */
    let lastRecord = historyStack.pop()
    if (lastRecord && typeof lastRecord.callback == 'function') {
      let _cb = lastRecord.callback
      //@ts-ignore
      _cb.apply(this, arguments)
    }
  }
  /* 重新创建一条记录 */
  let unit = new Unit(params, false)
  /* 记录标志为已初始化 */
  unit.markInit()
  /* 将该记录放到历史记录堆栈里 */
  historyStack.push(unit)
  let id = unit.getId()
  return id
}

const removeHistory = function (id: string) {
  let index = -1
  for (let i = 0, l = historyStack.length; i < l; i++) {
    let unit = historyStack[i]
    if (id == unit.getId()) {
      index = i
      break
    }
  }
  if (index != -1) {
    historyStack.splice(index, 1)
  }
}

const getHistoryStack = function () {
  return historyStack
}

export { addHistory, getHistoryStack, removeHistory, replaceHistory }
