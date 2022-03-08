/**
 *
 *
 */
vds.import('vds.object.*', 'vds.exception.*', 'vds.date.*', 'vds.rpc.*')
var main = function (idcard) {
  var result = 0
  if (vds.object.isUndefOrNull(idcard)) {
    throw vds.exception.newConfigException('身份证号不能为空')
  }
  if (isIdCardNo(idcard)) {
    result = getAge(idcard)
  } else {
    throw vds.exception.newConfigException('身份证格式不正确！')
  }
  return result
}

function getNowDate() {
  var date = vds.date.format(vds.rpc.getDate(), 'yyyy-MM-dd')
  return date
}
/**
 * 获取年龄
 * idCard 身份证号
 * */
function getAge(idCard) {
  var birthYear = 0
  var birthMonth = 0
  var birthDay = 0
  var tmpStr = idCard
  if (/(^\d{15}$)/.test(idCard)) {
    tmpStr = '19' + idCard.substring(6, 12)
  } else {
    tmpStr = idCard.substring(6, 14)
  }
  birthYear = Number(tmpStr.substring(0, 4))
  birthMonth = Number(tmpStr.substring(4, 6))
  birthDay = Number(tmpStr.substring(6))

  var returnAge
  var d = getNowDate().split('-')
  var nowYear = Number(d[0])
  var nowMonth = Number(d[1])
  var nowDay = Number(d[2])

  if (nowYear == birthYear) {
    returnAge = 0 //同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        var monthDiff = nowMonth - birthMonth //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      if (ageDiff < 0 || nowMonth - birthMonth < 0 || nowDay - birthDay < 0)
        throw vds.exception.newConfigException('出生日期晚于今天')
      else returnAge = 0
      //returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge //返回周岁年龄
}
/**
 * 校验身份证号码（15位/18位）
 */
function isIdCardNo(idCardNum) {
  var aCity = {
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
      '身份证号长度不对，或者号码不符合规定。'
    )
  }
  //下面分别分析出生日期和校验位
  var len = idCardNum.length
  var re
  if (len == 15) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    var arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit[1])] == null) {
      throw vds.exception.newConfigException('身份证号码中存在非法地区，请检查')
    }
    //检查生日日期是否正确
    var dtmBirth = new Date(
      '19' + arrSplit[3] + '/' + arrSplit[4] + '/' + arrSplit[5]
    )
    var bGoodDay =
      dtmBirth.getYear() == Number(arrSplit[3]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[4]) &&
      dtmBirth.getDate() == Number(arrSplit[5])
    if (!bGoodDay) {
      throw vds.exception.newConfigException('身份证号码中存在非法生日，请检查')
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    var arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit[1])] == null) {
      throw vds.exception.newConfigException('身份证号码中存在非法地区，请检查')
    }
    //检查生日日期是否正确
    var dtmBirth = new Date(arrSplit[3] + '/' + arrSplit[4] + '/' + arrSplit[5])
    var bGoodDay =
      dtmBirth.getFullYear() == Number(arrSplit[3]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[4]) &&
      dtmBirth.getDate() == Number(arrSplit[5])
    if (!bGoodDay) {
      throw vds.exception.newConfigException('身份证号码中存在非法生日，请检查')
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
        nTemp += idCardNum.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[nTemp % 11]
      if (valnum != idCardNum.substr(17, 1)) {
        throw vds.exception.newConfigException(
          '身份证号码格式不正确或是无效号码，请检查'
        )
      }
    }
  }
  return true
}
export { main }
