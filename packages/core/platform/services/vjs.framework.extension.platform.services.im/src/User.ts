let instance

const putInstance = function (ins: any) {
  instance = ins
}

const connection = function () {
  return instance.connection()
}

const register = function (
  username: string,
  password: string,
  nickname: string,
  successCB: any,
  errorCB: any
) {
  return instance.register(username, password, nickname, successCB, errorCB)
}

const loginWithPwd = function (
  username: string,
  password: string,
  appkey: string,
  successCB: any,
  errorCB: any
) {
  return instance.loginWithPwd(username, password, appkey, successCB, errorCB)
}

const loginWithToken = function (
  username: string,
  password: string,
  appkey: string,
  successCB: any,
  errorCB: any
) {
  return instance.loginWithToken(username, password, appkey, successCB, errorCB)
}

const quit = function (successCB: any, errorCB: any) {
  return instance.quit(successCB, errorCB)
}

export { connection, register, loginWithPwd, loginWithToken, quit }
