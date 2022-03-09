import * as bcryptUtil from './src/bcrypt'

export function initModule() {}

let genHash = function (encryptValue) {
  //生成加密后的hash值
  let salt = bcryptUtil.bcrypt.genSaltSync(10)
  let hash = bcryptUtil.bcrypt.hashSync(encryptValue, salt)
  return hash
}
export { genHash }