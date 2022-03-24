import * as bcryptUtil from '../src/bcrypt'

let genHash = function (encryptValue: string) {
  //生成加密后的hash值
  let salt = bcryptUtil.bcrypt.genSaltSync(10)
  let hash = bcryptUtil.bcrypt.hashSync(encryptValue, salt)
  return hash
}
export { genHash }
