import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

class RightClickEventHandler {
  id: string
  handler: any
  title: any
  html: any
  accept: any
  constructor(params: any) {
    this.id = uuid.generate()
    this.handler = params.handler
    this.title = params.title
    this.html = params.html
    this.accept = params.accept
  }
  initModule(sb: unknown) {}

  getId() {
    return this.id
  }

  getHtml() {
    return this.html || "<li style='cursor:pointer;'>" + this.title + '</li>'
  }

  getHandler() {
    return this.handler
  }

  jugde() {
    return this.accept ? this.accept.apply(this, arguments) : true
  }

  hideMenu() {
    $('#mask').hide()
    $('#rightMenu_div').css({ top: -1000, left: -1000 })
  }
}

export default RightClickEventHandler
