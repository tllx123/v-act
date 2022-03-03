import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

/**
 *  关闭窗口页实现
 *  仅支持谷歌浏览器和IE浏览器
 *  火狐浏览器需要在浏览器地址栏输入 about:config, 在该列表中查找 dom.allow_scripts_to_close_windows，设置为 true 即可
 */
let closeWindowTab = function () {
  window.opener = null
  window.open('', '_self')
  //		try{
  ////			window.parent.postMessage({
  ////				"TOONE_IDEN" : "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN",/* toone标识 */
  ////				"CLOSE_WINDWO_PARAMS" : {/* 网页窗体组件容器监听此属性决定关闭哪一个链接地址 */
  ////					'href' : window.location.href
  ////				}
  ////			}, '*');
  //			var params = {
  //				"TOONE_IDEN" : "TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN",/* toone标识 */
  //				"CLOSE_WINDWO_PARAMS" : {/* 网页窗体组件容器监听此属性决定关闭哪一个链接地址 */
  //					'href' : window.location.href
  //				}
  //			};
  //			window.parent.postMessage(params, '*');
  //		}catch(e){
  //			//...
  //		}
  //模态方式打开链接地址监听这个
  //        eventManager.fireCrossDomainEvent({
  //        	eventName : eventManager.CrossDomainEvents.ModalWindowClose,
  //        	params : {
  //        		href : window.location.href
  //        	}
  //        });
  //窗体容器打开链接地址时注册这个事件
  //        eventManager.fireCrossDomainEvent({
  //        	eventName : eventManager.CrossDomainEvents.ContainerWindowClose,
  //        	params : {
  //        		href : window.location.href
  //        	}
  //        });
  window.close()
}

export { closeWindowTab }
