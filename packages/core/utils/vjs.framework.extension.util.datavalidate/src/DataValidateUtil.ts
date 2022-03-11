/**
 *检查数组中是否包含指定值
 * @param Object inputParamValue 使用者输入的类型
 * @param String type 应有的类型
 */
let dataValidate = (inputParamValue: unknown, type: string): boolean =>
  type == checkType(inputParamValue, type)
/**
 *检查数组中是否包含指定值
 * @param String inputParamValue 使用者输入的类型
 *
 */
let checkType = function (inputParamValue: any, desType: string): string {
  let type: string = typeof inputParamValue
  let retType
  if (type == 'boolean') {
    retType = 'boolean'
  } else if (type == 'number') {
    if (parseInt(inputParamValue) == inputParamValue) retType = 'integer'
    else retType = 'number'
  } else {
    retType = desType
    //TODO date,longDate,entity类型还没有写逻辑
  }
  return retType
}

export { dataValidate, checkType }
