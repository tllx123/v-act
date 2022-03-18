import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import * as $ from '@v-act/vjs.framework.extension.platform.services.integration.vds.$'
const vds = { $ }
/*
 * 1、创建隐藏文本域
 * 2、引入第三方 keyUp keyDown keyPress
 * 3、初始化
 * 4、提供接口 listenBarCodeScanning(options,callback);
 *
 *
 * */

let barCode
export function initModule(sb) {}
let listenBarCodeScanning = function (options: any, callback: any) {
  let currentScopeId = ScopeManager.getCurrentScopeId()
  $('body').startListen(
    {
      scopeId: currentScopeId
    },
    callback
  )
  let scope = ScopeManager.getScope()
  scope.on(ScopeManager.EVENTS.DESTROY, function () {
    let id = scope.getInstanceId()
    if (barCode) {
      delete barCode.callback[id]
      let index = barCode.scopeIds.indexOf(id)
      index > -1 && barCode.scopeIds.splice(index, 1)
    }
  })
}
let clearListen = function () {
  if (!barCode) {
    return
  }
  barCode.clear()
  barCode = null
}
function Scanning(options: any) {
  this.listenerObj = null
  /*
     * check 默认为false  不校验任何限制
     * {
     *  letter:true,  校验是否是字母
        number:true,  校验是否是数组
        barcodeLen:8, 校验长度  ==  0为不校验
        MaxBarcodeLen：8 校验最大长度   0为不校验
        
     * }
     * */
  this.check = false

  this.oneKeyTime = '' /* 一次按键时间间隔 */
  this.twoKeyTime = '' /* 两次按键时间间隔 */
  this.keyDownTime = ''
  this.spanTime = 70 /* 一次按键按下到释放的时间间隔 */

  this.zerokeyVal = 48 /* 零的key值      */
  this.ninekeyVal = 57 /* 数字9的key值   */
  this.akeyVal = 65 /* a的key值      */
  this.zkeyVal = 90 /* z的key值      */

  this.setOptions(options)
}
Scanning.prototype = {
  constructor: Scanning,
  setOptions: function (options: any) {
    this.createEl()
    this.listenerObj = $('#codeScanner_device')
    this.options = options || {}
    if (this.options.check) {
      this.check = this.options.check
    }
    if (this.options.scopeId) {
      this.scopeIds = this.scopeIds || []
      this.scopeIds.push(this.options.scopeId)
    }
    if (this.options.callback) {
      this.callback = this.callback || {}
      this.callback[this.options.scopeId] = this.options.callback
    }

    /*for(var member in settings){
               if(typeof barcode[member] !== 'undefined'){
                   barcode[member] = settings[member];
               }
           }*/
  },
  checkHandInput: function () {
    if (this.oneKeyTime > this.spanTime) {
      return true
    } else {
      return false
    }
  },
  on_key_down: function () {
    let that = this
    this.listenerObj.keydown(function (e) {
      /*if(e.which !== 13 && !(that.in_range(e.which))){
                   $(that.listenerObj).val('');
                   return ;
               }*/
      let d = new Date()
      let curTime = parseInt(d.getTime() + '')
      if (that.keyDownTime !== '' && that.keyDownTime !== NaN) {
        that.twoKeyTime = curTime - that.keyDownTime
      }
      that.keyDownTime = curTime
    })
  },
  on_key_up: function () {
    let that = this
    this.listenerObj.keyup(function (e) {
      let d = new Date()
      let keyUpTime = d.getTime()

      that.oneKeyTime = parseInt(keyUpTime + '') - parseInt(that.keyDownTime)
      let isHand = that.checkHandInput()
      console.log(that.oneKeyTime)
      if (isHand) {
        console.warn('禁止手动输入')
        return
      }
      /*if(that.check && isHand && that.in_range(e.which)){  // 
                   $(that.listenerObj).val("");
               }*/
    })
  },
  on_key_press: function () {
    let that = this
    this.listenerObj.keypress(function (e) {
      if (e.which == 13) {
        //
        that.listenEv()
      }
    })
  },
  //判断按下的键是否在字母加数字这个范围
  in_range: function (key: any) {
    let isLegal = false
    if (this.number) {
      isLegal = this.is_number(key)
    }
    if (this.letter) {
      isLegal = this.is_letter(key)
    }
    if (this.number && this.letter) {
      isLegal = this.is_number || this.is_letter ? true : false
    }
    return isLegal
  },
  is_number: function (key) {
    if (key > this.ninekeyVal || key < this.zerokeyVal) {
      return false
    } else {
      return true
    }
  },
  is_letter: function (key) {
    if (key > this.zkeyVal || key < this.akeyVal) {
      return false
    } else {
      return true
    }
  },
  check_network: function () {
    return navigator.onLine ? true : false
  },
  listenEv: function () {
    let currentScopeId = this.scopeIds[this.scopeIds.length - 1]
    if (typeof this.callback[currentScopeId] == 'function') {
      this.callback[currentScopeId](this.listenerObj.val())
      this.listenerObj.val('')
    } else {
      console.log('no callback function')
    }
    /*this.listenerObj.val("").focus();*/
  },
  keepFocusInput: function () {
    this.listenerObj.blur(function () {
      let that = $(this)
      setTimeout(function () {
        that.focus().select()
      }, 300)
    })
  },
  clear: function () {
    this.listenerObj.remove()
    //this == null;
  },
  makeEl: function () {
    let ipt =
      '<input id="codeScanner_device" value="" type="text" style="position:absolute;top:-299px;opacity:1;" >'
    $(ipt).appendTo($('body'))
  },
  createEl: function () {
    let scanner = $('#codeScanner_device')
    if (!scanner.length) {
      this.makeEl()
    }
  },
  startListen: function (listenerObj, settings) {
    this.on_key_down()
    this.on_key_up()
    this.on_key_press()
    this.keepFocusInput()
    this.listenerObj.focus().select()
  }
}
$.fn.startListen = function (options: any, callback: any) {
  let settings = $.extend(
    {
      callback: function (code) {
        if (callback && typeof callback == 'function') {
          callback(code)
        }
      }
    },
    options || {}
  )
  if (!barCode) {
    barCode = new Scanning(settings)
    barCode.startListen()
  } else {
    barCode.setOptions(settings)
  }
}
export { clearListen }
