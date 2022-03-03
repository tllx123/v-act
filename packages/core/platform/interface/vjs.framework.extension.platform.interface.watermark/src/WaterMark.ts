import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowContainerManager as windowContainerManager } from '@v-act/vjs.framework.extension.platform.services.view.relation'
import { ZIndex as zIndeUtils } from '@v-act/vjs.framework.extension.platform.services.view.ui'

let sandbox
let undefined
let undefined
//默认行高
let defaultLineHeight = 16
//标题高度
let titleHeight = 46
//默认图片
let defaultImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAoCAYAAACB4MgqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCMTY4NzUwRUEzRTExRTg5MjRBQkE0NzI5NUIzOEY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCMTY4NzUxRUEzRTExRTg5MjRBQkE0NzI5NUIzOEY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUIxNjg3NEVFQTNFMTFFODkyNEFCQTQ3Mjk1QjM4RjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUIxNjg3NEZFQTNFMTFFODkyNEFCQTQ3Mjk1QjM4RjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz54mj3aAAAETUlEQVR42tRYW29TRxCemV07ISjhEmSV4lAlDU2bFKsBEkc8FcFDX/qb+psqJITUPle8VKoKSGlooBIU8UJvUhVinzPTb49tEkJsn8smalbaxJfj3W/n9n2zbF9+QTGHEU3suPoG/s8x0a6Z/TSpyRMXvok4/C5xtMWwkqTO3wbEZv8QU8Z8S1kSZ+mzqMCFJZqtE3ZLStw8cBjqiLtJqb4Ust1owIktVohMGtP1Id+dTsWtsiYP4IFIwM2iwFb2q7D2FB8eQpSyrAD8FpP9EWNHbxEMkJI7D2DLY5ZySIENofQex7E4Vw8S5nXOgI3LXm6y8oIze1oVuHDflWVmSGtl9xGsfTnvhom4dRy2lh24wvRcob4qs9OetYuMmY74Fpv+WClU0kpBwiuY5wr/jrmFv7/iwH+XBu5KEpAynUbdXi25bw3OWq9Z+l1p4F0qQ0BZgIWaPVG+EvG8EM850+cly6GWAd4wsGRFeQDw0oYUAKNS4Yj19RIEBApv9/ceBuoFxNWj7FGiK0jgz4bE+nlUmRUk6s+FgSdcKBuxmSwiIS+OeOi1aHofZVItO4S+MhJUL75yaMggT2pk24Dxb6E6Hqgz70Qi16H01saUjOdgUrW9WA5yaHvELyYAfq2o9MitVYJjuuJasPY0j34woXeEVPY6GVmh4A2g2HSqr/KHiuSNEp6Bta9yvjMWFg2J+A1Ou9/i0Lks6X2Oxxhe6Ti/HuovHcHgntUbXeeXvOlmPubMoY+hRS7B4gt0hKOHQm6Q2m9oON6MTU7pi6UREzwhbTqGAUaZUuHVfCJrZHIarO0/hRsv8DEAHzQcKrSFovG6dKgA8CQS8vpxgN4fBQjLtmO9N0q5ejeC8U3cNfz0FBcuElVNP2g4aGjDIcNiCOpvFt5YLlHbPAX6sd46WAmcZL7oMuMaDknRAx2cCWa3p0eKS0e2OZet0tvD4xCozB+XsPtMx7lWcgi+MP0eOb/T2czD2s2Sfp5V8V/B4g8D2ULbQKMcrlPGO09aQvoE1vvnvRjvvH8h5C1zU6X2uUn9g2u1aK8loeFI0+8P8rE4+HEwJbCthLaKztD/ZKCyLaCyNcUsY/DB9F51f4hMo462Iuz3Fxbf7mvuxSqG6NV2bmOdl1hN98Ji3wNwyxre16vUbQD+E+3YXRgho20ovscwxtfY+FxpqzPPiskydMyjt6GSgvTD3BX3IVyyGOF6aDMheTMoXP3Xv0Rg1GtBEgxCRQTvMIMe2YhD22YwRagI2TvJ2skoF5STAH+jC6YPE5gNL2QZ57gQBzh/Aiv4PruhazKEHi9FSVSWJYRNQ8N93zfzF6ch4u9Qnru/fJc9U9jgUu96D5uI3MRns7F0GMbZmukWmmX3OT6oR65iDZi+oeUaonGd2AcW7mRQaubohA3oGIQjOveTBhwWPxvy53c6ccM6/lTa/WHH1UK5uhw9II+mS9oBfz74T4ABAOrQvPYyLI22AAAAAElFTkSuQmCC'
let undefined

exports.initModule = function (sBox) {
  sandbox = sBox
}

const draw = function (params) {
  let scopeId = params.scopeId
  let title = params.title
  let content = params.content
  if (!scopeId) {
    scopeId = scopeManager.getCurrentScopeId()
  }
  let windowContainerId = windowContainerManager.getByScopeId(scopeId)
  let windowContainer = windowContainerManager.get(windowContainerId)
  if (windowContainer) {
    let ele = windowContainer.getWinDomId()
    let dom = ele
    if (typeof ele == 'string') {
      dom = document.getElementById(ele)
    }
    if (dom) {
      let canvasId = 'wm' + windowContainerId
      let canvas = $(
        '<canvas id="' +
          canvasId +
          '" width="270" height="0" style="position:absolute;pointer-events: none;z-index:999999;"></canvas>'
      )[0]
      let zIndex = zIndeUtils.getFrontZIndex()
      $(canvas).css('z-index', zIndex)
      $(dom).append(canvas)
      canvas.height = calHeight(content, canvas, 58, 16)
      setPosition(dom, canvas)
      let imgObj = new Image()
      imgObj.onload = scopeManager.createScopeHandler({
        scopeId: scopeId,
        handler: function () {
          var ctx = canvas.getContext('2d')
          ctx.fillStyle = 'rgba(255,0,0,0.4)'
          ctx.font = '40px 微软雅黑'
          var titleWidth = ctx.measureText(title).width
          var left = 270 - titleWidth
          if (left < 60) {
            left = 48
          }
          var iconLeft = left - 60
          if (iconLeft < 0) {
            iconLeft = 0
          }
          ctx.drawImage(imgObj, iconLeft, 0, titleHeight, 40)
          ctx.fillText(title, left, 38)
          ctx.font = '14px 微软雅黑'
          writerContent(content, canvas, 0, 58, 16)
          var winScope = scopeManager.getScope(scopeId)
          //重置水印位置函数
          var resizeFunc = (function (_dom, _canvas, _set) {
            return function () {
              _set(_dom, _canvas)
            }
          })(dom, canvas, setPosition)
          $(window).on('resize', function () {
            if (typeof resizeFunc == 'function') {
              resizeFunc()
            }
          })
          windowContainerManager.updateWindowInfo(windowContainerId, {
            resizeFunc: resizeFunc
          })
          winScope.on(scopeManager.EVENTS.DESTROY, function () {
            if (
              canvas.parentElement &&
              typeof canvas.parentElement.removeChild == 'function'
            ) {
              canvas.parentElement.removeChild(canvas)
            }
          })
        }
      })
      imgObj.src = defaultImg
    }
  }
}

/**
 * 绘制内容
 * @param	{String}	str			内容
 * @param	{Object}	canvas		画布对象
 * @param	{Integer}	initX		起始X坐标
 * @param	{Integer}	initY		起始Y坐标
 * */
let writerContent = function (str, canvas, initX, initY) {
  let ctx = canvas.getContext('2d')
  let lineWidth = 0
  let canvasWidth = canvas.width
  let lastSubStrIndex = 0
  let changeLine = false
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width
    if (lineWidth > canvasWidth) {
      changeLine = true
      ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY)
      initY += defaultLineHeight
      lineWidth = 0
      lastSubStrIndex = i
      i--
    }
    if (i == str.length - 1) {
      if (!changeLine) {
        //没有换行，则要右边显示
        ctx.fillText(
          str.substring(lastSubStrIndex, i + 1),
          canvasWidth - lineWidth,
          initY
        )
      } else {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY)
      }
    }
  }
  //		console.log(initY);
}
/**
 * 计算canvas的高度
 * @param	{String}	str			内容
 * @param	{Object}	canvas		画布对象
 * @param	{Integer}	initY		起始坐标
 * */
let calHeight = function (str, canvas, initY) {
  if (null == str || '' == str) {
    return titleHeight - 4
  }
  let height = initY
  let ctx = canvas.getContext('2d')
  ctx.font = '14px 微软雅黑'
  let lineWidth = 0
  let canvasWidth = canvas.width
  let lastSubStrIndex = 0
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width
    if (lineWidth > canvasWidth) {
      height += defaultLineHeight
      lineWidth = 0
      lastSubStrIndex = i
      i--
    }
  }
  return height + 5
}
/**
 * 设置canvas位置
 * @param	{Object}	elem	目标对象
 * @param	{Object}	canvas	画布对象
 * */
let setPosition = function (elem, canvas) {
  let rect, win
  if (!elem) {
    return
  }
  if (!elem.getClientRects().length) {
    return { top: 0, left: 0 }
  }
  rect = elem.getBoundingClientRect()
  win = elem.ownerDocument.defaultView
  let eleWidth = rect.width + win.pageYOffset
  let eleHeight = rect.height + win.pageYOffset
  let canvasWidth = canvas.width
  let canvasHeight = canvas.height
  let r_top = 0
  let r_left = 0
  if (canvasHeight < document.body.offsetHeight) {
    //			r_top = (rect.top + win.pageYOffset) + eleHeight - canvasHeight;
    let h = eleHeight
    if (eleHeight <= 0) {
      h = document.body.offsetHeight
    }
    r_top = h - canvasHeight - 16
  }
  if (canvasWidth < document.body.offsetWidth) {
    //			r_left = rect.left + win.pageXOffset + eleWidth - canvasWidth;
    r_left = eleWidth - canvasWidth - 16
  }
  $(canvas).css('top', r_top)
  $(canvas).css('left', r_left)
}

export { draw }
