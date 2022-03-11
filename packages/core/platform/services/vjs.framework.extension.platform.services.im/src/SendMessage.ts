let instance

const putInstance = function (ins) {
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

const sendText = function (message, receiveId, chatType, successCB, failCB) {
  return instance.sendText(message, receiveId, chatType, successCB, failCB)
}

const sendCmdText = function (message, receiveId, ext, successCB, failCB) {
  return instance.sendCmdText(message, receiveId, ext, successCB, failCB)
}

const sendMedia = function (
  receiveId,
  chatType,
  roomType,
  mediaType,
  successCB,
  errorCB
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

export {
  putInstance,
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
  putInstance,
  addListener,
  putInstance,
  sendText,
  sendCmdText,
  sendMedia
}
