import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

const initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  // 获取输入变量Json
  let variableJson = args.length > 0 ? args[0] : null
  if (null == variableJson || '' == variableJson) {
    return
  }
  // 解析，格式List<Map<String,Object>>
  let variableList = jsonUtil.json2obj(variableJson)
  if (null == variableList) {
    return
  }
  for (i = 0; i < variableList.length; i++) {
    let variableMap = variableList[i]
    for (variableKey in variableMap) {
      // 获取变量值
      let value = getValue(variableMap[variableKey])
      // 设置到窗体输入变量中
      windowParam.setInput({
        code: variableKey,
        value: value
      })
    }
  }
}
let getValue = function (value) {
  let returnValue
  // 判断是否是实体
  if (
    value.indexOf('datas') != -1 &&
    value.indexOf('metadata') != -1 &&
    value.indexOf('recordCount') != -1 &&
    value.indexOf('values') != -1 &&
    value.indexOf('model') != -1 &&
    value.indexOf('fields') != -1
  ) {
    try {
      // 解析实体并反序列化,拿到datasource对象
      returnValue = jsonUtil.json2obj(value)
      returnValue = DBFactory.unSerialize(returnValue)
    } catch (e) {
      returnValue = value
    }
  } else {
    returnValue = value
  }
  return returnValue
}
export { initModule, main }
