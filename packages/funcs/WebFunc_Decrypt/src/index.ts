/**
 *  Decrypt 解密函数
 * 输入：decryptValue：需要解密的值
 *     type：解密类型
 * 输出：解密后的值
 *
 */
const main = function (decryptValue: any, type: string, secretkey: string) {
  let result = ''
  if (decryptValue == null || decryptValue == undefined) {
    let exception = vds.exception.newConfigException('解密的值不能为空!')
    throw exception
  }
  if (type == null || type == undefined) {
    let exception = vds.exception.newConfigException('解密的类型不能为空!')
    throw exception
  }
  if (secretkey) {
    result = math.decryptPwdHash(decryptValue, type, secretkey)
  } else {
    result = math.decryptHash(decryptValue, type)
  }
  return result
}
export { main }
