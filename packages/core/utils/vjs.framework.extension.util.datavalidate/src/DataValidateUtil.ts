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

/**
 * 生成Ascii码，生成规则：累加key和value的ascii码值
 * @param	{Object}	data
 * @returns	{Object}	校验码
 * {
 * 	"_request_validate_token_"	:	{String}	校验码
 * }
 * */
const genAsciiCode = function (data: { [key: string]: any }) {
  let count: string = '0'
  if (data) {
    const params = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params.push(key)
        params.push(data[key] + '')
      }
    }
    if (params.length > 0) {
      for (let i = 0, len = params.length; i < len; i++) {
        const val = params[i]
        for (let j = 0, l = val.length; j < l; j++) {
          if (typeof val[j].codePointAt == 'function') {
            /* ES6的方法 */
            //@ts-ignore
            count += val[j].codePointAt()
          } else {
            //@ts-ignore
            count += val[j].charCodeAt()
          }
        }
      }
    }
  }
  count += ''
  if (count.length > 16) count = count.substring(0, 16)
  return {
    _request_validate_token_: count
  }
}

export { checkType, dataValidate, genAsciiCode }
