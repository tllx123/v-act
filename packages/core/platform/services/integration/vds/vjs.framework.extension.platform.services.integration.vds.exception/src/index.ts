/**
 * 异常工具方法
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.exception.*")
 * @namespace vds/exception
 * @module exception
 * @catalog 工具方法/异常
 * @example
 * vds.import("vds.exception.*");
 * vds.exception.warn("打印警告信息！");
 */

import {
  ExceptionFactory as factory,
  ExceptionHandler as exceptionHandler
} from '@v-act/vjs.framework.extension.platform.interface.exception'

/**
 * 创建配置类异常
 * @param {String} msg
 * @returns {Exception}
 * @example
 * vds.exception.newConfigException("配置错误");
 * */
export function newConfigException(msg: any) {
  var exception = factory.create({
    message: msg,
    type: factory.TYPES.Config,
    exceptionDatas: []
  })
  return exception
}
/**
 * 创建业务类异常
 * @param {String} msg
 * @returns {Exception}
 * @example
 * vds.exception.newBusinessException("业务错误");
 * */
export function newBusinessException(msg: any) {
  var exception = factory.create({
    message: msg,
    type: factory.TYPES.Business,
    exceptionDatas: []
  })
  return exception
}
/**
 * 创建环境类异常
 * @param {String} msg
 * @returns {Exception}
 * @example
 * vds.exception.newDevException("环境错误");
 * */
export function newDevException(msg: any) {
  var exception = factory.create({
    message: msg,
    type: factory.TYPES.Dev,
    exceptionDatas: []
  })
  return exception
}
/**
 * 创建系统类异常
 * @param {String} msg
 * @returns {Exception}
 * @example
 * vds.exception.newConfigException("系统错误");
 * */
export function newSystemException(msg: any) {
  var exception = factory.create({
    message: msg,
    type: factory.TYPES.System,
    exceptionDatas: []
  })
  return exception
}
/**
 * 判断是否平台异常对象
 * @param {Object} exception
 * @returns {Boolean}
 * @example
 * var exception = vds.exception.newConfigException("配置错误");
 * vds.exception.isException(exception);//true
 * vds.exception.isException(new Error("系统错误"));//false
 * */
export function isException(obj: string) {
  return factory.isException(obj)
}
/**
 * 处理异常，支持平台异常对象和原生Error对象
 * @param {Object} exception 异常对象
 * @returns {Boolean}
 * @example
 * var exception = vds.exception.newConfigException("配置错误");
 * vds.exception.handle(exception);
 * vds.exception.handle(new Error("系统错误"));
 * */
export function handle(exception: any) {
  exceptionHandler.handle(exception)
}
//    /**暂时不出，目前的问题场景（CallWebapi）可以把异常创建逻辑写在接口内部
//     * 创建服务端异常
//     * @param {String} message 异常信息
//     * @param {String} type 异常类型
//     * @param {String} detail 异常详情
//     * */
//    export function newServiceException(message, type, detail){
//    	var exception = factory.create({
//    		"message":message,
//    		"type":type,
//    		"data":detail
//    	});
//    	//标记为服务端异常
//    	exception.markServiceException();
//    	return exception;
//    }
