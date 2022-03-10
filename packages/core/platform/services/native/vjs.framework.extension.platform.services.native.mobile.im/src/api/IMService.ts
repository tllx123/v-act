let instance

const putInstance = function (ins) {
  instance = ins
}

const IMTYPE = {
  EASEMOB: 'easemob' //环信
}

const login = function (paranms, type) {
  instance.login(paranms, type)
}

const logout = function (paranms, type) {
  instance.logout(paranms, type)
}

const customerChat = function (paranms, type) {
  instance.customerChat(paranms, type)
}

export { IMTYPE, putInstance, login, logout, customerChat }
