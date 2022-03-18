import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
import * as $ from '@v-act/vjs.framework.extension.vendor.jquery'
const vds = { window, $ }
import * as widget from './FixedComponent'

let keyBoradFixed

export function initModule(sb) {}

const init = function () {
  if (!window.keyBoradFixed) {
    window.keyBoradFixed = new resizeFixed()
  } else {
    window.keyBoradFixed.$addWidget()
  }
  if (window.keyBoradFixed.$isApp) {
    window.keyBoradFixed.$setHeight()
  }
  return window.keyBoradFixed
}

const addEventlistener = function (fn: any) {
  if (!window.keyBoradFixed) {
    window.keyBoradFixed = new resizeFixed()
  }
  if (window.keyBoradFixed) {
    window.keyBoradFixed.$addEventlistener(fn)
  }
}

const addEventlisteners = function (fn: any) {
  if (!window.keyBoradFixed) {
    window.keyBoradFixed = new resizeFixed()
  }
  for (let i in fn) {
    window.keyBoradFixed.addEventlistener(fn[i])
  }
}

let resizeFixed = function () {
  this.widget = widget.getBottomWidget()
  this.callBack = []
  this.isChange = true
  this.init()
}
resizeFixed.prototype = {
  init: function () {
    this.$isAndroid =
      navigator.userAgent.indexOf('Android') > -1 ||
      navigator.userAgent.indexOf('Adr') > -1
    this.$isApp = window.VJSBridge && this.$isAndroid
    //this.$isApp = true;
    this.$changeWidget()
    this.$setIsChange()
    this.$height()
  },
  $height: function () {
    if (this.$isApp) {
      let $this = this
      /*cordova.plugins.system.config.getStatusBarHeight(function(height){
                $this.orginheight = $(document).height();
                debugger;
                $this.$resize();
            })*/
      this.$setHeight()
      this.$resize()
    } else {
      this.orginheight = $(document).height()
      this.$resize()
    }
  },
  $setHeight: function () {
    $.this = this
    $('input,textarea').on('touchstart', function () {
      $.this.orginheight = $(document).height()
    })
  },
  $changeWidget: function () {
    this.changeWidget = []
    for (let i = 0; i < this.widget.length; i++) {
      let widgetCode = this.widget[i].Code
      let type = widgetContext.getType(widgetCode)
      if (type != 'JGMNavControlContainer') {
        this.changeWidget.push(widgetCode)
      }
    }
  },
  $resize: function () {
    $(window).resize(
      (function (obj) {
        return function (ev) {
          if (!obj.isChange) {
            obj.isChange = true
            return
          }
          var focusEl = document.activeElement
          if ($(document).height() < obj.orginheight) {
            if (
              $(focusEl).attr('contenteditable') ||
              /input|textarea|body/.test(
                document.activeElement.nodeName.toLowerCase()
              )
            ) {
              // 隐藏固定底部控件
              for (var index = 0; index < obj.widget.length; index++) {
                widgetAction.executeWidgetAction(
                  obj.widget[index].code,
                  'setVisible',
                  false
                )
              }
              //容器类触发 判断input是否在容器内 ：有容器具体实现
              obj.$dispatchEvent(false)
            }
          } else {
            for (var index = 0; index < obj.widget.length; index++) {
              widgetAction.executeWidgetAction(
                obj.widget[index].code,
                'setVisible',
                true
              )
            }
            obj.$dispatchEvent(true)
          }
        }
      })(this)
    )
  },
  $addEventlistener: function (fn: any) {
    if ((typeof fn).toLowerCase() == 'function') {
      this.callBack.push(fn)
    }
  },
  $dispatchEvent: function () {
    let options = []
    for (let i = 0; i < arguments.length; i++) {
      options.push(arguments[i])
    }
    let callBack = this.callBack
    for (let i = 0; i < this.callBack.length; i++) {
      this.callBack[i].apply(this, options)
    }
  },
  $setIsChange: function () {
    let $this = this
    for (let i = 0; i < this.changeWidget.length; i++) {
      let widgetCode = this.changeWidget[i]
      let globalCode = widgetContext.get(widgetCode, 'GlobalCode')
      $('#' + globalCode)
        .find('input,textera,*[contenteditable =true]')
        .on('touchstart', function () {
          $this.isChange = false
        })
    }
  },
  $addWidget: function () {
    this.widget = this.widget.concat(widget.getBottomWidget())
  }
}
export { addEventlistener, addEventlisteners, init }
