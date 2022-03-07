import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let sandbox
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let result = ''
  let FUNCNAME = '函数[GetBirthdayByIdCard]:'
  //获取函数传入的参数
  let args = param.getArgs()
  if (args.length != 1) {
    HandleException(FUNCNAME + '需要一个参数，当前参数个数：' + args.length)
    return ''
  }
  //var id_card = args.get(0);
  let id_card = args[0]
  if (!stringUtil.isEmpty(id_card)) {
    let tmp_idcard = id_card.trim()
    //			if(tmp_idcard.length<id_card.length){
    //				log.warn(FUNCNAME+"检测到身份证号码存在空格，系统先去掉空格，再取生日日期！");
    //			}
    if (isIdCardNo(tmp_idcard)) {
      result = getBirthday(tmp_idcard)
      return result
    } else {
      HandleException(FUNCNAME + '身份证格式不正确！')
      return ''
    }
  } else {
    HandleException(FUNCNAME + '第一个参数不能为空！')
    return ''
  }
}
/*
 * 获取生日日期
 * idCard 身份证号
 * */
function getBirthday(idCard) {
  let tmpStr = ''
  let idDate = ''
  let tmpInt = 0
  let strReturn = ''

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
/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * targetNum 目标参数个数
 * */
function CheckParamNum(funName, paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    HandleException(
      funName +
        '需要' +
        targetNum +
        '个参数，当前参数个数：' +
        paramArray.length
    )
  }
}
/**
 * 校验身份证号码（15位/18位）
 */
function isIdCardNo(idCardNum) {
  let aCity = {
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
    log.error(
      '身份证号长度不对，或者号码不符合规定！15位号码应全为数字，18位号码末位可以为数字或X。'
    )
    return false
  }
  //下面分别分析出生日期和校验位
  let len = idCardNum.length
  if (len == 15) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})(\d{3})$/)
    let arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit[1])] == null) {
      log.error('15位身份证号码中存在非法地区，请检查')
      return false
    }
    //检查生日日期是否正确
    let dtmBirth = new Date(
      '19' + arrSplit[3] + '/' + arrSplit[4] + '/' + arrSplit[5]
    )
    let bGoodDay =
      dtmBirth.getYear() == Number(arrSplit[3]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[4]) &&
      dtmBirth.getDate() == Number(arrSplit[5])
    if (!bGoodDay) {
      log.error('15位身份证号码中存在非法生日，请检查')
      return false
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{2})(\d{4})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
    let arrSplit = idCardNum.match(re)
    if (aCity[parseInt(arrSplit[1])] == null) {
      log.error('18位身份证号码中存在非法地区，请检查')
      return false
    }
    //检查生日日期是否正确
    let dtmBirth = new Date(arrSplit[3] + '/' + arrSplit[4] + '/' + arrSplit[5])
    let bGoodDay =
      dtmBirth.getFullYear() == Number(arrSplit[3]) &&
      dtmBirth.getMonth() + 1 == Number(arrSplit[4]) &&
      dtmBirth.getDate() == Number(arrSplit[5])
    if (!bGoodDay) {
      log.error('18位身份证号码中存在非法生日，请检查')
      return false
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      let valnum
      let arrInt = new Array(
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
      let arrCh = new Array(
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
      let nTemp = 0,
        i
      for (i = 0; i < 17; i++) {
        nTemp += idCardNum.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[nTemp % 11]
      if (valnum != idCardNum.substr(17, 1)) {
        log.error('18位身份证的校验码不正确！末位应为：' + valnum)
        return false
      }
    }
  }
  return true
}

//异常处理方法
function HandleException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Dialog,
    message: tmpvar
  })
  exception.handle()
}

export { main }
