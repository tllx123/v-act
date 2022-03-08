export function initModule(sb) {
  let IMReceiveMessageService = sb.getService(
    'vjs.framework.extension.platform.services.im.ReceiveMessage'
  )
  IMReceiveMessageService.putInstance(exports)
}

const addListener = function (callbacks) {
  window.conn.listen({
    //		    onOpened: onOpened,
    onClosed: callbacks.onClosed, // 连接关闭回调
    onTextMessage: callbacks.onTextMessage, // 收到文本消息
    //		    onEmojiMessage: onEmojiMessage,   		// 收到表情消息
    //		    onPictureMessage: onPictureMessage, 	// 收到图片消息
    onCmdMessage: callbacks.onCmdMessage, // 收到命令消息
    //		    onAudioMessage: onAudioMessage,   		// 收到音频消息
    //		    onLocationMessage: onLocationMessage,	// 收到位置消息
    //		    onFileMessage: onFileMessage,    		// 收到文件消息
    //		    onVideoMessage: onVideoMessage,   		// 收到视频消息
    //		    onPresence: onPresence,       			// 收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    //		    onRoster: onRoster,         			// 处理好友申请
    //		    onInviteMessage: onInviteMessage,  		// 处理群组邀请
    //		    onOnline: onOnline,                  	// 本机网络连接成功
    //		    onOffline: onOffline,                 	// 本机网络掉线
    onError: callbacks.onError // 失败回调
    //		    onBlacklistUpdate: onBlacklistUpdate	// 黑名单更新
  })
}

export {
  listGroups,
  queryRoomMember,
  getGroupBlackList,
  createGroup,
  queryGroupInfo,
  changeGroupInfo,
  addGroupMembers,
  addToGroupBlackList,
  removeFromGroupBlackList,
  destroyGroup,
  leaveGroup,
  initIM,
  addListener
}
