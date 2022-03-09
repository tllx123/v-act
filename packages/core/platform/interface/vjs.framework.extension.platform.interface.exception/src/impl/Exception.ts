import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

import * as exceptionFactory from '../api/ExceptionFactory'
import * as exceptionManager from '../api/ExceptionManager'

/**
 * @namespace Exception
 * @class Exception
 * @desc 异常基础定义
 * @param {Object} message 异常信息
 * @param {Object} e 异常实例
 */

class Exception extends Error {
  name: string = this.constructor.name
  error: Error | null = null
  stacks: Array<string> = []
  errInfo: { [key: string]: any } = {}
  message: string = ''
  errorMsg: string = ''
  isTiped: boolean = false
  handleFunc: null | ((...args: any[]) => void) = null
  serviceException: boolean = false //是否服务端异常
  modalClosed: null | ((...args: any[]) => void) = null //异常弹框关闭后事件 app暂不支持
  errorNo: string = ''
  properties: { containerId: string; feeback: boolean; submit: boolean } = {
    containerId: '', //指定异常渲染的容器
    feeback: true, //是否隐藏反馈按钮,
    submit: true // 是否提交异常，默认提交
  }
  _beforeHandlers: Array<(...args: any[]) => void> = []

  getDetailInfoFunc: null | ((...args: any) => any) = null

  __modalCloseds: Array<(...args: any) => any> = []

  networkError: boolean = false

  viewonly: boolean = false

  constructor(
    message: string,
    e: Error,
    errInfo: { [key: string]: any },
    json: {
      errInfo: { [key: string]: any }
      modalClosed: null | ((...args: any[]) => void)
      submit: boolean
      feeback: boolean
      containerId: string
      errorNo: string
      serviceException: boolean
      errorMsg?: string
      isTiped: boolean
      stacks: string[]
    }
  ) {
    super()
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = this.constructor.name
    this.error = e
    this.stacks = (json && json.stacks) || []
    this.errInfo = (json && json.errInfo) || errInfo || {}
    this.message = message //异常原因
    this.errorMsg =
      (json && json.errorMsg) || this.errInfo.errorMsg || this.message //异常信息
    this.isTiped = (json && json.isTiped) || false
    if (exceptionFactory.isException(e)) {
      //@ts-ignore
      this.handleFunc = e.handle
    }
    this.serviceException = (json && json.serviceException) || false //是否服务端异常
    this.modalClosed = (json && json.modalClosed) || null //异常弹框关闭后事件 app暂不支持
    if (!json) {
      this.stacks.push(message)
    } else if (json.errorNo) {
      this.errorNo = json.errorNo
    }
    this.properties = {
      containerId: json && json.containerId, //指定异常渲染的容器
      feeback: (json && json.feeback) || false, //是否隐藏反馈按钮,
      submit: json && false === json.submit ? false : true // 是否提交异常，默认提交
    }
  }

  _fireBeforeHandlers() {
    for (let i = 0, len = this._beforeHandlers.length; i < len; i++) {
      let handler = this._beforeHandlers[i]
      handler.apply(this, [])
    }
  }
  /**
   * 添加堆栈信息
   * @param {String}  stack 堆栈信息
   */
  addStack(stack: string) {
    this.stacks.push(stack)
  }
  /**
   * 注册异常处理前回调
   * ＠param {Function} handler  回调
   */
  onBeforeHandler(handler: (...args: any[]) => void) {
    this._beforeHandlers.push(handler)
  }
  /**
   * 打印异常堆栈信息
   */
  printStackTrace() {
    let stackTrace = this.getStackTrace()
    if (window.console && console.log) {
      console.log(stackTrace)
    } else {
      throw Error(stackTrace)
    }
  }

  /**
   * 获取异常堆栈信息
   * @return String
   */
  getStackTrace() {
    let stackTrace = []
    let error = this.error ? this.error : this
    let stack = error.stack
    if (typeof stack != 'string') {
      while (stack) {
        stackTrace.push(error.name)
        stackTrace.push(': ')
        stackTrace.push(error.message)
        for (let i = 0; i < stack.length; i++) {
          let frame = stack[i]
          //@ts-ignore
          let funcName = frame.getFunctionName()
            ? //@ts-ignore
              frame.getFunctionName()
            : '(anonymous function)'
          stackTrace.push('\n    at ')
          stackTrace.push(funcName)
          stackTrace.push(' ')
          //@ts-ignore
          stackTrace.push(frame.getScriptNameOrSourceURL())
          stackTrace.push(':')
          //@ts-ignore
          stackTrace.push(frame.getLineNumber())
          stackTrace.push(':')
          //@ts-ignore
          stackTrace.push(frame.getColumnNumber())
        }
        if (error) {
          //@ts-ignore
          let preError = error.error
          stack = preError ? preError.stack : null
        } else {
          //@ts-ignore
          stack = null
        }
        //@ts-ignore
        error = preError
      }
    } else {
      stackTrace.push(stack)
    }
    stackTrace.concat(this.stacks)
    return stackTrace.join('')
  }

  getClassName() {
    return 'Exception'
  }

  _getHandler() {
    return exceptionManager._getHandler(this.getClassName())
  }

  markTiped() {
    this.isTiped = true
  }

  /**
   * 异常处理
   */
  handle(...args: any[]) {
    if (!this.isTiped) {
      //一个异常实例只能被处理一次
      this.markTiped()
      this._fireBeforeHandlers()
      let handler = this._getHandler()
      if (handler) {
        handler.apply(this, arguments)
      } else {
        this.handling(...args)
      }
    }
  }

  handling(...args: any[]) {
    throw this.error
  }

  /**
   * 获取异常标识
   * @return String
   */
  getErrorNo(errorNo?: string) {
    errorNo = errorNo || this.errorNo
    if (!errorNo) {
      errorNo = new Date().getTime().toString(26)
    }
    if (errorNo.indexOf('|') == -1) {
      let instanceId = environment.getExceptionInstanceId()
      if (instanceId) {
        errorNo = instanceId + '|' + errorNo
      }
    }
    return errorNo
  }
  /**
   *
   */
  format(str: string) {
    if (!str) {
      return ''
    } else {
      return str
    }
  }
  /**
   * 获取异常信息列表
   * @returns	{Array}	使用数组是因为需要保持顺序
   * [{
   * 	name:{String}//名称
   * 	value: {Object}//值
   * }]
   * */
  getDetailMessage() {
    let errInfo = this.errInfo
    let i = '',
      r = '复制成功',
      a = '复制失败',
      errorDetail = errInfo.errorDetail || {},
      productInfo = errInfo.productInfo || {},
      causedby = errInfo.causedby || {},
      detail = errInfo.detail || false
    let detailMsg = []
    let _instanceId = productInfo['instanceId'] || causedby['instanceId']
    let serviceIden = this.format(_instanceId) || ''
    let codeInfos = [
      { name: '异常类别', code: 'errorCategory' },
      { name: '异常类型', code: 'errorClass' },
      { name: '异常信息', code: 'message', parent: this },
      { name: '异常类型编码', code: 'errorCode' },
      {
        name: '异常标识序列',
        code: 'errorNo',
        funName: 'getErrorNo',
        prefix: serviceIden
      },
      { name: '异常发生时间', code: 'errorTime' },
      { name: '内部异常类型', code: 'innerErrorClass' },
      { name: '内部异常明细', code: 'innerErrorMsg' },
      { name: '异常链路信息', code: 'allStackMsg' },
      { name: '规则路由信息', code: 'errorLocation' },
      { name: '服务线程id', code: 'threadId' },
      {
        name: '服务线程名称',
        code: 'threadName'
      } /*{ name : "服务实例标识", code: "instanceId", parent: productInfo },*/,
      { name: '基础产品标识', code: 'baseProductCode', parent: productInfo },
      { name: '基础产品版本', code: 'baseProductVer', parent: productInfo },
      { name: '基础产品阶段', code: 'baseProductStage', parent: productInfo },
      { name: '最后更新时间', code: 'lastUpdate', parent: productInfo }
    ]
    for (let i = 0, len = codeInfos.length; i < len; i++) {
      let codeInfo = codeInfos[i]
      let parent = codeInfo.parent ? codeInfo.parent : errorDetail
      let code = codeInfo.code
      let name = codeInfo.name
      if (parent.hasOwnProperty(code) || code == 'errorNo') {
        let value = codeInfo.funName
          ? //@ts-ignore
            this[codeInfo.funName](parent[code])
          : this.format(parent[code])
        if (code == 'errorNo') {
          if (!value) {
            //不展示无异常标识的
            continue
          }
          this.errorNo = value
        }
        let prefix = codeInfo['prefix']
        if (prefix && value && value.indexOf('|') == -1) {
          //后缀
          value = prefix + '|' + value
        }
        detailMsg.push({
          name: name,
          value: value
        })
      }
    }
    if (typeof this.getDetailInfo == 'function') {
      let detailInfos = this.getDetailInfo()
      //@ts-ignore
      if (detailInfos && detailInfos instanceof Array) {
        //@ts-ignore
        for (let i = 0, len = detailInfos.length; i < len; i++) {
          let map = detailInfos[i]
          //@ts-ignore
          if (!map || !map.code) {
            continue
          }
          //@ts-ignore
          let val = map.value
          if (val && val instanceof Object) {
            val = jsonUtil.obj2json(val)
          }
          detailMsg.push({
            //@ts-ignore
            name: map.name,
            value: val
          })
        }
      }
    }
    return detailMsg
  }
  /**
   * 生成异常html
   * @return String
   */
  getDetailHtml() {
    let htmls = ['<div class=err-details><div class=err-abnormal>']
    let detailMsg = this.getDetailMessage()
    for (let i = 0, len = detailMsg.length; i < len; i++) {
      let msg = detailMsg[i]
      htmls.push(
        '<p><span style=display:none>*#</span><span>' +
          msg.name +
          '：</span><span>' +
          msg.value +
          '</span></p>'
      )
    }
    htmls.push('</div></div>')
    let html = htmls.join('')
    return html
  }
  genExceptionHtml() {
    let html =
      '<html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> ' +
      '<title>' +
      i18n.get('错误提示', '异常标题') +
      '</title> <style>  .ebody { font-family: Arial, 宋体, helvertica, sans-serif; font-size: 12px; font-weight: normal; text-align: center; }  ' +
      '.tips_frame { margin: 100px auto; position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; } ' +
      '.tips_text { FONT-WEIGHT: bold; FONT-SIZE: 15px; COLOR: #FB7E04; background:url(/itop/exception/images/tips_ico.gif) no-repeat left center; padding-left: 27px; height: 30px; line-height: 30px; display: inline-block; }  ' +
      '.tips_font { FONT-WEIGHT: bold; FONT-SIZE: 13px; COLOR: #FB7E04; margin: 30px 0px 0px 0px; text-align: center; }  ' +
      '.tips_Error { COLOR: #000; margin: 0px; line-height: 30px; } </style> </head> ' +
      '<body class="ebody"> <div class="tips_frame">' +
      ' <div style="width: 400px; margin: 0 auto 10px; text-align: left; padding: 15px; border: 1px solid #aeabd3;"> ' +
      '<span class="tips_text">' +
      i18n.get('错误提示', '异常提示文字') +
      '</span> <div class="tips_font"> </div> ' +
      '<div class="tips_Error"> </div> <textarea rows="5" cols="54" readonly="readonly" style="width:370px;"> ' +
      this.getMessage() +
      ' </textarea> </div> </div> </body> </html>'
    return html
  }
  getExceptionData() {
    //获取异常数据
    let stacks = (this.error && this.error.stack) || []
    let stackInfos = []
    if (typeof stacks != 'string') {
      let start = false
      for (let i = 0, len = stacks.length; i < len; i++) {
        let stack = stacks[i]
        //@ts-ignore
        let funName = stack.getFunctionName()
        if (!start) {
          if (funName == 'window.Error') {
            //改造的window.Error会产生好多相同的异常堆栈，先移除一样的，免得异常平台存太多无用的堆栈
            continue
          } else {
            start = true
          }
        }
        let info = {
          name: funName, //匿名函数时为null
          //@ts-ignore
          row: stack.getLineNumber(), //@ts-ignore
          col: stack.getColumnNumber(), //@ts-ignore
          url: stack.getScriptNameOrSourceURL()
        }
        stackInfos.push(info)
      }
    }
    let datas = {
      //数组是为了保证顺序
      common: [
        {
          errorMsg: this.errorMsg,
          errorInnerMsg: this.message
        },
        {
          exceptionType: this.getClassName()
        }
      ],
      extend: [
        {
          errorDetailMsg: this.message
        }
      ],
      stacks: stackInfos
    }

    let detailInfo = this.getDetailInfo && this.getDetailInfo()
    if (detailInfo) {
      //@ts-ignore
      for (let i = 0, len = detailInfo.length; i < len; i++) {
        let info = detailInfo[i]
        //@ts-ignore
        if (!info || !info.code) {
          continue
        }
        //@ts-ignore
        let code = info.code
        let map: { [key: string]: any } = {}
        //@ts-ignore
        map[code] = info.value
        //@ts-ignore
        datas['extend'].push(map)
      }
    }
    if (this.errorNo) {
      //@ts-ignore
      datas.common.push({ exceptionSerialNumber: this.errorNo })
    }
    return datas
  }

  isInApp() {
    //@ts-ignore
    return !!window.GlobalVariables
  }

  getModalClosedHandler() {
    return this.modalClosed
  }

  setModalClosedHandler(func: (...args: any[]) => void) {
    if (typeof func != 'function') {
      return
    }
    /* 所有异常关闭回调,按设置的先后顺序执行：打开窗体到组件容器发生异常，异常弹框关闭后移除页签，按钮也需要在异常弹框关闭后设置为使能, 不处理返回值 */
    let closeFuns = this.__modalCloseds
    if (!closeFuns) {
      this.__modalCloseds = closeFuns = [func]
    } else {
      closeFuns.push(func)
    }
    if (!this.modalClosed) {
      let _closeFuns = this.__modalCloseds
      this.modalClosed = (...args: any[]) => {
        if (_closeFuns) {
          for (var i = 0, len = _closeFuns.length; i < len; i++) {
            _closeFuns[i](...args)
          }
        }
      }
    }
  }
  getMessage() {
    return this.message
  }
  getDetailInfo() {
    return null
  }
  /**
   * 判断是否服务端异常
   * */
  isServiceException() {
    return this.serviceException === true ? true : false
  }
  /**
   * 标记为服务端异常
   * */
  markServiceException() {
    this.serviceException = true
    this.markUnSubmit()
  }
  /**
   * 设置异常打开的容器
   * @param	{String}	containerId	容器id
   * */
  setContainerId(containerId: string) {
    this.properties.containerId = containerId
  }
  /**
   * 获取异常打开的容器
   * @returns	{String}	containerId	容器id
   * */
  getContainerId() {
    return this.properties.containerId
  }
  /**
   * 设置隐藏反馈按钮
   * */
  hideFeeback() {
    this.properties.feeback = true
  }
  /**
   * 获取是否隐藏反馈按钮
   * */
  getHideFeeback() {
    return this.properties.feeback
  }
  /**
   * 异常序列化
   * @returns	{String}
   * */
  serialize() {
    let json = {
      errInfo: this.errInfo,
      errorMsg: this.errorMsg,
      //    			isTiped:this.isTiped,
      message: this.message,
      name: this.name,
      errorNo: this.getErrorNo(),
      serviceException: this.serviceException,
      stacks: this.stacks
    }
    let properties = this.properties
    for (let key in this.properties) {
      if (properties.hasOwnProperty(key)) {
        //@ts-ignore
        json[key] = properties[key]
      }
    }
    json = jsonUtil.obj2json(json)
    return json
  }
  /**
   * 标记当前异常不用提交到异常平台
   * */
  markUnSubmit() {
    this.properties.submit = false
  }
  /**
   * 判断是否需要提交异常
   * */
  isSubmit() {
    return this.properties.submit
  }
  /**
   * 标记当前异常为预览模式，目前在反馈页面使用
   * */
  markViewonly() {
    this.viewonly = true
  }
  /**
   * 判断是否为预览模式
   * */
  isViewonly() {
    return this.viewonly === true
  }
  /**
   * 标记为网络异常
   * */
  markNetwork() {
    this.networkError = true
  }
  /**
   * 判断是否网络异常
   * */
  isNetwork() {
    return this.networkError === true
  }
}

Error.prepareStackTrace = function (error, stack) {
  return stack
}

export default Exception
