exports.initModule = function (sb) {}

/**
 * 初始化IM
 */
let initIM = function (successCB) {
  let libs = [
    'itop/common/im/resource/js/webim.config.js',
    'itop/common/im/resource/js/strophe-1.2.8.min.js',
    'itop/common/im/resource/js/websdk-1.4.10.js'
  ]

  let callback = function () {
    if (!window.conn) {
      window.conn = new WebIM.connection({
        https: WebIM.config.https,
        url: WebIM.config.xmppURL,
        isAutoLogin: WebIM.config.isAutoLogin,
        isMultiLoginSessions: true
      })

      window.conn.listen({
        onOpened: function (msg) {},
        onTextMessage: function (msg) {},
        onCmdMessage: function (msg) {}
      })
    }

    if (typeof successCB == 'function') {
      successCB()
    }
  }
  libs.push(callback)
  head.js.apply(head, libs)
}

initIM()

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
  initIM
}
