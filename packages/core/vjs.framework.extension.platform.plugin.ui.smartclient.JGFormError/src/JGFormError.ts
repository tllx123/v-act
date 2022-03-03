exports.initModule = function (sBox) {
  /**
   * 字体样式处理类
   */
  isc.ClassFactory.defineInterface('JGFormError')
  isc.JGFormError.addInterfaceProperties({
    eWidth: 90,
    eHeight: 28,
    eMaxTop: 37,
    eTopHeight: -38,
    eBottomHeight: 32,
    eErrorCanvas: null
  })
  isc.JGFormError.addInterfaceMethods({
    showError: function () {
      if (arguments.length > 1) {
        let msg = arguments[1].getError()
        if (msg) {
          let eErrorCanvas = arguments[1].eErrorCanvas
          if (!eErrorCanvas) {
            eErrorCanvas = arguments[1].eErrorCanvas = isc.Label.create({
              width: this.eWidth,
              height: this.eHeight
            })
            eErrorCanvas.left = arguments[1].getPageLeft() - this.getPageLeft()
            let top = this.getPageTop()
            if (top > this.eMaxTop) {
              eErrorCanvas.top = this.eTopHeight
              eErrorCanvas.contents =
                '<div class="tips"><div class="ico-tips-top"></div><span class="iconfont icon-warn JGFormErrorIcon"></span>此项为必填项</div>'
            } else {
              eErrorCanvas.top = this.eBottomHeight
              eErrorCanvas.contents =
                '<div class="tips"><div class="ico-tips-bottom"></div><span class="iconfont icon-warn JGFormErrorIcon"></span>此项为必填项</div>'
            }
            this.addChild(eErrorCanvas)
          }
          eErrorCanvas.show()
        }
      }
    },
    hideError: function () {
      if (arguments.length > 1) {
        let eErrorCanvas = arguments[1].eErrorCanvas
        if (eErrorCanvas) eErrorCanvas.hide()
      }
    }
  })
}
