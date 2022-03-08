import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

import { Modal as viewModel } from '@v-act/vjs.framework.extension.platform.services.view.modal'

export function getHandlerName() {
  return 'browser.createDialog'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      /**
       * 创建模态窗口
       * @params {Object} 弹窗参数
       * {
       * 	title {String} 弹框标题
       * 	width {Integer} 弹框宽度
       * 	height {Integer} 弹框高度
       * 	rendered {Function} 渲染回调
       *  closed {Function} 关闭回调
       *  formBorderStyle {String} 边框样式
       *  maximizeBox {Boolean} 是否显示最大化按钮 默认true
       *  windowState {String} Normal
       * }
       * */
      handler: function (params) {
        var modalParams = {
          title: params.title,
          width: params.width,
          height: params.height,
          rendered: params.rendered,
          closed: params.closed,
          resized: function (containerCode) {},
          formBorderStyle: params.formBorderStyle
            ? params.formBorderStyle
            : 'FixedSingle',
          maximizeBox: params.maximizeBox != false,
          windowState: params.windowState ? params.windowState : 'Normal'
        }
        viewModel.create(modalParams)
      }
    })
    widgetProperty[property.code] = handler
  }
}
