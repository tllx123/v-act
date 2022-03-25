import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let RightClickEventHandler = function (params: any) {
  //@ts-ignore
  let that = this
  that.id = uuid.generate()
  that.handler = params.handler
  that.title = params.title
  that.html = params.html
  that.accept = params.accept
}

RightClickEventHandler.prototype = {
  initModule: function (sb: unknown) {},

  getId: function () {
    return this.id
  },

  getHtml: function () {
    return this.html || "<li style='cursor:pointer;'>" + this.title + '</li>'
  },

  getHandler: function () {
    return this.handler
  },

  jugde: function () {
    return this.accept ? this.accept.apply(this, arguments) : true
  },

  hideMenu: function () {
    $('#mask').hide()
    $('#rightMenu_div').css({ top: -1000, left: -1000 })
  }
}

export default RightClickEventHandler
