import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let enhanceUrl = function (target: HTMLElement, attr: string, url: string) {
  /*let func = v3VueUtil.getUrlEnHancer();
	if(func){
		func(target,attr,url);
	}else{*/
  let val = target.getAttribute(attr)
  if (val !== url) {
    target.setAttribute(attr, url)
  }
  //}
}
//window._$V3TestData = {};
//window._$V3TestDataFunc = function(el,arg,val){
//	let S4 = function() {
//		return (((1 + Math.random()) * 0x10000) | 0).toString(16)
//				.substring(1);
//	};
//	let uuid = (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
//	if(!window._$V3TestData)
//		window._$V3TestData = {};
//	window._$V3TestData[uuid] = {
//		el : el,
//		arg : arg,
//		val : val,
//		ga : window.GlobalVariables
//	}
//}
Vue.directive(
  'res',
  function (
    el: HTMLElement,
    binding: Record<string, any>,
    node: Record<string, any>
  ) {
    if (
      binding.value == undefined ||
      binding.value == null ||
      !binding.value ||
      binding.value == ''
    ) {
      return
    }
    let vue = node.context
    /* 递归去获取构件编码 */
    let getComponentCode: Function = function (node: Record<string, any>) {
      if (typeof node._getComponentCode == 'function') {
        return node._getComponentCode()
      }
      if (undefined != node.$parent) {
        return getComponentCode(node.$parent)
      }
      return null
    }
    let componentCode = getComponentCode(vue)
    if (!componentCode) {
      throw new Error('无法获取构件编码.')
    }
    //	let componentCode = vue._getComponentCode();
    let path = ''
    let valueArray = binding.value.split('.')
    if (valueArray.length > 2) {
      let tempPath = [valueArray[1], valueArray[2]].join('.')
      path = 'itop/resources/' + valueArray[0] + '_' + tempPath
    } else {
      path = 'itop/resources/' + componentCode + '_' + binding.value
    }

    //@ts-ignore
    let val = window.GlobalVariables
      ? //@ts-ignore
        GlobalVariables.getServerUrl() + '/' + path
      : path
    //	window._$V3TestDataFunc(el,binding.arg,val);
    enhanceUrl(el, binding.arg, val)
  }
)

Vue.directive('url', function (el: HTMLElement, binding: Record<string, any>) {
  if (
    binding.value == undefined ||
    binding.value == null ||
    !binding.value ||
    binding.value == ''
  ) {
    // value 为空
    return
  }
  //@ts-ignore
  let val = window.GlobalVariables
    ? //@ts-ignore
      GlobalVariables.getServerUrl() + '/' + binding.value
    : binding.value
  //	window._$V3TestDataFunc(el,binding.arg,val);
  enhanceUrl(el, binding.arg, val)
})

Vue.directive(
  'id2url',
  function (el: HTMLElement, binding: Record<string, any>) {
    if (
      binding.value == undefined ||
      binding.value == null ||
      !binding.value ||
      binding.value == ''
    ) {
      // value 为空
      return
    }
    let url =
      'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
      binding.value +
      '%22%2C%22ImageObj%22%3A%22' +
      binding.value +
      '%22%7D%7D'
    //@ts-ignore
    let val = window.GlobalVariables
      ? //@ts-ignore
        GlobalVariables.getServerUrl() + '/' + url
      : url
    //	window._$V3TestDataFunc(el,binding.arg,val);
    enhanceUrl(el, binding.arg, val)
  }
)

Vue.directive(
  'current',
  function (
    el: HTMLElement,
    binding: Record<string, any>,
    node: Record<string, any>
  ) {
    let vue = node.context,
      dsName = binding.arg,
      rd = binding.value
    el.addEventListener(
      'click',
      function () {
        vue.$root._$synCurrentRecordToDs(dsName, rd)
      },
      true
    )
  }
)
class _$V3Vue {
  static instance: any
  _$handleEvent: any
  _$vue_vm: any

  static getInstance(globalCode: string) {
    return _$V3Vue.instance ? _$V3Vue.instance[globalCode] : null
  }

  html: string
  javascript: string | null
  globalCss: string | null
  globalJavascript: string | null
  css: string | null
  entityMapping: any
  windowEntitys: any
  fieldTypes: any
  treeMapping: any
  cssSymbol: any
  entities: any
  componentCode: any
  parseCss: any
  parseJavascript: any
  processHtml: any
  widgetCode: any
  eventTargetCode: any
  element: any
  datas: any
  moduleScriptId: any
  autoMoutStyle: boolean
  forEntities: any
  hanleEventFunc: any
  eventHandlers: Record<string, any>
  moduleDefineFunc: Record<string, any>
  sandbox: null
  duringDS2Vue: Record<string, any>
  dsEventRegisterFunc: Array<any>

  _defaultModuleScript: string = `let _$hanleEventFunc$_,sandbox,_$V3Vue,vdk;vdk = window[_vdk];window[_vdk]=null;exports._$putV3Vue=function(v3Vue){this._$V3Vue=v3Vue};exports._$putSandbox=function(sb){sandbox=sb};let getSandbox=function(){return this._$V3Vue.sandbox;};exports._$putHandleEventFunc=function(func){_$hanleEventFunc$_=func;};let handleEvent=function(){if(_$hanleEventFunc$_)_$hanleEventFunc$_.apply(this,arguments)};`
  Events = {
    Rendered: 'Rendered'
  }

  constructor(params: Record<string, any>) {
    let globalCode = params.element
    if (!_$V3Vue.instance) {
      _$V3Vue.instance = {}
    }
    _$V3Vue.instance[globalCode] = this
    let pros = params.pros
    //	if(params.Html) this.html = params.Html;
    //	if(params.ModuleJavaScript) this.html=params.ModuleJavaScript;
    //	if(params.JavaScript) this.html=params.JavaScript;
    //	if(params.Css) this.html=params.Css;
    //	if(params.ModuleCss) this.html=params.ModuleCss;
    this.html = (pros && pros.Html) || params.Html || null
    this.javascript =
      (pros && pros.ModuleJavaScript) || params.ModuleJavaScript || null
    this.globalCss = (pros && pros.Css) || params.Css || null
    this.globalJavascript =
      (pros && pros.JavaScript) || params.JavaScript || null
    this.css = (pros && pros.ModuleCss) || params.ModuleCss || null
    this.entityMapping =
      (pros && pros.entityMapping) || params.entityMapping || {}
    this.windowEntitys =
      (pros && pros.windowEntitys) || params.windowEntitys || {}
    this.fieldTypes =
      (pros && pros.windowEntityFieldTypes) ||
      params.windowEntityFieldTypes ||
      {}
    this.treeMapping = (pros && pros.treeMapping) || params.treeMapping || {}
    this.cssSymbol =
      (pros && pros.cssSymbol) ||
      params.cssSymbol ||
      params.css_prefix_symbol ||
      null
    this.entities = (pros && pros.Entities) || params.entities || []
    //	if(pros){
    //		this.entities = pros.Entities||[];
    //		this.cssSymbol = pros.cssSymbol||null;
    //		this.entityMapping = pros.entityMapping||{};
    //		this.treeMapping = pros.treeMapping||{};
    //		this.windowEntitys = pros.windowEntitys||{};
    //	}else{
    //		this.cssSymbol = params.cssSymbol||null;
    //		this.entities = params.entities ? params.entities:[];
    //		this.windowEntitys = {};
    //		this.treeMapping = {};
    //		this.entityMapping = {};
    //	}
    this.componentCode = params.componentCode
    this.parseCss = params.parseCss || true
    this.parseJavascript = params.parseJavascript || true
    this.processHtml = params.processHtml || true
    this.widgetCode = params.widgetCode || null
    this.eventTargetCode = params.eventTargetCode || null
    this.element = params.element || null
    this.datas = params.datas || null
    this.moduleScriptId = params.moduleScriptId || null
    this.autoMoutStyle =
      typeof params.autoMoutStyle == 'boolean' ? params.autoMoutStyle : true
    this.forEntities = params.forEntities || []
    this.processHtml = params.processedHtml || null
    this.hanleEventFunc = params.handleEvent || null
    this.eventHandlers = {}
    this.moduleDefineFunc = {}
    this.sandbox = null
    this.duringDS2Vue = {} //从ds同步到ui
    this.dsEventRegisterFunc = []
    this._init()
  }

  _init() {
    this._injectCss()
    this._injectScript()
  }

  _injectCss() {
    if (this.parseCss) {
      let cssStr = []
      if (this.globalCss) {
        cssStr.push(this.globalCss)
      }
      if (this.css) {
        cssStr.push(this.css)
      }
      if (cssStr.length > 0) {
        let css = cssStr.join('')
        //let cssProcessor = v3VueUtil.getCssProcessor();
        //css = cssProcessor ? cssProcessor(css) : css;
        //environment.parseCssStr(css);
        let style = document.createElement('style')
        style.innerHTML = css
        document.getElementsByTagName('head')[0].appendChild(style)
      }
      //清除样式信息，防止占用内存
      this.globalCss = null
      this.css = null
    }
  }

  _injectScript() {
    if (this.parseJavascript) {
      let javascriptStr = []
      if (this.globalJavascript) {
        javascriptStr.push(this.globalJavascript)
      }
      if (this.javascript) {
        if (javascriptStr.length > 0) {
          javascriptStr.push(';')
        }
        this.moduleScriptId = this._generate()
        javascriptStr.push('(function(exports,_vdk){')
        javascriptStr.push(this._defaultModuleScript)
        javascriptStr.push(this.javascript)
        let uuid = this._generate()
        //@ts-ignore
        window[uuid] = this
        javascriptStr.push(
          "})(window._$V3Vue.getInstance('" +
            this.element +
            "')._getCallFunc(),'" +
            uuid +
            "');"
        )
      }
      if (javascriptStr.length > 0) {
        let script = ['<script type="text/javascript">']
        script = script.concat(javascriptStr)
        script.push('</script>')
        $('head').append(script.join(''))
      }
      //清除脚本信息，防止占用内存
      this.globalJavascript = null
      this.javascript = null
    }
  }

  _getCallFunc() {
    return this.moduleDefineFunc
  }

  _existFunc(name: string) {
    let funcs = this._getCallFunc()
    if (funcs && typeof funcs[name] == 'function') {
      return true
    }
    return false
  }

  _generate() {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
  }

  _extendDiff(aim: Record<string, any>, source: Record<string, any>) {
    for (let f in source) {
      if (source.hasOwnProperty(f) && source[f] !== aim[f]) {
        aim[f] = source[f]
      }
    }
  }

  _createVueData() {
    let data = {
      _$v3paltformData: {
        setCurrentHandlers: [],
        setSelectHandlers: [],
        multipleSelect: []
      },
      //实体字段类型的数据
      _$EntityFieldTypes: this.fieldTypes
    }
    let entitys = this.windowEntitys
    if (entitys) {
      for (let entityCode in entitys) {
        let fieldList = entitys[entityCode]
        let fieldMap = {}
        for (let j = 0, len = fieldList.length; j < len; j++) {
          fieldMap[fieldList[j]] = null
        }
        data[entityCode] = fieldMap
      }
    }
    //		for(let i=0,l=this.entities.length;i<l;i++){
    //			let entityCode = this.entities[i];
    //			if(entitys && entitys[entityCode]){
    //				let fieldList = entitys[entityCode];
    //				let fieldMap = {};
    //				for(let j = 0,len = fieldList.length;j<len;j++){
    //					fieldMap[fieldList[j]] = null;
    //				}
    //				data[entityCode] = fieldMap;
    //			}else{
    //				data[entityCode]= {};
    //			}
    //		}
    for (let oldEntiyCode in this.entityMapping) {
      if (this.entityMapping.hasOwnProperty(oldEntiyCode)) {
        let newEntityCode = this.entityMapping[oldEntiyCode]
        data[newEntityCode] = []
      }
    }
    for (let oldEntiyCode in this.treeMapping) {
      if (this.treeMapping.hasOwnProperty(oldEntiyCode)) {
        let singleInfo = this.treeMapping[oldEntiyCode]
        let newEntityCode = singleInfo['newEntityCode']
        data[newEntityCode] = []
      }
    }
    return data
  }

  _createVueMethod() {
    let handleEvent =
      this.hanleEventFunc ||
      (function (nowVue) {
        return function (eventName: string) {
          let func = nowVue._$handleEvent
          if (func) {
            func.apply(nowVue, arguments)
          }
        }
      })(this)
    //		let md = function(){
    //			return this._$mdHandle;
    //		};
    /**
     * 往moduleDefineFunc注入对象方法
     * */
    let _moduleDefineFunc = this.moduleDefineFunc
    if (_moduleDefineFunc) {
      /* 注入handleEvent方法 */
      if (typeof _moduleDefineFunc._$putHandleEventFunc == 'function')
        _moduleDefineFunc._$putHandleEventFunc(handleEvent)
    }
    let _$registerVuiTagEvent = function (
      widgetCode: string,
      eventName: string,
      handle: Function
    ) {
      if (!this._$vuiTagEventStorage) {
        this._$vuiTagEventStorage = {}
      }
      let _vuiTagEventStorage = this._$vuiTagEventStorage
      if (!_vuiTagEventStorage[widgetCode]) {
        _vuiTagEventStorage[widgetCode] = {}
      }
      let _event = _vuiTagEventStorage[widgetCode]
      _event[eventName] = handle
    }

    let _$fireVuiTagEvent = function (
      widgetCode: string,
      eventName: string,
      params: Record<string, any>
    ) {
      let _vuiTagEventStorage = this._$vuiTagEventStorage
      if (_vuiTagEventStorage && _vuiTagEventStorage[widgetCode]) {
        let tagEvents = _vuiTagEventStorage[widgetCode]
        if (typeof tagEvents[eventName] == 'function') {
          let handle = tagEvents[eventName]
          handle(params)
        }
      }
    }
    let _refFn = (function (v3Vue) {
      return function (func) {
        if (v3Vue._existFunc(func)) {
          let _func = v3Vue._getCallFunc()[func]
          return _func
          //					let rs = _func.apply(v3Vue.vueInstance,Array.prototype.slice.call(arguments, 1));
          //					return rs;
        } else {
          throw Error('未找到方法[' + func + ']，请检查！')
        }
      }
    })(this)
    /**
     * 获取实体字段类型列表
     * */
    let _$getEntityFieldType = function (entityCode: string) {
      let types = this._data._$EntityFieldTypes
      if (entityCode && types && types[entityCode]) {
        return types[entityCode]
      }
      return {}
    }
    let parseDsData = function (params: Record<string, any>) {
      let newRecord = []
      let changeValue: Array<any> = []
      let resultSet = params.resultSet
      let eventName = params.eventName
      if (eventName == 'CURRENT') {
        newRecord.push(params.currentRecord.toMap())
      } else if (resultSet) {
        resultSet.iterate(function (rd: Record<string, any>) {
          changeValue.push(rd.getChangedData())
          newRecord.push(rd.toMap())
        })
      }
      return {
        changeValue: changeValue,
        newRecord: newRecord
      }
    }
    // 处理数据源触发事件的参数
    let handlerCellFunc = function (handler, field, tmpVue) {
      return function (params: Record<string, any>) {
        if (typeof handler == 'function') {
          let result = []
          let datas = parseDsData(params)
          let newRecord = datas.newRecord
          let changeValue = datas.changeValue
          newRecord = newRecord.length > 0 ? newRecord[0] : newRecord
          if (params.eventName == 'LOAD') {
            handler.apply(tmpVue, result)
          } else {
            if (changeValue.length > 0) {
              let tmp = changeValue[0]
              if (tmp && tmp.hasOwnProperty(field)) {
                changeValue = tmp[field]
                result.push(changeValue)
                result.push(newRecord)
                handler.apply(tmpVue, result)
              }
            }
          }
        }
        return handler
      }
    }
    /**
     * 处理返回函数的参数
     */
    let handlerCallBackParamFunc = function (
      handler: Function,
      controlType: string,
      tmpVue: any
    ) {
      return function (params: Record<string, any>) {
        if (typeof handler == 'function') {
          let result = []
          let datas = parseDsData(params)
          let eventName = params.eventName
          let newRecord: Record<string, any> = {}
          if (eventName == 'CURRENT') {
            newRecord = params.currentRecord.toMap()
          } else if (eventName == 'SELECT') {
            newRecord = {
              isSelect: params.isSelect,
              records: datas.newRecord
            }
          } else {
            newRecord = datas.newRecord
            let changeValue = datas.changeValue
            if (changeValue.length > 0) {
              if (controlType == 'record') {
                changeValue = changeValue[0]
              }
              result.push(changeValue)
            }
          }
          result.push(newRecord)
          handler.apply(tmpVue, result)
        }
        return handler
      }
    }

    return {
      handleEvent: handleEvent,
      call: (function (nowVue) {
        return function (func) {
          nowVue._$callEvent.apply(nowVue, arguments)
        }
      })(this),
      _$getEntityFieldType: function (entityCode: string) {
        let types = this._data._$EntityFieldTypes
        if (entityCode && types && types[entityCode]) {
          return types[entityCode]
        }
        return {}
      },
      _$getDatasource: (function (nowVue) {
        return function (func: any) {
          return nowVue._$getDatasource.apply(nowVue, arguments)
        }
      })(this),
      refFn: _refFn,
      _$registerDsEvent: (function (nowVue) {
        return function (param: Record<string, any> | Function) {
          if (typeof nowVue._$registerDsEvent != 'function') {
            if (typeof param == 'function')
              nowVue.dsEventRegisterFunc.push(param)
            else if (
              typeof param == 'object' &&
              param.dsName &&
              param.eventType
            ) {
              nowVue.dsEventRegisterFunc.push(
                (function (param) {
                  return function () {
                    let dsName = param.dsName
                    let eventType = param.eventType
                    let handler = param.handler
                    let controlType = param.controlType
                    let datasource
                    let tmpVue = param.vueObj
                    if (
                      tmpVue &&
                      typeof tmpVue.$root._$getDatasource == 'function'
                    ) {
                      if (controlType == 'cell') {
                        if (tmpVue.$vnode.data && tmpVue.$vnode.data.model) {
                          let vModel = tmpVue.$vnode.data.model.expression
                          if (vModel) {
                            let tmp = vModel.split('.')
                            dsName = tmp[0]
                            let field = tmp[tmp.length - 1]
                            // 处理返回函数
                            handler = handlerCellFunc(
                              param.handler,
                              field,
                              tmpVue
                            )
                          }
                        }
                      } else {
                        // 处理返回函数
                        handler = handlerCallBackParamFunc(
                          param.handler,
                          controlType,
                          tmpVue
                        )
                        dsName = tmpVue.entityCode
                      }
                      if (dsName) {
                        datasource = tmpVue.$root._$getDatasource(dsName)
                      }
                    }
                    if (datasource) {
                      switch (eventType) {
                        case 'load':
                          eventType = datasource.Events.LOAD
                          break
                        case 'change':
                          eventType = datasource.Events.UPDATE
                          break
                        case 'currentChange':
                          eventType = datasource.Events.CURRENT
                          break
                        case 'selectionChange':
                          eventType = datasource.Events.SELECT
                          break
                        default:
                          eventType = null
                          break
                      }
                      if (eventType) {
                        datasource.on({
                          eventName: eventType,
                          handler: handler
                        })
                      }
                    }
                  }
                })(param)
              )
            }
          } else {
            nowVue._$registerDsEvent.apply(nowVue, arguments)
          }
        }
      })(this),
      _$registerDataLoadedEvent: (function (nowVue) {
        return function (func) {
          nowVue._$registerDataLoadedEvent.apply(nowVue, arguments)
        }
      })(this),
      _$registerVuiTagEvent: _$registerVuiTagEvent,
      _$fireVuiTagEvent: _$fireVuiTagEvent,
      _getComponentCode: (function (componentCode) {
        return function () {
          return componentCode
        }
      })(this.componentCode),
      _$v3platform: function () {
        let _this = this
        return {
          datasource: {
            synCurrentRecordToDs: function (
              entityCode: string,
              current: Record<string, any>,
              oldCurrent: Record<string, any>
            ) {
              let func = _this._$synCurrentRecordToDs
              if (func) {
                func.apply(_this, [entityCode, current, oldCurrent])
              }
            },
            synCurrentIdToDs: function (
              entityCode: string,
              current: Record<string, any>,
              oldCurrent: Record<string, any>
            ) {
              let func = _this._$synCurrentIdToDs
              if (func) {
                func.apply(_this, [entityCode, current, oldCurrent])
              }
            },
            synSelectRecordToDs: function (
              entityCode: string,
              data,
              isSel: boolean
            ) {
              let func = _this._$synSelectRecordToDs
              if (func) {
                func.apply(_this, [entityCode, data, isSel])
              }
            },
            synCurrentRecordToUi: function (
              entityCode: string,
              current: Record<string, any>
            ) {
              let funcs = _this._data._$v3paltformData.setCurrentHandlers
              if (funcs.length > 0) {
                for (let i = 0, len = funcs.length; i < len; i++) {
                  let func = funcs[i]
                  func(entityCode, current)
                }
              }
            },
            synSelectRecordToUi: function (
              entityCode: string,
              datas: Array<any>,
              isSel: boolean
            ) {
              let funcs = _this._data._$v3paltformData.setSelectHandlers
              if (funcs.length > 0) {
                for (let i = 0, len = funcs.length; i < len; i++) {
                  let func = funcs[i]
                  func(entityCode, datas, isSel)
                }
              }
            },
            registerCurrentHandler: function (handler: Function) {
              _this._data._$v3paltformData.setCurrentHandlers.push(handler)
            },
            registerSelectHandler: function (handler: Function) {
              _this._data._$v3paltformData.setSelectHandlers.push(handler)
            },
            markDsMultipleSelect: function (entityCode: string) {
              _this._data._$v3paltformData.multipleSelect.push(entityCode)
            }
          }
        }
      }
    }
  }

  _createVueWatcher() {
    let watchers = {}
    let getWatcher = function (code: string, nowV: any) {
      return {
        deep: true,
        sync: true,
        handler: (function (entityCode, nowVue) {
          return function (val: any) {
            let func = nowVue._$synData
            if (func) {
              func.apply(nowVue, [entityCode, val])
            }
          }
        })(code, nowV)
      }
    }
    let entitys = this.windowEntitys
    for (let entityCode in entitys) {
      watchers[entityCode] = getWatcher(entityCode, this)
    }
    //		for(let i=0,l=this.entities.length;i<l;i++){
    //			let entityCode = this.entities[i];
    //			watchers[entityCode] = getWatcher(entityCode,this);
    //		}
    if (this.entityMapping) {
      for (let entityCode in this.entityMapping) {
        if (this.entityMapping.hasOwnProperty(entityCode)) {
          let newEntityCode = this.entityMapping[entityCode]
          if (!watchers[newEntityCode]) {
            watchers[newEntityCode] = getWatcher(entityCode, this)
          }
        }
      }
    }
    return watchers
  }

  render() {
    if (this.moduleDefineFunc && this.moduleDefineFunc._$putV3Vue) {
      this.moduleDefineFunc._$putV3Vue(this)
    }
    //解析html绑定的实体名称
    this.analyEntity(this.html)
    let el =
      typeof this.element == 'string'
        ? document.getElementById(this.element)
        : this.element
    if (this.autoMoutStyle) {
      el.setAttribute('symbol', this.cssSymbol)
    }
    if (this.html) {
      el.innerHTML = this.html
    }
    let vm = new Vue({
      el: el,
      data: this._createVueData(),
      methods: this._createVueMethod(),
      watch: this._createVueWatcher()
    })
    this._$vue_vm = vm
  }

  strTrim(str: string) {
    return str ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : str
  }

  toNewEntityCode(entityCode: string) {
    return entityCode + '_' + new Date().getTime()
  }

  _getNewEntityCode(pool: Record<string, any>, entityCode: string) {
    entityCode = this.strTrim(entityCode)
    if (!pool[entityCode]) {
      pool[entityCode] = this.toNewEntityCode(entityCode)
    }
    return pool[entityCode]
  }

  analyEntity(html: string) {
    //分析实体

    if (!html) return
    let _this = this
    let template = html
    let entityMapping = {} //普通实体映射新名称
    let treeMapping: Record<string, any> = this.treeMapping
      ? this.treeMapping
      : {} //属性实体映射新名称
    //		let entitys = this.windowEntitys;//实体字段信息
    let tmpThis = this
    let entitys = this.windowEntitys ? this.windowEntitys : []
    let analyFunc = (function (tmp_this) {
      //分析非 实体.字段和v-for 这两个格式的实体
      return function (childNode: HTMLElement) {
        let components
        let nodeName = childNode.nodeName
        //@ts-ignore
        if (window._$V3Vue && window._$V3Vue._getComponents) {
          //@ts-ignore
          components = window._$V3Vue._getComponents(nodeName)
        }
        if (components && components.length > 0) {
          for (let i = 0, len = components.length; i < len; i++) {
            let component = components[i]
            let dataPro = component.getDataProp()
            let attrName = childNode.hasAttribute(':' + dataPro)
              ? ':' + dataPro
              : childNode.hasAttribute('v-bind:' + dataPro)
              ? 'v-bind:' + dataPro
              : null
            let dataType = component.getDataType()
            if (dataType == 'Array') {
              if (attrName) {
                //绑定实体方式为 :data 或 v-bind:data
                let entityCode = childNode.getAttribute(attrName)
                let newEntityCode = _this._getNewEntityCode(
                  entityMapping,
                  entityCode || ''
                )
                childNode.setAttribute(attrName, newEntityCode)
                childNode.setAttribute(':entity-code', "'" + entityCode + "'")
              }
            } else if (dataType == 'Tree') {
              //以树的方式绑定实体
              if (attrName) {
                //绑定实体方式为 :data 或 v-bind:data
                let entityCode = childNode.getAttribute(attrName)
                let newEntityCode = _this.toNewEntityCode(entityCode || '')
                let newMappingInfo: Record<string, any> = {
                  newEntityCode: newEntityCode
                }
                let treeStructProp = component.getTreeStructProp()
                if (childNode.hasAttribute(':' + treeStructProp)) {
                  let _fieldMapping = childNode.getAttribute(
                    ':' + treeStructProp
                  )
                  try {
                    newMappingInfo.fieldMapping = eval(
                      '(' + _fieldMapping + ')'
                    )
                  } catch (e) {
                    newMappingInfo.fieldMapping = {
                      id: 'id',
                      parentField: 'pid',
                      title: 'title'
                    }
                  }
                } else {
                  newMappingInfo.fieldMapping = {
                    id: 'id',
                    parentField: 'pid',
                    title: 'title'
                  }
                }
                entityCode && (treeMapping[entityCode] = newMappingInfo)
                childNode.setAttribute(attrName, newEntityCode)
                childNode.setAttribute(':entity-code', "'" + entityCode + "'")
              }
            } else if (dataType == 'Object') {
              if (attrName) {
                let entityCode = childNode.getAttribute(attrName)
                let tagName = component.getComponentName()
                let value_field_attr_name = ''
                let text_field_attr_name = ''
                switch (tagName) {
                  case 'vui-dict-box':
                  case 'vui-radio-list':
                  case 'vui-checkbox-list':
                  case 'vui-combo-box':
                    value_field_attr_name = 'value-field'
                    //								text_field_attr_name = "text-field";
                    break
                }
                if (
                  value_field_attr_name != '' &&
                  childNode.hasAttribute(value_field_attr_name)
                ) {
                  childNode.setAttribute('___ds___', entityCode || '')
                  let _$fields = []
                  _$fields.push(childNode.getAttribute(value_field_attr_name))
                  //							if(text_field_attr_name != "" && childNode.hasAttribute(text_field_attr_name)){
                  //								_$fields.push(childNode.getAttribute(text_field_attr_name));
                  //							}
                  childNode.setAttribute('___field___', _$fields.join(','))
                }
              }
            }
          }
        }
        let attrName = 'v-for'
        if (childNode.hasAttribute(attrName)) {
          let expArray = childNode.getAttribute(attrName).split(' in ')
          let varName = expArray[0],
            entityCode = expArray[1]
          if (entitys[entityCode]) {
            childNode.setAttribute(
              attrName,
              varName +
                ' in ' +
                _this._getNewEntityCode(entityMapping, entityCode)
            )
            childNode.setAttribute(':entity-code', "'" + entityCode + "'")
            childNode.setAttribute(':key', varName + '.id')
          }
        }
        attrName = 'v-model'
        if (childNode.hasAttribute(attrName)) {
          let expArray = childNode.getAttribute(attrName).split('.')
          let entityCode = expArray[0],
            fieldCode = expArray[1]
          if (entitys[entityCode]) {
            childNode.setAttribute('___ds___', entityCode)
            childNode.setAttribute('___field___', fieldCode)
          }
        }
        let tagName = nodeName.toLowerCase()
        if (tagName.substring(0, 4) == 'vui-') {
          childNode.setAttribute('vui-type', tagName)
        }
        let childs = childNode.children
        if (childs && childs.length > 0) {
          for (let i = 0, l = childs.length; i < l; i++) {
            analyFunc.call(tmp_this, childs[i])
          }
        }
      }
    })(tmpThis)
    let tmpDom = document.createElement('div')
    tmpDom.innerHTML = template
    analyFunc(tmpDom)
    let _tmplate = tmpDom.outerHTML
    this.html = _tmplate.substring(5, _tmplate.length - 6)
    this.treeMapping = treeMapping
    this.entityMapping = entityMapping
  }

  on(params: Record<string, any>) {
    let eventName = params.eventName,
      handler = params.handler
    let handlers = this.eventHandlers[eventName]
    if (!handlers) {
      handlers = []
      this.eventHandlers[eventName] = handlers
    }
    handlers.push(handler)
  }
}

//@ts-ignore
window._$V3Vue = _$V3Vue
