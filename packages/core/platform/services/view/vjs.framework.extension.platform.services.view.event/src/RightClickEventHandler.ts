import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

let RightClickEventHandler = function (params) {
  this.id = uuid.generate()
  this.handler = params.handler
  this.title = params.title
  this.html = params.html
  this.accept = params.accept
}

RightClickEventHandler.prototype = {
  initModule: function (sb) {},

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
