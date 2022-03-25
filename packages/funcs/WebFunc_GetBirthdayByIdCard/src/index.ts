import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

/**
 *根据身份证号获取生日日期
 *
 */
//vds.import('vds.object.*', 'vds.exception.*')

let vds = {
  object,
  exception
}
const main = function (id_card: string) {
  if (vds.object.isUndefOrNull(id_card)) {
    throw vds.exception.newConfigException('身份证号码不能为空！')
  }
  var tmp_idcard = id_card.trim()
  if (isIdCardNo(tmp_idcard)) {
    var result = getBirthday(tmp_idcard)
    return result
  } else {
    throw vds.exception.newConfigException('身份证格式不正确！')
  }
}

/*
 * 获取生日日期
 * idCard 身份证号
 * */
function getBirthday(idCard: string) {
  var tmpStr = ''
  if (idCard.length == 15) {
    tmpStr = idCard.substring(6, 12)
    tmpStr = '19' + tmpStr
    tmpStr =
      tmpStr.substring(0, 4) +
      '-' +
      tmpStr.substring(4, 6) +
      '-' +
      tmpStr.substring(6)
    return tmpStr
  } else {
    tmpStr = idCard.substring(6, 14)
    tmpStr =
      tmpStr.substring(0, 4) +
      '-' +
      tmpStr.substring(4, 6) +
      '-' +
      tmpStr.substring(6)
    return tmpStr
  }
}
/**
 * 校验身份证号码（15位/18位）
 */
function isIdCardNo(idCardNum: string) {
  var aCity: Record<string, string> = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  idCardNum = idCardNum.toUpperCase()
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idCardNum)) {
    throw vds.exception.newConfigException(
      '身份证号长度不对，或者号码不符合规定！15位号码应全为数字，18位号码末位可以为数字或X。'
    )
  }
  //下面分别分析出生日期和校验位
  var len = idCardNum.length
  var re
  if (len == 15) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    var arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit ? arrSplit[1] : '###')] == null) {
      throw vds.exception.newConfigException(
        '15位身份证号码中存在非法地区，请检查'
      )
    }
    //检查生日日期是否正确
    var dtmBirth = new Date(
      arrSplit ? `19${arrSplit[3]}/${arrSplit[4]}/${arrSplit[5]}` : ''
    )
    var bGoodDay =
      //@ts-ignore
      dtmBirth.getYear() == Number(arrSplit ? arrSplit[3] : '###') &&
      dtmBirth.getMonth() + 1 == Number(arrSplit ? arrSplit[4] : '###') &&
      dtmBirth.getDate() == Number(arrSplit ? arrSplit[5] : '###')
    if (!bGoodDay) {
      throw vds.exception.newConfigException(
        '15位身份证号码中存在非法生日，请检查'
      )
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    var arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit ? arrSplit[1] : '###')] == null) {
      throw vds.exception.newConfigException(
        '18位身份证号码中存在非法地区，请检查'
      )
    }
    //检查生日日期是否正确
    var dtmBirth = new Date(
      arrSplit ? `${arrSplit[3]}/${arrSplit[4]}/${arrSplit[5]}` : ''
    )
    var bGoodDay =
      dtmBirth.getFullYear() == Number(arrSplit ? arrSplit[3] : '###') &&
      dtmBirth.getMonth() + 1 == Number(arrSplit ? arrSplit[4] : '###') &&
      dtmBirth.getDate() == Number(arrSplit ? arrSplit[5] : '###')
    if (!bGoodDay) {
      throw vds.exception.newConfigException(
        '18位身份证号码中存在非法生日，请检查'
      )
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum
      var arrInt = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      )
      var arrCh = new Array(
        '1',
        '0',
        'X',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2'
      )
      var nTemp = 0,
        i
      for (i = 0; i < 17; i++) {
        nTemp += Number(idCardNum.substr(i, 1)) * arrInt[i]
      }
      valnum = arrCh[nTemp % 11]
      if (valnum != idCardNum.substr(17, 1)) {
        throw vds.exception.newConfigException(
          '18位身份证的校验码不正确！末位应为：' + valnum
        )
      }
    }
  }
  return true
}
export { main }
