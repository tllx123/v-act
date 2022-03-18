let instance

const putInstance = function (ins: any) {
  instance = ins
}

/**
 * if is singlechat,that means this message will send to a person.if is chatroom,that means this message will send to a group or a chatroom.
 */
const chatType = {
  SINGLECHAT: 'singleChat',
  CHATROOM: 'chatRoom'
}
/**
 * this object define a media type.
 */
const mediaType = {
  IMAGE: 'img',
  FILE: 'file',
  AUDIO: 'audio',
  VIDEO: 'video'
}
/**
 * this object define a room type.
 */
const roomType = {
  GROUP: false,
  ROOM: true
}

export { chatType, mediaType, roomType }

const sendText = function (
  message: string,
  receiveId: string,
  chatType: any,
  successCB: any,
  failCB: any
) {
  return instance.sendText(message, receiveId, chatType, successCB, failCB)
}

const sendCmdText = function (
  message: string,
  receiveId: string,
  ext: any,
  successCB: any,
  failCB: any
) {
  return instance.sendCmdText(message, receiveId, ext, successCB, failCB)
}

const sendMedia = function (
  receiveId: string,
  chatType: any,
  roomType: any,
  mediaType: any,
  successCB: any,
  errorCB: any
) {
  return instance.sendMedia(
    receiveId,
    chatType,
    roomType,
    mediaType,
    successCB,
    errorCB
  )
}

export { sendText, sendCmdText, sendMedia }
