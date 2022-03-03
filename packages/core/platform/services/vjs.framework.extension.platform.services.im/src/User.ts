let instance

const putInstance = function (ins) {
  instance = ins
}

const connection = function () {
  return instance.connection()
}

const register = function (username, password, nickname, successCB, errorCB) {
  return instance.register(username, password, nickname, successCB, errorCB)
}

const loginWithPwd = function (username, password, appkey, successCB, errorCB) {
  return instance.loginWithPwd(username, password, appkey, successCB, errorCB)
}

const loginWithToken = function (
  username,
  password,
  appkey,
  successCB,
  errorCB
) {
  return instance.loginWithToken(username, password, appkey, successCB, errorCB)
}

const quit = function (successCB, errorCB) {
  return instance.quit(successCB, errorCB)
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
  sendMedia,
  putInstance,
  connection,
  register,
  loginWithPwd,
  loginWithToken,
  quit
}
