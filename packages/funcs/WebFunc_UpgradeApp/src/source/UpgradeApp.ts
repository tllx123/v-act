import { Inappbrowser as BrowserService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param: FunctionContext) {
  let FUNCTIONNAME = '函数[升级APP-UpgradeApp]'
  let BROWERTYPE = BrowserService.BROWERTYPE.SystemBrowser

  //获取函数传入的参数
  let args = param.getArgs()
  //判断参数个数
  CheckParamNum(FUNCTIONNAME, args, 1)

  //获取参数
  let url = args[0] //获取函数第一个参数

  //判断参数是否为空
  CheckParamEmpty(FUNCTIONNAME, 'colorName', url)

  //调用vjs服务
  BrowserService.open(url, BROWERTYPE)
}
/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * */
function CheckParamNum(funName, paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    throw new Error(
      funName +
        '需要' +
        targetNum +
        '个参数，当前参数个数：' +
        paramArray.length
    )
  }
}
/*
 * 判断参数是否为空
 * paramName 参数名称
 * paramValue 参数值
 * */
function CheckParamEmpty(funName, paramName, paramValue) {
  if (paramValue == null) {
    throw new Error(funName + '的参数[' + paramName + ']不能为空！')
  }
}
export { main }
