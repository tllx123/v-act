let instance

const putInstance = function (ins) {
  instance = ins
}

const addListener = function (callbacks) {
  instance.addListener(callbacks)
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
  addListener
}
