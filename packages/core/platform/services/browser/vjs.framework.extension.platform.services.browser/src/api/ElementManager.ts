/**
 * @namespace ElementManager
 * @module ElementManager
 * @desc 元素管理
 * 	旧方案：使用轮询去查询div的宽度，当页面多个窗体同时轮询时，会特别卡
 *  新方案：使用第三方插件ResizeObserver
 * vjs依赖：vjs.framework.extension.platform.services.browser
 * vjs服务：vjs.framework.extension.platform.services.browser.ElementManager
 */
import { LoopManager as loopManager } from '@v-act/vjs.framework.extension.platform.global'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let supportObserver: boolean /* 是否支持使用ResizeObserver */,
  domResizes: Record<string, any> = {} /* 监听dom大小改变的信息 */,
  eventPool: Record<string, any> = {}, //事件池,key：eleId，value：[event]
  elementSize: Record<string, any> = {}, //元素当前大小
  elementPool: Record<string, any> = {} //元素池，key：eleId，value：loopId

/**
 * 检查当前浏览器是否支持ResizeObserver， 如果不支持，则使用旧方案
 * */
let check = function () {
  if (supportObserver === true) {
    return true
  } else if (supportObserver === false) {
    return false
  } else {
    try {
      let observer = new ResizeObserver.ResizeObserver(function () {})
      if (observer) {
        supportObserver = true
      } else {
        supportObserver = false
      }
    } catch (e) {
      supportObserver = false
    }
  }
  return supportObserver
}
/**
 * 第三方插件监听逻辑
 * @param {Object} dom 需要监听的dom对象
 * @param {Function} handler dom的大小改变后的处理回调
 * */
const listener = function (dom: HTMLElement, handler: Function) {
  let observer = new ResizeObserver.ResizeObserver(
    (function (fun) {
      return function (entries: Record<string, any>) {
        let entry = entries.pop()
        let contentRect = entry.contentRect
        let width = contentRect.width
        let height = contentRect.height
        fun(width, height)
      }
    })(handler)
  )
  observer.observe(dom)
  return observer
}
/**
 * 开始setTimeout
 * @param {String} domId 需要监听的dom对象
 * */
const start = function (domId: string) {
  let index = setTimeout(
    (function (id) {
      return function () {
        let info = domResizes[id]
        if (!info || !document.getElementById(id)) {
          return
        }
        info.index = -1
        let handlers = info.handlers
        for (let i = 0, len = handlers.length; i < len; i++) {
          let handler = handlers[i]
          if (typeof handler == 'function') {
            handler(info)
          }
        }
      }
    })(domId),
    180
  ) /* 180可以调整，短时间的大小变化，尽量减少回调执行次数 */
  return index
}

/**
 * 监听元素大小改变（新方案）
 * @param	{Object} params
 * {
 * 	eleId		{String}	元素id
 * 	listener	{Function}	改变后执行的方法
 * }
 * */
export function bindEleResize(params: Record<string, any>) {
  if (!check()) {
    return bindEleResize_old(params)
  }
  let domId = params.eleId
  let handler = params.listener
  if (
    !domId ||
    typeof handler != 'function' ||
    !document.getElementById(domId)
  ) {
    if (window.console) {
      window.console.warn('监听的dom或者事件不能为空')
    }
    return
  }
  let dom = document.getElementById(domId)
  /* ResizeObserver不支持body */
  if (dom && dom.tagName == 'BODY') {
    return exports.bindEleResize_old(params)
  }
  let info = domResizes[domId]
  if (!info) {
    /* 如果不存在，则创建监听 */
    info = domResizes[domId] = {
      index: -1 /* 如果不等于-1，即已经setTimeout，表示大小已经改变 */,
      handlers: [handler] /* 支持绑定多个不同（===）监听事件 */
    }
    /* 开启监听 */
    if (dom) {
      let observer = listener(
        dom,
        (function (id) {
          return function (width: number | string, height: number | string) {
            let info = domResizes[id]
            if (!info) {
              /* 忽略这种情况，理论上不存此情况 */
              return
            } else if (info.index == -1) {
              /* 未开始setTimeout */
              info.width = width
              info.height = height
              info.index = start(id) /* 开启setTimeout */
            }
          }
        })(domId)
      )
      domResizes[domId].observer = observer
    }
  } else {
    /* 如果存在，则判断是否多个handler */
    let handlers = info.handlers
    let exist = false
    for (let i = 0, len = handlers.length; i < len; i++) {
      let fun = handlers[i]
      if (fun === handler) {
        exist = true
        break
      }
    }
    if (!exist) {
      handlers.push(handler)
    }
  }
}
/**
 * 移除监听元素大小改变(新方案)
 * @param	{Object} params
 * {
 * 	eleId		{String}	元素id
 * 	listener	{Function}	注册使用的函数，忽略则移除全部监听大小改变的事件
 * }
 * */
export function unbindEleResize(params: Record<string, any>) {
  if (!check()) {
    /* 不支持的执行旧方案 */
    return unbindEleResize_old(params)
  }
  let domId = params.eleId
  let listener = params.domId
  if (!domId || !domResizes[domId]) {
    /* domId为空或者未监听的，忽略处理 */
    return
  }
  let info = domResizes[domId]
  let observer = info.observer
  let dom = document.getElementById(domId)
  /* ResizeObserver不支持body */
  if (dom && dom.tagName == 'BODY') {
    return exports.bindEleResize_old(params)
  }
  try {
    if (null != dom) {
      observer.unobserve(dom)
    } else {
      observer = null
    }
    let index = domResizes[domId].index
    if (index != -1) {
      clearTimeout(index)
    }
    delete domResizes[domId]
  } catch (e) {}
}

//=====================下面是旧方案：使用轮询方式，但是页面内多个窗体同时监听，会使得页面很卡===========================
/**
 * 监听元素大小改变
 * @param	{Object} params
 * {
 * 	eleId		{String}	元素id
 * 	listener	{Function}	改变后执行的方法
 * }
 * */
export function bindEleResize_old(params: Record<string, any>) {
  let eleId = params.eleId,
    listener = params.listener
  if (!eleId || typeof listener != 'function' || $('#' + eleId).length != 1) {
    return
  }
  let $dom = $('#' + eleId)
  elementSize[eleId] = {
    width: $dom.width(),
    height: $dom.height()
  }
  let handler = (function (domId) {
    return function () {
      let $tmpDom = $('#' + domId)
      if ($tmpDom.length == 0) {
        //如果被销毁，则停止监听
        exports.unbindEleResize({
          eleId: domId
        })
        return
      }
      let preSize = elementSize[eleId]
      let width = $tmpDom.width()
      let height = $tmpDom.height()
      if ($tmpDom[0].tagName == 'BODY') {
        //首页页签来回切换的话，body大小不正确
        width = $(window).width()
        height = $(window).height()
      }
      if (preSize.width != width || preSize.height != height) {
        //如果宽/高不一样
        preSize.width = width
        preSize.height = height
        let events = eventPool[domId]
        if (events) {
          for (let i = 0, len = events.length; i < len; i++) {
            events[i]({
              width: width,
              height: height
            })
          }
        } else {
          exports.unbindEleResize({
            eleId: domId
          })
        }
      }
    }
  })(eleId)
  let loopId = loopManager.add({
    handler: handler
  })
  elementPool[eleId] = loopId
  if (!eventPool[eleId]) {
    eventPool[eleId] = [listener]
  } else {
    eventPool[eleId].push(listener)
  }
}
/**
 * 移除监听元素大小改变
 * @param	{Object} params
 * {
 * 	eleId		{String}	元素id
 * 	listener	{Function}	注册使用的函数，忽略则移除全部监听大小改变的事件
 * }
 * */
export function unbindEleResize_old(params: Record<string, any>) {
  let eleId = params.eleId,
    listener = params.listener
  if (!eleId) {
    return
  }
  let needRemove = true
  if (listener) {
    let events = eventPool[eleId]
    if (events && events.length > 0) {
      let index = events.indexOf(listener)
      if (index != -1) {
        events.splice(index, 1)
        if (events != 0) {
          needRemove = false
        }
      }
    }
  }
  if (needRemove) {
    //移除循环
    let loopId = elementPool[eleId]
    if (loopId) {
      loopManager.remove(loopId)
    }
    //移除事件池、大小数据
    try {
      eventPool[eleId]
      elementSize[eleId]
    } catch (e) {}
  }
}
