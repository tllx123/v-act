import { VTenantManager as vTenantManager } from '@v-act/vjs.framework.extension.platform.im'
let undefined
exports.initModule = function (sb) {
  let IMGroupService = sb.getService(
    'vjs.framework.extension.platform.services.im.Group'
  )
  IMGroupService.putInstance(exports)
}

const listGroups = function (successCB, failCB) {
  let option = {
    success: successCB,
    error: failCB
  }
  conn.listRooms(option)
}

const queryRoomMember = function (roomId, successCB) {
  let member = ''
  conn.queryRoomMember({
    roomId: roomId,
    success: successCB
  })
}

const getGroupBlackList = function (roomId, successCB, failCB) {
  let option = {
    roomId: roomId,
    success: successCB,
    error: failCB
  }
  conn.getGroupBlacklist(option)
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
  let option = {
    subject: groupName, // 群名称
    description: description, // 群简介
    members: members, // 以数组的形式存储需要加群的好友ID
    optionsPublic: optionsPublic, // 允许任何人加入
    optionsModerate: optionsModerate, // 加入需审批
    optionsMembersOnly: optionsMembersOnly, // 不允许任何人主动加入
    optionsAllowInvites: optionsAllowInvites // 允许群人员邀请
  }
  conn.createGroup(option)
}

const queryGroupInfo = function (roomId, successCB, failCB) {
  conn.queryRoomInfo({
    roomId: roomId,
    success: successCB,
    error: failCB
  })
}

const changeGroupInfo = function (roomId, groupName, description, successCB) {
  let option = {
    roomId: roomId,
    subject: groupName, // 群组名称
    description: description, // 群组简介
    success: successCB
  }
  conn.changeGroupSubject(option)
}

const addGroupMembers = function (roomId, memberList) {
  let option = {
    list: memberList,
    roomId: roomId
  }
  conn.addGroupMembers(option)
}

const addToGroupBlackList = function (roomId, memberId, successCB) {
  let option = {
    affiliation: 'owner', // 写死
    roomId: roomId, // 群组ID
    success: successCB,
    to: memberId // 需要删除的成员ID
  }
  conn.addToGroupBlackList(option)
}

const removeFromGroupBlackList = function (roomId, memberId, successCB) {
  let option = {
    roomId: roomId,
    to: memberId,
    success: successCB
  }
  conn.removeGroupMemberFromBlacklist(option)
}

const destroyGroup = function (roomId, reason, successCB) {
  let option = {
    reason: reason,
    roomId: roomId,
    success: successCB
  }
  conn.destroyGroup(option)
}

const leaveGroup = function (roomId, memberId, successCB, failCB) {
  vTenantManager.getUserName(memberId, function (tusername) {
    let option = {
      to: tusername,
      roomId: roomId,
      success: successCB,
      error: failCB
    }
    conn.leaveGroupBySelf(option)
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
  leaveGroup
}
