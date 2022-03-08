import { VTenantManager as vTenantManager } from '@v-act/vjs.framework.extension.platform.im'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'

export function initModule(sb) {
  let IMSendMessageService = sb.getService(
    'vjs.framework.extension.platform.services.im.SendMessage'
  )
  IMSendMessageService.putInstance(exports)
}

let getServerTime = function (cb) {
  let ajaxUrl =
    location.href.substring(0, location.href.indexOf('im_mobile')) +
    '/module-operation!executeOperation?operation=GetCurrentTime'
  if (location.href.indexOf('im_mobile') == -1) {
    ajaxUrl =
      location.href.substring(0, location.href.indexOf('module-operation')) +
      '/module-operation!executeOperation?operation=GetCurrentTime'
  }

  remoteOperation.orginalRequest({
    host: ajaxUrl,
    param: {},
    isAsync: true,
    afterResponse: cb
  })
}

const sendText = function (message, receiveId, chatType, successCB, failCB) {
  vTenantManager.getUserName(receiveId, function (tusername) {
    let id = conn.getUniqueId() // 生成本地消息id
    let msg = new WebIM.message('txt', id) // 创建文本消息
    getServerTime(function (data) {
      let obj = JSON.parse(data.responseText)
      let serverTime = obj.time
      let extObj = {
        msgid: id,
        serverTime: serverTime
      } //消息ID作为额外信息

      let reSuccessCB = function (id) {
        if (typeof successCB == 'function') {
          successCB(id)
        }
      }

      let reErrorCB = function (msg) {
        if (typeof failCB == 'function') {
          failCB(msg)
        }
      }

      if (chatType == 'singleChat') {
        msg.set({
          msg: message, // 消息内容
          to: tusername, // 接收消息对象（用户id）
          roomType: false,
          success: reSuccessCB
        })
        msg.body.chatType = 'singleChat'
        window.conn.send(msg.body)
      } else {
        let option = {
          msg: message, // 消息内容
          to: tusername, // 接收消息对象(群组id)
          roomType: false,
          chatType: 'chatRoom',
          ext: extObj,
          success: reSuccessCB,
          fail: reErrorCB
        }
        msg.set(option)
        msg.setGroup('groupchat')
        window.conn.send(msg.body)
      }
    })
  })
}

const sendCmdText = function (message, receiveId, ext, successCB, failCB) {
  vTenantManager.getUserName(receiveId, function (tusername) {
    let id = conn.getUniqueId() //生成本地消息id
    let msg = new WebIM.message('cmd', id) //创建命令消息
    getServerTime(function (data) {
      let obj = JSON.parse(data.responseText)
      let serverTime = obj.time
      if (typeof ext == 'object') {
        ext['msgid'] = id
        ext['serverTime'] = serverTime
      } else {
        ext = {}
        ext['msgid'] = id
        ext['serverTime'] = serverTime
      }

      let reSuccessCB = function (id) {
        if (typeof successCB == 'function') {
          successCB(id)
        }
      }

      msg.set({
        msg: message,
        to: tusername, //接收消息对象
        action: 'action', //用户自定义，cmd消息必填
        ext: ext, //用户自扩展的消息内容（群聊用法相同）
        success: reSuccessCB,
        fail: failCB
      })
      msg.body.roomType = false
      msg.setGroup('groupchat')
      conn.send(msg.body)
    })
  })
}

const sendMedia = function (
  receiveId,
  chatType,
  roomType,
  mediaType,
  successCB,
  errorCB
) {
  vTenantManager.getUserName(receiveId, function (tusername) {
    let id = conn.getUniqueId()
    let msg = new WebIM.message(mediaType, id)
    let input
    let allowType
    if (mediaType == 'img') {
      input = document.getElementById('image')
      allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true
      }
    }
    if (mediaType == 'file') {
      input = document.getElementById('file')
      allowType = {
        jpg: true,
        gif: true,
        png: true,
        bmp: true,
        zip: true,
        txt: true,
        doc: true,
        pdf: true
      }
    }
    if (mediaType == 'audio') {
      input = document.getElementById('audio')
      allowType = {
        mp3: true,
        amr: true,
        wmv: true
      }
    }
    if (mediaType == 'video') {
      input = document.getElementById('video')
      allowType = {
        mp4: true,
        wmv: true,
        avi: true,
        rmvb: true,
        mkv: true
      }
    }
    let file = WebIM.utils.getFileUrl(input)
    if (file.filetype.toLowerCase() in allowType) {
      if (chatType == 'singleChat') {
        let option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: tusername, // 接收消息对象
          roomType: false,
          chatType: 'singleChat',
          onFileUploadError: errorCB,
          onFileUploadComplete: function () {
            console.log('onFileUploadComplete')
          },
          success: successCB,
          flashUpload: WebIM.flashUpload
        }
        msg.set(option)
        conn.send(msg.body)
      } else {
        let option = {
          apiUrl: WebIM.config.apiURL,
          file: file,
          to: tusername, // 接收消息对象
          roomType: roomType,
          chatType: 'chatRoom',
          onFileUploadError: errorCB,
          onFileUploadComplete: function () {
            console.log('onFileUploadComplete')
          },
          success: successCB,
          flashUpload: WebIM.flashUpload
        }
        msg.set(option)
        conn.send(msg.body)
      }
    }
  })
}

export {
  addGroupMembers,
  addListener,
  addToGroupBlackList,
  changeGroupInfo,
  createGroup,
  destroyGroup,
  getGroupBlackList,
  initIM,
  leaveGroup,
  listGroups,
  queryGroupInfo,
  queryRoomMember,
  removeFromGroupBlackList,
  sendCmdText,
  sendMedia,
  sendText
}
