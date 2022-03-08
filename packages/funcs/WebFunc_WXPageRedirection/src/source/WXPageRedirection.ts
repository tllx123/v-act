import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空

let sandbox
export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param: FunctionContext) {
  //获取函数传入的参数
  let args = param.getArgs()
  let argsLen = args ? args.length : 0
  let componentCode = argsLen >= 1 ? args[0] : null
  let windowCode = argsLen >= 2 ? args[1] : null
  let title = null
  let windowInputParams = { variable: {} }
  browser.redirectLocation({
    componentCode: componentCode,
    windowCode: windowCode,
    title:
      title == undefined || title == null ? title : encodeURIComponent(title),
    inputParam: windowInputParams
  })
}

export { main }
