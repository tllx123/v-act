import { EncryptUtil as newEncryptUtil } from '@v-act/vjs.framework.extension.platform.interface.domain.encrypt'
import { EncryptUtil as encryptUtil } from '@v-act/vjs.framework.extension.platform.services.domain.encryption'
import { DesUtil as desUtil } from '@v-act/vjs.framework.extension.util.des'
import { EasyTemplateUtil as easyTemplateUtil } from '@v-act/vjs.framework.extension.util.easytemplate'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
/**
 * 字符串工具方法
 * @desc 提供与字符串相关的一系列接口，使用前请先import：vds.import("vds.string.*")
 * @namespace vds/string
 * @module string
 * @catalog 工具方法/字符串
 * @example
 * vds.import("vds.string.*");
 * vds.string.concat("a","b","c");
 */
import { StringUtil as strUtil } from '@v-act/vjs.framework.extension.util.string'
import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'

/**
 * 拼接字符串
 * @param {String} str1 字符串
 * @param {String} str2 字符串
 * @returns {String}
 * @example
 * vds.string.concat("a","b");//ab
 */
export function concat(str1: string, str2: string) {
  return strUtil.concat(str1, str2)
}

/**
 * 查找指定字符串下标
 * @param {String} str 字符串
 * @param {String} value 搜索值
 * @param {Integer} begin 偏移值，取值范围：0至str.length-1,默认值为0
 * @returns {Integer}
 * @example
 * vds.string.indexOf("abc","b");//1
 * vds.string.indexOf("abc","d");//-1
 * vds.string.indexOf("abcabc","b",2);4
 */
export function indexOf(str: string, value: string, begin: number | undefined) {
  return strUtil.indexOf(str, value, begin)
}

/**
 * 判断是否为undefined、null、空字符串
 * @param {Any} str 任意值
 * @returns {Boolean}
 * @example
 * vds.string.isEmpty("");//true
 * vds.string.isEmpty(null);//true
 * vds.string.isEmpty(undefined);//true
 * vds.string.isEmpty("adsf");//false
 */
export function isEmpty(str: string) {
  return strUtil.isEmpty(str)
}

/**
 * 查找指定字符串最后出现的下标
 * @param {String} str 字符串
 * @param {String} value 搜索值
 * @param {Integer} begin 偏移量
 * @returns {Integer}
 * @example
 * vds.string.lastIndexOf("abcabc","b");//4
 */
export function lastIndexOf(
  str: string,
  value: string,
  begin: number | undefined
) {
  return strUtil.lastIndexOf(str, value, begin)
}

/**
 * 去除左边空格。
 * @param {String} str 字符串
 * @returns {String}
 * @example
 * vds.string.ltrim("   abc");//abc
 */
export function ltrim(str: string) {
  return strUtil.ltrim(str)
}

/**
 * 替换指定的字符串
 * @param {String} str 字符串
 * @param {String|RegExp} replace 被替换的字符串或正则
 * @param {String} replacement 替换字符串
 * @returns {String}
 * @example
 * vds.string.replace("abcabc","a","ddd");//dddbcabc
 * vds.string.replace("abbcabc",/b+/,"ddd");//adddcabc
 */
export function replace(str: string, replace: string, replacement: string) {
  return strUtil.replace(str, replace, replacement)
}

/**
 * 在指定位置替换字符串
 * @param {String} str 字符串
 * @param {String} replacement 替换字符串
 * @param {Integer} begin 开始位置
 * @param {Integer} end 结束位置（不包含）
 * @returns {String}
 * @example
 * vds.string.replaceByIndex("abc","ddd",1,2);//adddc
 */
export function replaceByIndex(
  str: string,
  replacement: string,
  begin: number,
  end: number | undefined
) {
  return strUtil.replaceByIndex(str, replacement, begin, end)
}

/**
 * 去除右边空格
 * @param {String} str 字符串
 * @returns {String}
 * @example
 * vds.string.rtrim("abc   ");//abc
 */
export function rtrim(str: string) {
  return strUtil.rtrim(str)
}

/**
 * 去除全部空格
 * @param {String} str 字符串
 * @returns {String}
 * @example
 * vds.string.trim("   abc   ");//abc
 */
export function trim(str: string | null) {
  if (null == str || typeof str != 'string') {
    return str
  }
  return strUtil.trim(str)
}

/**
 * 在字符串中的指定位置截取指定长度
 * @param {String} str 字符串
 * @param {Integer} begin 开始位置，取值范围：0~str.length-1
 * @param {Integer} length 截取长度,取值范围：0~str.length-1-begin
 * @returns {String}
 * @example
 * vds.string.substr("abcdefg",1,3);//bcd
 */
export function substr(str: string, begin: number, length: number) {
  return strUtil.substr(str, begin, length)
}

/**
 * 指定开始位置和结束位置截取字符串
 * @param {String} str 字符串
 * @param {Integer} begin 开始位置，取值范围：0~str.length-1
 * @param {Integer} end 结束位置(不包含),取值范围：begin~str.length
 * @returns {String}
 * @example
 * vds.string.substring("abcdefg",1,3);//bc
 */
export function substring(str: string, begin: number, end: number) {
  return strUtil.substring(str, begin, end)
}

/**
 * 将字符串转成小写
 * @param {String} str 字符串
 * @returns {String}
 * @example
 * vds.string.toLowerCase("AbcD");//abcd
 */
export function toLowerCase(str: string) {
  return strUtil.toLowerCase(str)
}

/**
 * 将字符串转成大写
 * @param {String} str 字符串
 * @returns {String}
 * @example
 * vds.string.toUpperCase("AbcD");//ABCD
 */
export function toUpperCase(str: string) {
  return strUtil.toUpperCase(str)
}

/**
 * 生成加密后的hash值
 * @param {String} val 来源值
 * @returns {String}
 * @example
 * vds.string.genHash("yindangu");
 */
export function genHash(val: string) {
  return encryptUtil.genHash(val, 'base64') //默认base64加密，后续有需求再开放加密类型
}

/**
 * 生成加密后的hash值
 * @param {String} val 来源值
 * @returns {String}
 * @example
 * vds.string.toMD5("yindangu");
 */
export function toMD5(val: any) {
  return desUtil.toMD5(val)
}

/**
 * 生成UUID
 * @returns {String}
 * @example
 * vds.string.uuid();
 */
export function uuid() {
  return uuidUtil.generate()
}

/**
 * 判断数组是否包含指定的字符串
 * @param {String} str 指定的字符串
 * @param {Array<String>} array 数组
 * @returns {Boolean}
 * @example
 * vds.string.isInArray("AAA", ["AAA","BBB","CCC"]);//true
 */
export function isInArray(str: string, array: string[]) {
  return strUtil.isInArray(str, array)
}

/**
 * 生成模板
 * @param {String} template 模板
 * @param {Object} slot 插槽数据
 * @returns {String}
 * @example
 * vds.string.template("${a}和${b}的天气不错.",{"a":"昨天","b":"今天"});//昨天和今天的天气不错.
 */
export function template(template: string, slot: Record<string, any>) {
  return easyTemplateUtil.easyTemplate(template, slot)
}
/**
 * 对象转字符串
 * @param {Object} obj 需要转字符串的对象
 * @returns {String}
 * @example
 * vds.string.toJson({key1:"value1",key2:true});//'{"key1":"value1","key2":true}'
 */
export function toJson(obj: string | Record<string, any>) {
  return jsonUtil.obj2json(obj)
}
/**
 * 加密类型
 * @enum
 * */
const EncryptType = {
  /**
   * 基于RFC 1321。安全性一般，性能高，不可逆，返回32位16进制。主要用于一致性验证、数字签名等
   * */
  'md5': 'md5',
  /**
   * 基于NIST's FIPS 180-4，安全比md5高，性能比md5慢，不可逆，返回32位16进制。
   * */
  'SHA-1': 'SHA-1',
  /**
   * 基于NIST's FIPS 180-4，安全比SHA-1高，性能比SHA-1慢，不可逆，返回64位16进制。
   * */
  'SHA-256': 'SHA-256',
  /**
   * 基于NIST's FIPS 180-4，安全比SHA-256高，性能比SHA-256慢，不可逆，返回96位16进制。
   * */
  'SHA-384': 'SHA-384',
  /**
   * 基于NIST's FIPS 180-4，安全比SHA-384高，性能比SHA-384慢，不可逆，返回128位16进制。
   * */
  'SHA-512': 'SHA-512',
  /**
   * 基于PKCS #5。对称加密，可逆，安全性高，是一种区块加密标准。广泛用于金融财务、在线交易等领域。
   * */
  'AES': 'AES'
}

export { EncryptType }
/**
 * 字符串加密
 * @param {String} value 需要加密的字符串
 * @param {String} type 加密类型
 * @param {String} secretKey 当参数二为EncryptType.AES时需要传入，AES密钥要求：长度要求为16byte，不足将补0，超过16byte将自动截取。不建议使用中文作为密钥，推荐大小字符以及数字的组合。
 * @returns {String}
 * @example
 * vds.import("vds.string.*");
 * var value = vds.string.encrypt("12345",exports.EncryptType.md5);
 * */
export function encrypt(value: any, type: any, secretKey: undefined) {
  var result: any
  switch (type) {
    case EncryptType.AES:
      result = newEncryptUtil.encryptWithKey(value, type, secretKey)
      break
    default:
      result = newEncryptUtil.encrypt(value, type)
  }
  if (result && result instanceof Object && result.toString) {
    result = result.toString()
  }
  return result
}
/**
 * 字符串解密,仅支持以AES方式加密的字符串
 * @param {String} value 需要解密的字符串
 * @param {String} secretKey 密钥
 * @returns {String}
 * @example
 * vds.import("vds.string.*");
 * vds.string.decrypt("12345","abc");
 * */
export function decryptAES(value: null | string, secretKey: null | string) {
  if (null == value || null == secretKey) {
    return null
  }
  return newEncryptUtil.decryptWithKey(value, 'aes', secretKey)
}
/**
 * 数值型字符串相加
 * @param {String} numStr 数值型的字符串
 * @param {Integer} num 累加的加数
 * @return {String}
 * */
export function numberAdd(numStr: string, num: number) {
  return mathUtil.numberCodeAdd(numStr, num)
}
