let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const IMTYPE = {
  EASEMOB: 'easemob' //环信
}

const login = function (paranms: any, type: string) {
  instance.login(paranms, type)
}

const logout = function (paranms: any, type: string) {
  instance.logout(paranms, type)
}

const customerChat = function (paranms: any, type: string) {
  instance.customerChat(paranms, type)
}

export { customerChat, IMTYPE, login, logout, putInstance }
