import { ProgressBarUtil as util } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.progressbar'



/**
 * 显示进度条
 */
let showProgress = function (msg:string) {
  util.showProgress(msg)
}

/**
 * 隐藏进度条
 */
let hideProgress = function () {
  util.hideProgress()
  //兼容逻辑，app中使用
  let div = document.getElementById('$waitingMsgDiv')
  if (div) {
    div.style.display = 'none'
  }
}

export { hideProgress, showProgress }
