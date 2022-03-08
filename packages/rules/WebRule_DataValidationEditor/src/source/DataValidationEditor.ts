import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { StoreTypes as widgetAttribute } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { EasyTemplateUtil as easyTemplateUtil } from '@v-act/vjs.framework.extension.util.easytemplate'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { MathUtil as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util.string'

let expressType

let ERRORNAME

export function initModule(sBox) {
  sb = sBox
}
/**
 * 校验不为空
 */
let isNotEmpty = function (str) {
  return !stringUtil.isEmpty(str)
}

/**
 * 校验是否数字
 */
let judgeNumExt = function (num) {
  return mathUtil.isNum(num)
}

/**
 * 校验身份证号码（15位/18位）
 */
function isIdCardNo(idCardNum) {
  let aCity = {
    11: i18n.get('北京', '城市名称'),
    12: i18n.get('天津', '城市名称'),
    13: i18n.get('河北', '城市名称'),
    14: i18n.get('山西', '城市名称'),
    15: i18n.get('内蒙古', '城市名称'),
    21: i18n.get('辽宁', '城市名称'),
    22: i18n.get('吉林', '城市名称'),
    23: i18n.get('黑龙江', '城市名称'),
    31: i18n.get('上海', '城市名称'),
    32: i18n.get('江苏', '城市名称'),
    33: i18n.get('浙江', '城市名称'),
    34: i18n.get('安徽', '城市名称'),
    35: i18n.get('福建', '城市名称'),
    36: i18n.get('江西', '城市名称'),
    37: i18n.get('山东', '城市名称'),
    41: i18n.get('河南', '城市名称'),
    42: i18n.get('湖北', '城市名称'),
    43: i18n.get('湖南', '城市名称'),
    44: i18n.get('广东', '城市名称'),
    45: i18n.get('广西', '城市名称'),
    46: i18n.get('海南', '城市名称'),
    50: i18n.get('重庆', '城市名称'),
    51: i18n.get('四川', '城市名称'),
    52: i18n.get('贵州', '城市名称'),
    53: i18n.get('云南', '城市名称'),
    54: i18n.get('西藏', '城市名称'),
    61: i18n.get('陕西', '城市名称'),
    62: i18n.get('甘肃', '城市名称'),
    63: i18n.get('青海', '城市名称'),
    64: i18n.get('宁夏', '城市名称'),
    65: i18n.get('新疆', '城市名称'),
    71: i18n.get('台湾', '城市名称'),
    81: i18n.get('香港', '城市名称'),
    82: i18n.get('澳门', '城市名称'),
    91: i18n.get('国外', '城市名称')
  }
  if (idCardNum == null) {
    log.error('身份证号码存在空值')
    return false
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

/**
 * 校验日期
 */
let checkDate = function (dateStr) {
  let reg =
    /^(\d{1,4})[-\/](\d{1,2})[-\/](\d{1,2})( (\d{1,2}):(\d{1,2}):(\d{1,2}))?$/
  if (dateStr == null) {
    log.error('日期存在空值')
    return false
  }
  let r = dateStr.match(reg)
  if (r == null) {
    return false
  } else {
    let result = true
    r[2] = r[2] - 1
    if (!r[5]) {
      r[5] = 0
    }
    if (!r[6]) {
      r[6] = 0
    }
    if (!r[7]) {
      r[7] = 0
    }
    let d = new Date(r[1], r[2], r[3], r[5], r[6], r[7])
    if (d.getFullYear() != r[1]) result = false
    if (d.getMonth() != r[2]) result = false
    if (d.getDate() != r[3]) result = false
    if (d.getHours() != r[5]) result = false
    if (d.getMinutes() != r[6]) result = false
    if (d.getSeconds() != r[7]) result = false
    return result
  }
}

/**
 * 长度校验
 */
let limit = function (str, parameter) {
  let params = parameter.split(',')
  if (params.length != 3) {
    log.error('输入字符长度限制,参数必须为3个并以逗号隔开，请检查')
    return false
  }
  let min = params[0]
  let max = params[1]
  let byByte = params[2]
  if (!mathUtil.isNum(min) || !mathUtil.isNum(max) || !mathUtil.isNum(byByte)) {
    log.error('输入字符长度限制,参数必须全部为数字')
    return false
  } else {
    min = new Number(min)
    max = new Number(max)
    byByte = new Number(byByte)
    if (min > max) {
      log.error('输入字符长度限制参数,最小长度必须小于最大长度')
      return false
    }
    if (byByte != 0 && byByte != 1) {
      log.error('输入字符长度限制,是否按字节比较参数只能是0或者1')
      return false
    }
  }
  max = max == 0 ? Number.MAX_VALUE : max
  let len = 0
  if (str != null) {
    if (byByte == 1) {
      len = str.replace(/[^\x00-\xff]/g, '**').length
    } else {
      len = str.length
    }
  }
  return min <= len && len <= max
}

/**
 * 数值区间校验
 */
let checkNum = function (num, parameter) {
  if (!mathUtil.isNum(num)) {
    log.error('判断输入数值是否在(n, m)区间,校验内容[' + num + ']必须为数字')
    return false
  }
  let params = parameter.split(',')
  if (params.length != 2) {
    log.error('判断输入数值是否在(n, m)区间,参数必须为2个并以逗号隔开，请检查')
    return false
  }
  let min = params[0]
  let max = params[1]
  if (!mathUtil.isNum(min) || !mathUtil.isNum(max)) {
    log.error('判断输入数值是否在(n, m)区间,参数必须全部为数字')
    return false
  } else {
    num = new Number(num)
    min = new Number(min)
    max = new Number(max)
    if (min > max) {
      log.error('判断输入数值是否在(n, m)区间,最小数值必须小于最大数值')
      return false
    }
  }
  return min <= num && num <= max
}

/**
 * 正则表达式校验
 */
let checkRegularExp = function (val, regularExp) {
  try {
    let reg = new RegExp(eval('/' + regularExp + '/'))
    let bool = reg.test(val)
    return bool
  } catch (e) {
    log.error('正则表达式不正确，请检查')
    return false
  }
}
let regs = [
  isNotEmpty, //0.是否为空
  /^[\u0391-\uFFE5]+$/, //1.中文字符
  /^[^\x00-\xff]$/, //2.双字节字符
  /^[A-Za-z]+$/, //3.英文
  /^\d+$/, //4.数字字符串
  /^[-\+]?([1-9]\d+|[0-9])$/, //5.整数
  judgeNumExt, //6.数字(整数/小数)
  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //7.Email地址
  /^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, //8.使用HTTP协议的网址
  /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/, //9.电话号码
  /^\d+(\.\d+)?$/, //10.货币
  /^0?(13[0-9]|15[012356789]|18[0-9]|14[57]|16[679]|17[01356789]|19[89])[0-9]{8}$/, //11.手机号码
  /^\d{6}$/, //12.邮政编码 Ps：2017-02-14 liangzc：支持以0开头的邮编
  isIdCardNo, //13.身份证号码
  /^[1-9]\d{4,}$/, //14.QQ号码
  checkDate, //15.日期
  /^.{6,}$/, //16.密码
  limit, //17.输入字符长度限制(n-最小长度, m-最大长度, k-是否按字节:0否1是。长度不限制填0)
  checkNum, //18.判断输入数值是否在区间(n-最小数值, m-最大数值)
  /^\w+$/, //19.帐号
  checkRegularExp //20.正则表达式
]

//规则主入口(必须有)
const main = function (ruleContext) {
  ERRORNAME = '规则[DataValidationEditor]: '
  let checkResult = true
  let userConfirm = true
  let ruleConfig = ruleContext.getRuleCfg()
  let paramsValue = ruleConfig['inParams']
  let inParams = jsonUtil.json2obj(paramsValue)

  let messageType = inParams['messageType']
  let checkData = inParams['checkData']
  let finalMessage = ''
  let entityErrorMsg = [] //全部实体校验错误信息
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  for (let i = 0; i < checkData.length; i++) {
    let checkItem = checkData[i]
    let checkType = checkItem['checkType'] //校验类型
    let dataSource = checkItem['dataSource'] //数值
    let dataType = checkItem['dataType'] //数据来源
    let message = checkItem['message'] //消息提示
    if (null != message && '' != message) {
      message = formulaUtil.execute({
        expression: message,
        context: context
      })
    }
    let parameter = checkItem['parameter'] //参数
    let singleEntityError = [] //单个实体校验错误信息
    if (dataType == 'expression') {
      expressType = true
      let currValue = getValueByType(dataType, dataSource, ruleContext)
      let reg = regs[checkType]
      //数字类型校验位空格 直接提示错误
      if (
        checkType == 6 &&
        currValue &&
        stringUtil.trim(currValue).length == 0
      ) {
        checkResult = false
        finalMessage += message + '\n'
      } else if (typeof reg == 'function') {
        if (!reg(currValue, parameter)) {
          checkResult = false
          finalMessage += message + '\n'
        }
      } else {
        if (!reg.test(currValue)) {
          checkResult = false
          finalMessage += message + '\n'
        }
      }
    } else if (dataType == 'entityfield') {
      expressType = false
      let dbCode = dataSource.split('.')[0]
      let fieldCode = dataSource.split('.')[1]
      let dataSourceObj = GetDataSource(dbCode, ruleContext)
      let isAddMsg = false //是否已经添加了错误信息
      if (dataSourceObj) {
        let datas = dataSourceObj.getAllRecords().toArray()
        if (datas && datas.length > 0) {
          for (let j = 0; j < datas.length; j++) {
            let currValue = datas[j].get(fieldCode)
            let reg = regs[checkType]
            //数字类型校验位空格 直接提示错误
            if (
              checkType == 6 &&
              currValue &&
              stringUtil.trim(currValue).length == 0
            ) {
              checkResult = false
              if (!isAddMsg) {
                //									finalMessage += message + "\n";
                isAddMsg = true
              }
              singleEntityError.push(j + 1)
            } else if (typeof reg == 'function') {
              if (!reg(currValue, parameter)) {
                checkResult = false
                if (!isAddMsg) {
                  //										finalMessage += message + "\n";
                  isAddMsg = true
                }
                singleEntityError.push(j + 1)
              }
            } else {
              if (!reg.test(currValue)) {
                checkResult = false
                if (!isAddMsg) {
                  //										finalMessage += message + "\n";
                  isAddMsg = true
                }
                singleEntityError.push(j + 1)
              }
            }
          }
          if (isAddMsg) {
            let msg = i18n.get(
              '${a} 第${b}行数据校验不通过${c}',
              '数据合法性规则的校验信息'
            )
            msg = easyTemplateUtil
              .easyTemplate(msg, {
                a: message,
                b: singleEntityError.join(','),
                c: '\n'
              })
              .toString()
            finalMessage += msg
          }
        } else {
          finalMessage += message + '\n'
        }
      } else {
        log.error('实体[' + dbCode + ']不存在')
        return false
      }
    }
  }
  let callback = function (val) {
    userConfirm = typeof val == 'boolean' ? val : userConfirm
    setBusinessRuleResult(ruleContext, checkResult, userConfirm)
    ruleContext.setRuleStatus(true)
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
  }

  //如果检查不通过，处理提示信息
  if (!checkResult) {
    if (messageType == 0) {
      //不提示，直接返回验证结果
      setBusinessRuleResult(ruleContext, checkResult, userConfirm)
    } else {
      if (messageType == 1) {
        //提示，继续执行
        dialogUtil.propmtDialog(finalMessage, callback, false)
      } else if (messageType == 2) {
        //警告，继续执行
        dialogUtil.warnDialog(finalMessage, callback, false)
      } else if (messageType == 3) {
        //错误，不能继续
        dialogUtil.errorDialog(finalMessage, callback, false)
      } else if (messageType == 4) {
        //询问（确定/取消），根据用户选择继续或终止
        dialogUtil.confirmDialog(finalMessage, callback, false)
      }
      ruleContext.markRouteExecuteUnAuto()
    }
  } else {
    setBusinessRuleResult(ruleContext, checkResult, userConfirm)
  }
  return true
}

/**
 * 设置业务返回结果
 */
function setBusinessRuleResult(ruleContext, result, userConfirm) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isValidateOK: result, //业务返回结果：校验是否通过
      confirm: userConfirm
    })
  }
}

let getValueByType = function (dataType, dataSource, ruleContext) {
  let result = ''
  switch (dataType) {
    case '1': //界面实体
      var dsName = dataSource.substring(0, dataSource.indexOf('.'))
      var colName = dataSource.substring(
        dataSource.indexOf('.') + 1,
        dataSource.length
      )

      var dataSource = datasourceManager.lookup({
        datasourceName: dsName
      })
      var selectedValues = dataSource.getCurrentRecord()
      if (selectedValues) {
        result = selectedValues.get(colName)
      }
      break
    case '2': //控件
      var controlInfo = dataSource.split('.')
      var valueQueryControlID = controlInfo[0]
      var propertyCode = controlInfo[1]
      var widgetType = widgetContext.get(valueQueryControlID, 'widgetType')
      var storeType = widgetContext.getStoreType(widgetType)
      if (widgetAttribute.storeTypes.SET == storeType) {
        //该规则不会传入集合控件ID
      } else if (
        widgetAttribute.storeTypes.SINGLE_RECORD_MULTI_VALUE == storeType
      ) {
        // 单记录多值控件，按照控件属性名字取得关联的标识，再进行取值
        //	var multiValue = viewModel.getDataModule().getSingleRecordMultiValue(valueQueryControlID);
        var dsNames = windowVmManager.getDatasourceNamesByWidgetCode({
          widgetCode: valueQueryControlID
        })
        var dsName = dsNames[0]
        var dataSource = datasourceManager.lookup({
          datasourceName: dsName
        })
        var multiValue = dataSource.getCurrentRecord()
        //var widgetType = viewContext.getWidgetContext(valueQueryControlID, "widgetType");
        //var defineFields = definerUtil.getWidgetVirtualFields(widgetType);
        //var mappingInfo = viewModel.getMetaModule().getMappingInfo(valueQueryControlID);
        var refField = windowVmManager.getFieldCodeByPropertyCode({
          widgetCode: valueQueryControlID,
          propertyCode: propertyCode
        })
        result = multiValue[refField]
        break
      } else if (widgetAttribute.storeTypes.SINGLE_RECORD == storeType) {
        result = widgetProperty.get(valueQueryControlID, 'Value')
      }
      break
    case '3': //表达式
    case 'expression':
      var context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      result = formulaUtil.execute({
        expression: dataSource,
        context: context
      })
      break
    case '4': //系统变量
      result = componentParam.getVariant({
        code: dataSource
      })
      break
    case '5': //组件变量
      result = windowParam.getInput({
        code: dataSource
      })
      break
    default:
      break
  }
  return !result ? '' : result
}
/**
 * desc 获取各类数据源（窗体实体、方法实体）
 * dataSourceName 数据源名称
 * routeContext 路由上下文
 * vjs:
 * 		"vjs.framework.extension.platform.interface.exception":null,
 * 		"vjs.framework.extension.platform.services.model.manager.datasource":null
 * services:
 * 		manager = sandbox.getService("vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager");
 * 		DBFactory = sandbox.getService("vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory");
 * 		ExpressionContext = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionContext");
 * 		engine = sandbox.getService("vjs.framework.extension.platform.services.engine.expression.ExpressionEngine");
 * */
function GetDataSource(dataSourceName, routeContext) {
  let dsName = dataSourceName
  let datasource = null
  if (dsName != null && dsName != '') {
    /*本身是实体对象*/
    if (DBFactory.isDatasource(dsName)) {
      datasource = dsName
    } else {
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      /*窗体实体*/
      if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
        datasource = datasourceManager.lookup({
          datasourceName: dsName
        })
      } else {
        /*方法实体*/
        datasource = formulaUtil.execute({
          expression: dsName,
          context: context
        })
      }
    }
  }
  return datasource
}
export { main }
