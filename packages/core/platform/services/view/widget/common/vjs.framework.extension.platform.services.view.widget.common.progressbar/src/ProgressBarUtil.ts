import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowContainerManager } from '@v-act/vjs.framework.extension.platform.services.view.relation'
import { StringUtil as stringUtils } from '@v-act/vjs.framework.extension.util.string'

export function initModule(sb) {}

let showGlobalProgress = function (msg) {
  let div = $('#_waitMsgTD')
  content = msg ? msg : ''
  div.html(stringUtils.escapeHtml(content))
  div = $('#_waitingMsgDiv')
  if (!div || !div.length || div.length < 1) {
    div = $(document.getElementById('$waitingMsgDiv'))
  }
  div.show()
}

let hideGlobalProgress = function () {
  let div = $('#_waitingMsgDiv')
  if (!div || !div.length || div.length < 1) {
    div = $(document.getElementById('$waitingMsgDiv'))
  }
  div.hide()
}

let _getContainerEleId = function () {
  let scopeId = scopeManager.getCurrentScopeId()
  let containerId = windowContainerManager.getByScopeId(scopeId)
  let container = windowContainerManager.get(containerId)
  if (!container) {
    throw Error('未找到窗体容器实例，请检查！')
  }
  return container.getEle()
}

let showInstanceProgress = function (msg) {
  let windowScope = scopeManager.getWindowScope()
  let series = windowScope.getSeries()
  if ('bootstrap_mobile' == series) {
    showGlobalProgress(msg)
  } else {
    let eleId = _getContainerEleId()
    let parent = $('#' + eleId)
    let zIndex = parseInt(parent.children().css('z-index'))
    if (isNaN(zIndex)) {
      zIndex = 100
    } else {
      zIndex += 100
    }
    let ele = parent.find('#_instanceWaitingMsg_view')
    content = msg ? msg : ''
    msg = stringUtils.escapeHtml(content)
    if (ele.size() > 0) {
      ele.find('span').html(msg)
      ele.css('zIndex', zIndex + 2)
      let mark = parent.find('#_instanceWaitingMsg_mask')
      mark.css('zIndex', zIndex)
      mark.find('#_instanceWaitingMsg_mask').show()
      ele.show()
    } else {
      let view = $('#_instanceWaitingMsg_view').clone()
      let mask = $('#_instanceWaitingMsg_mask').clone()
      view.css('zIndex', zIndex + 2)
      mask.css('zIndex', zIndex)
      view.find('span').html(msg)
      parent.append(mask)
      parent.append(view)
      mask.show()
      view.show()
    }
  }
}

let hideInstanceProgress = function () {
  let windowScope = scopeManager.getWindowScope()
  let series = windowScope.getSeries()
  if ('bootstrap_mobile' == series) {
    hideGlobalProgress()
  } else {
    let eleId = _getContainerEleId()
    let parent = $('#' + eleId)
    parent.find('#_instanceWaitingMsg_view').hide()
    parent.find('#_instanceWaitingMsg_mask').hide()
  }
}

/**
 * 显示进度条
 */
let showProgress = function (msg, isGlobal) {
  if (typeof isGlobal == 'boolean') {
    isGlobal ? showGlobalProgress(msg) : showInstanceProgress(msg)
  } else {
    showGlobalProgress(msg)
  }
}

/**
 * 隐藏进度条
 */
let hideProgress = function (isGlobal) {
  if (typeof isGlobal == 'boolean') {
    isGlobal ? hideGlobalProgress() : hideInstanceProgress()
  } else {
    hideGlobalProgress()
  }
}

export { hideProgress, showProgress }
