let instance

const putInstance = function (ins) {
  instance = ins
}

const listGroups = function (successCB, failCB) {
  return instance.listGroups(successCB, failCB)
}

const queryRoomMember = function (roomId, successCB) {
  return instance.queryRoomMember(roomId, successCB)
}

const getGroupBlackList = function (roomId, successCB, failCB) {
  return instance.getGroupBlackList(roomId, successCB, failCB)
}

const createGroup = function (
  groupName,
  description,
  members,
  optionsPublic,
  optionsModerate,
  optionsMembersOnly,
  optionsAllowInvites
) {
  return instance.createGroup(
    groupName,
    description,
    members,
    optionsPublic,
    optionsModerate,
    optionsMembersOnly,
    optionsAllowInvites
  )
}

const queryGroupInfo = function (roomId, successCB, failCB) {
  return instance.queryGroupInfo(roomId, successCB, failCB)
}

const changeGroupInfo = function (roomId, groupName, description, successCB) {
  return instance.changeGroupInfo(roomId, groupName, description, successCB)
}

const addGroupMembers = function (roomId, memberList) {
  return instance.addGroupMembers(roomId, memberList)
}

const addToGroupBlackList = function (roomId, memberId, successCB) {
  return instance.addToGroupBlackList(roomId, memberId, successCB)
}

const removeFromGroupBlackList = function (roomId, memberId, successCB) {
  return instance.removeFromGroupBlackList(roomId, memberId, successCB)
}

const destroyGroup = function (roomId, reason, successCB) {
  return instance.destroyGroup(roomId, reason, successCB)
}

const leaveGroup = function (roomId, memberId, successCB, failCB) {
  return instance.leaveGroup(roomId, memberId, successCB, failCB)
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
  leaveGroup
}
