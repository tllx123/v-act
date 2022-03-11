import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import  {FunctionContext} from '@v-act/vjs.framework.extension.platform.interface.function'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
const vds = { math,exception }

const main = function (param:FunctionContext) {
  var FUNCNAME = '函数[SetAlias]：'
  var args = param.getArgs()
  if (args.length != 1) {
    HandleException(FUNCNAME + '需要一个参数，当前参数个数：' + args.length)
  }
  var alias = args[0]
  if (!checkParamValid(alias)) {
    HandleException(FUNCNAME + '参数仅支持数字、字母、下划线、中文')
  }

  if (!checkStringLenValid(alias)) {
    HandleException(FUNCNAME + '仅支持40字节长度的参数')
  }
  //@ts-ignore
  if (window.JPush) {
    //@ts-ignore
    if (window.device && window.device.platform == 'iOS') {
      //@ts-ignore
      window.JPush.setAlias(alias)
    } else {
      //@ts-ignore
      window.JPush.setAlias({
        sequence: vds.math.floor(vds.math.random() * 10000) + 1,
        alias: alias
      })
    }
  } else {
    alert('请确认在移动App端使用此【SetAlias】函数，并且开启【极光推送】插件')
  }
}
function HandleException(error_msg:string) {
  log.log(error_msg);
  return false;
  // 以下逻辑将使手机端前台页面弹出提示信息
  // var exception = factory.create({
  // 	"type": factory.TYPES.Dialog,
  // 	"message": error_msg
  // });
  // throw exception;
};
/**
	 * desc 判断入参字节长度是否小于40字节（UTF-8）
	 * param 入参
	 * */
	function checkStringLenValid(param:any) {
		var totalLength = 0,
			i, charCode;

		for (i = 0; i < param.length; i++) {
			charCode = param.charCodeAt(i);
			if (charCode < 0x007f)
				totalLength = totalLength + 1;
			else if ((0x0080 <= charCode) && (charCode <= 0x07ff))
				totalLength += 2;
			else if ((0x0800 <= charCode) && (charCode <= 0xffff))
				totalLength += 3;
		}

		if (totalLength > 40)
			return false
		else
			return true
	};
  /**
	 * desc 判断入参是否符合规范，仅支持数字、字母、下划线、中文
	 * param 入参
	 * */
	function checkParamValid(param:any) {
		if (param === "")
			return true

		var reg = new RegExp("^[0-9a-zA-Z_\u4e00-\u9FA5]+$");
		return reg.test(param)
	};
export { main }
