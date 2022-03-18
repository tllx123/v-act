let instance

const putInstance = function (ins: any) {
  instance = ins
}

const listGroups = function (successCB: any, failCB: any) {
  return instance.listGroups(successCB, failCB)
}

const queryRoomMember = function (roomId: string, successCB: any) {
  return instance.queryRoomMember(roomId, successCB)
}

const getGroupBlackList = function (
  roomId: string,
  successCB: any,
  failCB: any
) {
  return instance.getGroupBlackList(roomId, successCB, failCB)
}

const createGroup = function (
  groupName: string,
  description: string,
  members: any,
  optionsPublic: any,
  optionsModerate: any,
  optionsMembersOnly: any,
  optionsAllowInvites: any
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

const queryGroupInfo = function (roomId: string, successCB: any, failCB: any) {
  return instance.queryGroupInfo(roomId, successCB, failCB)
}

const changeGroupInfo = function (
  roomId: string,
  groupName: string,
  description: string,
  successCB: any
) {
  return instance.changeGroupInfo(roomId, groupName, description, successCB)
}

const addGroupMembers = function (roomId: string, memberList: any) {
  return instance.addGroupMembers(roomId, memberList)
}

const addToGroupBlackList = function (
  roomId: string,
  memberId: string,
  successCB: any
) {
  return instance.addToGroupBlackList(roomId, memberId, successCB)
}

const removeFromGroupBlackList = function (
  roomId: string,
  memberId: string,
  successCB: any
) {
  return instance.removeFromGroupBlackList(roomId, memberId, successCB)
}

const destroyGroup = function (roomId: string, reason: string, successCB: any) {
  return instance.destroyGroup(roomId, reason, successCB)
}

const leaveGroup = function (
  roomId: string,
  memberId: string,
  successCB: any,
  failCB: any
) {
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
