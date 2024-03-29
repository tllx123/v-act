import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import {
  CurrentRecordObserver,
  DatasourceObserver
} from '@v-act/vjs.framework.extension.platform.interface.observer'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowInit as windowInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceObserverManager as observerManager } from '@v-act/vjs.framework.extension.platform.services.observer.manager'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as v3VueUtil from './V3VueUtils'

let sandbox: any, objectUtil
let Vue_Event_Manager_Storage_Token = 'Vue_Event_Manager_Storage_Token'
/* 定义事件运行状态常量 */
if (typeof EventStatus == 'undefined') {
  let EventStatus = {
    Running: 'running',
    Complete: 'complete'
  }
}
let eventStatusPool: Record<string, any> = {}
/**
 * 添加事件到事件池
 * @param {String} eventName 事件名称编号
 */
let _addEventToPool = function (eventName: string) {
  /* 只有事件不存在才加入事件池 */
  if (typeof eventStatusPool[eventName] == 'undefined') {
    eventStatusPool[eventName] = EventStatus.Complete
  }
}
/**
 * 将指定事件状态修改为正在运行
 * @param eventName 事件名称
 */
let _markEventRunning = function (eventName: string) {
  if (typeof eventStatusPool[eventName] != 'undefined') {
    eventStatusPool[eventName] = EventStatus.Running
  }
}
/**
 * 将指定事件状态修改为已完成
 */
let _markEventComplete = function (eventName: string) {
  if (typeof eventStatusPool[eventName] != 'undefined') {
    eventStatusPool[eventName] = EventStatus.Complete
  }
}
/**
 * 判断指定事件是否可以执行，只要事件不处于正在运行状态则为可以执行
 */
let _couldRun = function (eventName: string) {
  if (
    typeof eventStatusPool[eventName] != 'undefined' &&
    eventStatusPool[eventName] != EventStatus.Running
  ) {
    return true
  }
  return false
}

let _genEmptyObject = function (entityCode: string, widgetCode: string) {
  let ds = datasourceManager.lookup({
    datasourceName: entityCode
  })
  let metadata = ds.getMetadata()
  let fields = metadata.getFields()
  let obj: Record<string, any> = {}
  for (let i = 0, l = fields.length; i < l; i++) {
    obj[fields[i].getCode()] = null
  }
  return obj
}

let _flterEntity = function (codes: Array<string>) {
  let rs = []
  for (let i = 0, l = codes.length; i < l; i++) {
    let code = codes[i]
    let ds = datasourceManager.lookup({
      datasourceName: code
    })
    if (ds) {
      rs.push(code)
    }
  }
  return rs
}

class V3Vue {
  html
  javascript
  globalCss
  globalJavascript
  entities
  css
  cssSymbol
  entityMapping
  treeMapping
  windowEntitys

  parseCss
  parseJavascript
  processHtml
  widgetCode
  eventTargetCode
  element
  datas
  moduleScriptId
  autoMoutStyle
  forEntities
  processedHtml
  hanleEventFunc
  dsEventRegisterFunc: Array<any>
  eventHandlers: Array<any>
  instance
  duringDS2Vue: Record<string, any>
  vueInstance: any

  _defaultModuleScript: string =
    'let  _$hanleEventFunc$_,sandbox,vdk;exports._$putVdkFunc = function(_vdk){vdk=_vdk;};exports._$putSandbox=function(sb){sandbox=sb};let  getSandbox=function(){return sandbox;};exports._$putHandleEventFunc=function(func){_$hanleEventFunc$_=func;};let  handleEvent=function(){if(_$hanleEventFunc$_)_$hanleEventFunc$_.apply(this,arguments)};'
  _trimReg = /(^\s*)|(\s*$)/g
  commentReg = /\<\!\-\-[\s\S]*?\-\-\>/g
  iterEntityReg = /\<[\s\S]*?v\-for=['"]([^'"]+)?['"][\s\S]*?\>/g
  Events = {
    Rendered: 'Rendered'
  }

  static mountStyle: (element: HTMLElement, params: Record<string, any>) => any

  constructor(params: Record<string, any>) {
    let pros = params.pros
    if (pros) {
      this.html = pros.Html || null
      this.javascript = pros.ModuleJavaScript || null
      this.globalCss = pros.Css || null
      this.globalJavascript = pros.JavaScript || null
      this.entities = pros.Entities || []
      this.css = pros.ModuleCss || null
      this.cssSymbol = pros.cssSymbol || null
      this.entityMapping = pros.entityMapping || {}
      this.treeMapping = pros.treeMapping || {}
      this.windowEntitys = pros.windowEntitys || {}
    } else {
      this.html = params.html || null
      this.cssSymbol = params.cssSymbol || null
      this.entities = params.entities ? params.entities : []
      this.windowEntitys = params.windowEntitys ? params.windowEntitys : {}
      this.treeMapping = params.treeMapping ? params.treeMapping : {}
      this.entityMapping = params.entityMapping ? params.entityMapping : {}
    }
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
    this.processedHtml = params.processedHtml || null
    this.hanleEventFunc = params.handleEvent || null
    this.dsEventRegisterFunc = []
    this.eventHandlers = []
    if (!params.instance && params.globalCode) {
      //@ts-ignore
      let vueInstance = window._$V3Vue.getInstance(params.globalCode)
      this.instance = vueInstance
    }
    this.duringDS2Vue = {} //从ds同步到ui
    this.vueInstance = null
    this._init()
  }

  initModule(sb: any) {
    sandbox = sb
    objectUtil = sb.util.object
    V3Vue.mountStyle = v3VueUtil.mountStyle
  }

  _initEvent(vue) {
    let _registerVuiTagEvent = (function (_vue) {
      return function (
        widgetCode: string,
        eventName: string,
        handle: Function
      ) {
        if (!_vue._$vuiTagEventStorage) {
          _vue._$vuiTagEventStorage = {}
        }
        let _vuiTagEventStorage = _vue._$vuiTagEventStorage
        if (!_vuiTagEventStorage[widgetCode]) {
          _vuiTagEventStorage[widgetCode] = {}
        }
        let _event = _vuiTagEventStorage[widgetCode]
        _event[eventName] = handle
      }
    })(vue)
    let _fireVuiTagEvent = (function (_vue) {
      return function (
        widgetCode: string,
        eventName: string,
        params: Record<string, any>
      ) {
        let _vuiTagEventStorage = _vue._$vuiTagEventStorage
        if (_vuiTagEventStorage && _vuiTagEventStorage[widgetCode]) {
          let tagEvents = _vuiTagEventStorage[widgetCode]
          if (typeof tagEvents[eventName] == 'function') {
            let handle = tagEvents[eventName]
            handle(params)
          }
        }
      }
    })(vue)
    vue._$registerVuiTagEvent = _registerVuiTagEvent
    vue._$fireVuiTagEvent = _fireVuiTagEvent
    //			let  _fireVuiTagEvent = function(widgetCode,eventName,params){
    //				let  storage = _getWindowContainerStorage();
    //				if(storage.containsKey(eventName)){
    //					let  handle = storage.get(eventName);
    //					if(typeof(handle) == 'function'){
    //						handle(params);
    //					}
    //				}
    //			}
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
        let cssProcessor = v3VueUtil.getCssProcessor()
        css = cssProcessor ? cssProcessor(css) : css
        environment.parseCssStr(css)
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
        this.moduleScriptId = uuid.generate()
        javascriptStr.push('defineV("')
        javascriptStr.push(this.moduleScriptId)
        javascriptStr.push('",[],function(require, exports, module) {')
        let tmp_uuid = uuid.generate()
        javascriptStr.push(
          "let  _vdk='" + tmp_uuid + "';vdk=window[_vdk];window[_vdk]=null;"
        )
        //@ts-ignore
        window[tmp_uuid] = this
        javascriptStr.push(this._defaultModuleScript)
        javascriptStr.push(this.javascript)
        javascriptStr.push('});')
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

  //移除字符串两端空格
  _trim(str: string) {
    if (str) {
      str = str.replace(this._trimReg, '')
    }
    return str
  }

  //移除html注释
  _removeComments() {
    return this.html.replace(this.commentReg, '')
  }

  //处理html脚本，提取出迭代数据源
  _processHtml() {
    if (this.processHtml) {
      let rs = []
      if (this.html) {
        //					let  h = this._removeComments(),_this = this;
        //					h = h.replace(this.iterEntityReg,function(re,script){
        //						let  s = _this._trim(script);
        //						let  array = s.split(" ");
        //						let  code = array.pop();
        //						_this.forEntities.push(code);
        //						array.push(_this._genWrapEntityCode(code));
        //						s = array.join(" ");
        //						return re.replace(script,s);
        //					});
        //					this.processedHtml = h;
        this.processedHtml = this.html
        //清除html脚本，防止占用内存
        //					this.html = null;
      }
    }
  }

  _genWrapEntityCode(code: string) {
    return code + '_$all'
  }

  _processEntities() {
    let rs = []
    for (let i = 0, l = this.entities.length; i < l; i++) {
      let code = this.entities[i]
      let ds = datasourceManager.lookup({
        datasourceName: code
      })
      if (ds) {
        rs.push(code)
      }
    }
    this.entities = rs
  }

  _init() {
    if (!this.instance) {
      this._injectCss()
      this._injectScript()
    }
    this._processHtml()
    this._processEntities()
  }

  getHtml() {
    return this.processedHtml
  }

  _createEmptyRecord(entityCode: string) {
    let ds = datasourceManager.lookup({
      datasourceName: entityCode
    })
    let metadata = ds.getMetadata()
    let fields = metadata.getFields()
    let obj: Record<string, any> = {}
    for (let i = 0, l = fields.length; i < l; i++) {
      obj[fields[i].getCode()] = null
    }
    return obj
  }

  _extendDiff(aim: Record<string, any>, source: Record<string, any>) {
    for (let f in source) {
      if (source.hasOwnProperty(f) && source[f] !== aim[f]) {
        aim[f] = source[f]
      }
    }
  }

  _copyEntity(source: Record<string, any>, target: Record<string, any>) {
    let sourceEntity: Record<string, any> = {}
    if (source) {
      for (let key in source) {
        sourceEntity[key] = source[key]
      }
    }
    if (target instanceof Array) {
      for (let i = 0, l = target.length; i < l; i++) {
        let entityCode = target[i]
        if (!sourceEntity[entityCode]) {
          sourceEntity[entityCode] = {}
        }
      }
    }
    return sourceEntity
  }

  _createVueData() {
    let data: Record<string, any> = {
      _$v3paltformData: {
        setCurrentHandlers: [],
        setSelectHandlers: [],
        multipleSelect: []
      },
      //实体字段类型的数据
      _$EntityFieldTypes: {}
    }
    //			let  entitys = this.windowEntitys;
    let entitys = this._copyEntity(this.windowEntitys, this.entities)
    if (entitys) {
      let types: Record<string, any> = data._$EntityFieldTypes
      for (let entityCode in entitys) {
        let ds = datasourceManager.lookup({
          datasourceName: entityCode
        })
        if (!types[entityCode]) {
          if (ds) {
            let metadata = ds.getMetadata()
            if (metadata && metadata.fields) {
              let fields = metadata.fields
              let type: Record<string, any> = {}
              for (let j = 0; j < fields.length; j++) {
                let f = fields[j]
                type[f.code] = f.type
              }
              types[entityCode] = type
            }
          }
        }
        if (this.datas && this.datas.hasOwnProperty(entityCode)) {
          data[entityCode] = this.datas[entityCode]
        } else {
          if (ds) {
            let record = ds.getCurrentRecord()
            let obj = record
              ? record.toMap()
              : this._createEmptyRecord(entityCode)
            data[entityCode] = obj
          } else {
            let fieldList = entitys[entityCode]
            let fieldMap: Record<string, any> = {}
            for (let j = 0, len = fieldList.length; j < len; j++) {
              fieldMap[fieldList[j]] = null
            }
            data[entityCode] = fieldMap
          }
        }
      }
    }
    //			for(let  i=0,l=this.entities.length;i<l;i++){
    //				let  entityCode = this.entities[i];
    //				if(this.datas&&this.datas.hasOwnProperty(entityCode)){
    //					data[entityCode] = this.datas[entityCode];
    //				}else{
    //					let  ds = datasourceManager.lookup({datasourceName:entityCode});
    //					let  record = ds.getCurrentRecord();
    //					let  obj = record ? record.toMap():this._createEmptyRecord(entityCode);
    //					data[entityCode]= obj;
    //				}
    //			}
    for (let oldEntiyCode in this.entityMapping) {
      if (this.entityMapping.hasOwnProperty(oldEntiyCode)) {
        let newEntityCode = this.entityMapping[oldEntiyCode]
        let ds = datasourceManager.lookup({
          datasourceName: oldEntiyCode
        })
        if (ds) {
          let rs = ds.getAllRecords()
          data[newEntityCode] = rs.isEmpty() ? [] : rs.getOriginalDatas()
        } else {
          data[newEntityCode] = []
        }
      }
    }
    for (let oldEntiyCode in this.treeMapping) {
      if (this.treeMapping.hasOwnProperty(oldEntiyCode)) {
        let singleInfo = this.treeMapping[oldEntiyCode]
        let newEntityCode = singleInfo['newEntityCode']
        let ds = datasourceManager.lookup({
          datasourceName: oldEntiyCode
        })
        if (ds) {
          let rs = ds.getAllRecords()
          data[newEntityCode] = rs.isEmpty() ? [] : rs.getOriginalDatas()
        } else {
          data[newEntityCode] = []
        }
      }
    }
    //			for(let  i=0,l=this.forEntities.length;i<l;i++){
    //				let  entityCode = this.forEntities[i];
    //				let  ds = datasourceManager.lookup({datasourceName:entityCode});
    //				let  rs = ds.getAllRecords();
    //				data[this._genWrapEntityCode(entityCode)]= rs.isEmpty() ? []:rs.getOriginalDatas();
    //			}
    return data
  }

  _createVueWatcher() {
    let windowScope = scopeManager.getWindowScope(),
      watchers: Record<string, any> = {}
    if (this.instance) {
      let watchEvent = (function (sId, sManager, dsManager, v3Vue) {
        return function (code: string, val: any) {
          if (v3Vue && !v3Vue.duringDS2Vue[code]) {
            //当前同步数据到实体动作不是由实体数据同步到Vue引发
            sManager.openScope(sId)
            let ds = dsManager.lookup({
              datasourceName: code
            })
            let insertRecord = []
            let updateRecord = []
            if (typeof val.length != 'number') {
              val = [val]
            }
            for (let i = 0, l = val.length; i < l; i++) {
              let record = val[i]
              let rd = ds.getRecordById(record.id)
              if (rd) {
                let changed = null
                if (record) {
                  //add by xiedh 2018-04-19 过滤多余字段，vue当前行会默认给每个字段创建一个null值，如果不过滤，会造成多个字段更新问题
                  let changed: Record<string, any> = {},
                    original = rd.getOriginalData()
                  for (let field in record) {
                    if (record.hasOwnProperty(field)) {
                      //如果vue中字段值为null，且数据源记录中不存在该字段及值，则认为是vue创建数据时，为每个字段默认创建null值，无需更新到数据源中
                      if (
                        record[field] === null &&
                        !original.hasOwnProperty(field)
                      ) {
                        continue
                      }
                      changed[field] = record[field]
                    }
                  }
                }
                rd.setDatas(changed || record)
                updateRecord.push(rd)
              } else {
                rd = ds.createRecord()
                rd.setDatas(record)
                insertRecord.push(rd)
              }
            }
            if (updateRecord.length > 0)
              ds.updateRecords({
                records: updateRecord
              })
            //							if(insertRecord.length > 0) ds.insertRecords({records:insertRecord});
            sManager.closeScope()
          }
        }
      })(windowScope.getInstanceId(), scopeManager, datasourceManager, this)
      this.instance._$synData = watchEvent
    } else {
      let getWatcher = function (entityCode: string, v3Vue: V3Vue) {
        return {
          deep: true,
          sync: true,
          handler: (function (code, sId, sManager, dsManager, _vue) {
            return function (val: any, oVal: any) {
              if (_vue && !_vue.duringDS2Vue[code]) {
                //当前同步数据到实体动作不是由实体数据同步到Vue引发
                scopeManager.openScope(sId)
                let ds = dsManager.lookup({
                  datasourceName: code
                })
                if (!ds) return //如果数据源不存在，则不进行数据同步
                let insertRecord = []
                let updateRecord = []
                if (typeof val.length != 'number') {
                  val = [val]
                }
                for (let i = 0, l = val.length; i < l; i++) {
                  let record = val[i]
                  let rd = ds.getRecordById(record.id)
                  if (rd) {
                    rd.setDatas(record)
                    updateRecord.push(rd)
                  } else {
                    rd = ds.createRecord()
                    try {
                      delete record.id //id值不能更改
                    } catch (e) {}
                    rd.setDatas(record)
                    record.id = rd.getSysId()
                    insertRecord.push(rd)
                  }
                }
                if (updateRecord.length > 0)
                  ds.updateRecords({
                    records: updateRecord
                  })
                //									if(insertRecord.length > 0) ds.insertRecords({records:insertRecord});

                scopeManager.closeScope()
              }
            }
          })(
            entityCode,
            windowScope.getInstanceId(),
            scopeManager,
            datasourceManager,
            v3Vue
          )
        }
      }
      let entitys = this.windowEntitys
      for (let entityCode in entitys) {
        watchers[entityCode] = getWatcher(entityCode, this)
      }
      //				for(let  i=0,l=this.entities.length;i<l;i++){
      //					let  entityCode = this.entities[i];
      //					watchers[entityCode] = getWatcher(entityCode);
      //				}
      if (this.entityMapping) {
        for (let entityCode in this.entityMapping) {
          if (this.entityMapping.hasOwnProperty(entityCode)) {
            let val = this.entityMapping[entityCode]
            if (!watchers[val]) {
              watchers[val] = getWatcher(entityCode, this)
            }
          }
        }
      }
    }
    return watchers
  }

  _createVueMethod() {
    let scopeId = scopeManager.getCurrentScopeId()
    let windowScope = scopeManager.getWindowScope()
    let handleEvent =
      this.hanleEventFunc ||
      (function (sId, code) {
        return function (eventName: string) {
          _addEventToPool(eventName)
          if (_couldRun(eventName)) {
            _markEventRunning(eventName)
            try {
              let finishBack = function () {
                _markEventComplete(eventName)
                /* arguments不为空且类型为function时才执行 */
                if (
                  typeof arguments[2] != 'undefined' &&
                  typeof arguments[2] == 'function'
                ) {
                  arguments[2]()
                  return
                }
                if (
                  typeof arguments[3] != 'undefined' &&
                  typeof arguments[3] == 'function'
                ) {
                  arguments[3]()
                  return
                }
              }
              scopeManager.openScope(sId)
              let handler = eventManager.fireEvent(
                code,
                eventName,
                finishBack,
                finishBack
              )
              scopeManager.closeScope()
              let args = Array.prototype.slice.call(arguments, 1)
              handler.apply(this, args)
            } catch (err) {
              _markEventComplete(eventName)
            }
          }
          /* 	scopeManager.openScope(sId);
                    let  handler = eventManager.fireEvent(code, eventName, arguments[2], arguments[3]);
                    scopeManager.closeScope();
                    let  args = Array.prototype.slice.call(arguments, 1)
                    handler.apply(this, args); */
        }
      })(scopeId, this.eventTargetCode || this.widgetCode)
    let _$getDatasource = (function (sId, dsManager) {
      return function (entityCode: string) {
        scopeManager.openScope(sId)
        let ds = dsManager.lookup({
          datasourceName: entityCode
        })
        scopeManager.closeScope()
        return ds
      }
    })(scopeId, datasourceManager)
    //			/* 注册数据源事件 */
    //			let  _$registerDsEvent = (function (_this) {
    //				return function (func) {
    //					if (typeof (func) == 'function')
    //						_this.dsEventRegisterFunc.push(func);
    //				}
    //			})(this);
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
    let handlerCellFunc = function (
      handler: Function,
      field: string,
      tmpVue: any
    ) {
      return function (params: Record<string, any>) {
        if (typeof handler == 'function') {
          let result: Array<any> = []
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
          let newRecord = {}
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
    /**
     * 注册数据源事件
     *
     * @param {Function}
     *            func 数据源事件注册函数
     */
    let _$registerDsEvent = (function (_this) {
      return function (param: Record<string, any>) {
        if (typeof param == 'function') _this.dsEventRegisterFunc.push(param)
        else if (typeof param == 'object' && param.dsName && param.eventType) {
          _this.dsEventRegisterFunc.push(
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
                        handler = handlerCellFunc(param.handler, field, tmpVue)
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
      }
    })(this)
    let md
    if (this.moduleScriptId) {
      let md = require(this.moduleScriptId)
      if (md) {
        md._$putHandleEventFunc(handleEvent)
        md._$putSandbox(sandbox)
        md._$putVdkFunc(this)
      }
    }
    let _refFn = (function (module, v3Vue) {
      return function (func: string) {
        if (module && module[func]) {
          return module[func]
        } else {
          throw Error('未找到方法[' + func + ']，请检查！')
        }
      }
    })(md, this)
    let _callEvent = (function (module, sId, v3Vue) {
      return function (func: string) {
        if (module && module[func]) {
          scopeManager.openScope(sId)
          let rs
          try {
            let funcTemp: Function = module[func]
            rs = module[func]
              ? funcTemp.apply(
                  v3Vue.vueInstance,
                  Array.prototype.slice.call(arguments, 1)
                )
              : ''
          } finally {
            scopeManager.closeScope()
          }
          return rs
        } else if (
          v3Vue &&
          v3Vue.instance &&
          v3Vue.instance &&
          v3Vue.instance._existFunc(func)
        ) {
          scopeManager.openScope(sId)
          let _func = v3Vue.instance._getCallFunc()[func]
          let rs
          try {
            rs = _func.apply(
              v3Vue.vueInstance,
              Array.prototype.slice.call(arguments, 1)
            )
          } finally {
            scopeManager.closeScope()
          }
          return rs
        } else {
          throw Error('未找到方法[' + func + ']，请检查！')
        }
      }
    })(md, scopeId, this)
    let _$synCurrentRecordToDs = (function (sId, dsManager) {
      return function (
        entityCode: string,
        current: Record<string, any>,
        oldCurrent: any
      ) {
        scopeManager.openScope(sId)
        let ds = dsManager.lookup({
          datasourceName: entityCode
        })
        if (ds) {
          ds.setCurrentRecord({
            record: ds.getRecordById(current.id)
          })
        }
        scopeManager.closeScope()
      }
    })(scopeId, datasourceManager)
    let _$synCurrentIdToDs = (function (sId, dsManager) {
      return function (entityCode: string, id: string) {
        scopeManager.openScope(sId)
        let ds = dsManager.lookup({
          datasourceName: entityCode
        })
        if (ds) {
          ds.setCurrentRecord({
            record: ds.getRecordById(id)
          })
        }
        scopeManager.closeScope()
      }
    })(scopeId, datasourceManager)
    let _$synSelectRecordToDs = (function (sId, dsManager) {
      return function (
        entityCode: string,
        data: Record<string, any>,
        isSel: boolean
      ) {
        scopeManager.openScope(sId)
        let ds = dsManager.lookup({
          datasourceName: entityCode
        })
        if (ds) {
          ds.selectRecords({
            isSelect: isSel,
            records: [ds.getRecordById(data.id)]
          })
        }
        scopeManager.closeScope()
      }
    })(scopeId, datasourceManager)
    let _$getScopeId = (function (sId) {
      return function () {
        return sId
      }
    })(scopeId)
    let _$getMultipleSelectList = function () {
      return this._data._$v3paltformData.multipleSelect
    }
    //			let  _registerVuiTagEvent = (function(_vue){
    //				return function(widgetCode,eventName,handle){
    //					if(!_vue._$vuiTagEventStorage){
    //						_vue._$vuiTagEventStorage = {}
    //					}
    //					let  _vuiTagEventStorage = _vue._$vuiTagEventStorage;
    //					if(!_vuiTagEventStorage[widgetCode]){
    //						_vuiTagEventStorage[widgetCode] = {};
    //					}
    //					let  _event = _vuiTagEventStorage[widgetCode];
    //					_event[eventName] = handle;
    //				}
    //			})(vue);
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
    //			let  _fireVuiTagEvent =(function(_vue){
    //				return function(widgetCode,eventName,params){
    //					let  _vuiTagEventStorage = _vue._$vuiTagEventStorage;
    //					if(_vuiTagEventStorage && _vuiTagEventStorage[widgetCode]){
    //						let  tagEvents = _vuiTagEventStorage[widgetCode];
    //						if(typeof(tagEvents[eventName]) == "function"){
    //							let  handle = tagEvents[eventName];
    //							handle(params);
    //						}
    //					}
    //				}
    //			})(vue);
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
    let _nowV3Vue = this
    /**
     * 注册onDataLoad事件
     * */
    let _$registerDataLoadedEvent = function () {
      windowInit.registerHandler({
        eventName: windowInit.Events.OnDataLoad,
        handler: (function (_this) {
          return function () {
            let _dsEvents = _this.dsEventRegisterFunc
            if (_dsEvents && _dsEvents.length > 0) {
              for (let i = 0, len = _dsEvents.length; i < len; i++) {
                let event = _dsEvents[i]
                event.apply(_this, arguments)
              }
            }
          }
        })(_nowV3Vue)
      })
    }
    //			vue._$registerVuiTagEvent = _registerVuiTagEvent;
    //			vue._$fireVuiTagEvent = _fireVuiTagEvent;
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
    if (this.instance) {
      this.instance._$handleEvent = handleEvent
      this.instance._$callEvent = _callEvent
      this.instance._$getDatasource = _$getDatasource
      this.instance._$getEntityFieldType = _$getEntityFieldType
      this.instance._$registerDsEvent = _$registerDsEvent
      this.instance._$getScopeId = _$getScopeId
      this.instance._$registerDataLoadedEvent = _$registerDataLoadedEvent
      this.instance._$vue_vm._$synCurrentRecordToDs = _$synCurrentRecordToDs
      this.instance._$vue_vm._$synCurrentIdToDs = _$synCurrentIdToDs
      this.instance._$vue_vm._$synSelectRecordToDs = _$synSelectRecordToDs
      this.instance._$vue_vm._$getMultipleSelectList = _$getMultipleSelectList
      //				this.instance._$vue_vm._$registerContainerEvent = _event.register;
      //				this.instance._$vue_vm._$fireContainerEvent = _event.fire;
    } else {
      return {
        handleEvent: handleEvent,
        call: _callEvent,
        refFn: _refFn,
        _$getDatasource: _$getDatasource,
        _$getEntityFieldType: _$getEntityFieldType,
        _$registerDsEvent: _$registerDsEvent,
        _$registerDataLoadedEvent: _$registerDataLoadedEvent,
        _$synCurrentRecordToDs: _$synCurrentRecordToDs,
        _$synCurrentIdToDs: _$synCurrentIdToDs,
        _$getScopeId: _$getScopeId,
        _$synSelectRecordToDs: _$synSelectRecordToDs,
        _$getMultipleSelectList: _$getMultipleSelectList,
        _$registerVuiTagEvent: _$registerVuiTagEvent,
        _$fireVuiTagEvent: _$fireVuiTagEvent,
        //					_$registerContainerEvent : _event.register,
        //					_$fireContainerEvent : _event.fire,
        _getComponentCode: (function (componentCode) {
          return function () {
            return componentCode
          }
        })(windowScope.getComponentCode()),
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
              synCurrentIdToDs: function (entityCode: string, id: string) {
                let func = _this._$synCurrentIdToDs
                if (func) {
                  func.apply(_this, [entityCode, id])
                }
              },
              synSelectRecordToDs: function (
                entityCode: string,
                data: Record<string, any>,
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
                datas: any,
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
              markDsMultipleSelect: function (entityCode: Function) {
                _this._data._$v3paltformData.multipleSelect.push(entityCode)
              }
            }
          }
        }
      }
    }
  }

  render() {
    let vm
    if (this.instance) {
      this.processedHtml = this.instance.html
      this.entityMapping = this.instance.entityMapping
      this.treeMapping = this.instance.treeMapping
      if (this.instance.dsEventRegisterFunc.length > 0) {
        for (
          let i = 0, len = this.instance.dsEventRegisterFunc.length;
          i < len;
          i++
        ) {
          this.dsEventRegisterFunc.push(this.instance.dsEventRegisterFunc[i])
        }
      }
      vm = this.instance._$vue_vm
      this._createVueMethod()
      this._createVueWatcher()
    } else {
      this.analyEntity(this.html)
      let el =
        typeof this.element == 'string'
          ? $('#' + this.element)
          : $(this.element)
      if (this.autoMoutStyle) {
        el.attr(v3VueUtil.getCssAttrName(), this.cssSymbol)
      }
      let html = this.getHtml()
      if (html) {
        el.html(html)
      }
      vm = new Vue({
        el: el[0],
        data: this._createVueData(),
        methods: this._createVueMethod(),
        watch: this._createVueWatcher()
      })
    }

    this.vueInstance = vm
    let multi = vm._$getMultipleSelectList()
    if (multi && multi.length > 0) {
      for (let i = 0, l = multi.length; i < l; i++) {
        let ds = datasourceManager.lookup({
          datasourceName: multi[i]
        })
        if (ds) {
          ds.markMultipleSelect()
          ds.setDefaultSelect({
            defaultSel: false
          })
        }
      }
    }
    let extend = this._extendDiff
    let handler = function (record: Record<string, any>) {
      let vm = this.pros.vm,
        v3vm = this.pros.v3vm
      let dsName = this.datasourceName
      v3vm.duringDS2Vue[dsName] = true
      if (record) {
        //let  data = record.toMap();2017-06-22 xiedh 只同步更新过的值，防止引发触发其他未更新字段值逻辑
        //objectUtil.extend(vm[dsName],data);
        extend(vm[dsName], record.toMap())
      } else {
        let data = vm[dsName]
        for (let attr in data) {
          if (attr != 'id') {
            data[attr] = null
          }
        }
      }
      v3vm.duringDS2Vue[dsName] = false
      vm.$nextTick(
        (function (_this) {
          return function () {
            _this._fire({
              eventName: _this.Events.Rendered,
              args: []
            })
          }
        })(v3vm)
      )
    }
    if (this.datas) {
      for (let i = 0, l = this.entities.length; i < l; i++) {
        let observer = new DatasourceObserver(
          this.entities[i],
          this.widgetCode,
          {
            vm: vm,
            v3vm: this
          }
        )
        observer.setAsync(false)
        observer.setUpdateHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet,
            ds = this.datasourceName,
            vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let data = vm[ds]
          v3vm.duringDS2Vue[ds] = true
          resultSet.iterate(function (rd: Record<string, any>) {
            if (data.id == rd.getSysId()) {
              extend(data, rd.toMap())
              //objectUtil.extend(data,rd.toMap());2017-06-22 xiedh 只同步更新过的值，防止引发触发其他未更新字段值逻辑
            }
          })
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observerManager.addObserver({
          observer: observer
        })
      }
    } else {
      for (let entityCode in this.windowEntitys) {
        let observer = new CurrentRecordObserver(entityCode, this.widgetCode, {
          vm: vm,
          v3vm: this
        })
        observer.setAsync(false)
        observer.setWidgetValueHandler(handler)
        observer.clearWidgetValueHandler(handler)
        observerManager.addObserver({
          observer: observer
        })
      }
      //				for(let  i=0,l=this.entities.length;i<l;i++){
      //					let  observer = new CurrentRecordObserver(this.entities[i],this.widgetCode,{"vm":vm,"v3vm":this});
      //					observer.setWidgetValueHandler(handler);
      //					observer.clearWidgetValueHandler(handler);
      //					observerManager.addObserver({"observer":observer});
      //				}
      for (let oldEntityCode in this.entityMapping) {
        if (!this.entityMapping.hasOwnProperty(oldEntityCode)) continue
        let newEntityCode = this.entityMapping[oldEntityCode]
        let observer = new DatasourceObserver(oldEntityCode, this.widgetCode, {
          vm: vm,
          v3vm: this
        })
        observer.setAsync(false)
        observer.setLoadHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let isAppend = args.isAppend
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.entityMapping[ds]
          v3vm.duringDS2Vue[ds] = true
          if (!isAppend) {
            //							datas.splice(0,datas.length);
            //vui列定义了下拉选择，下拉选择中使用数据源时，直接赋值空数组会导致无法使用后面加载的数据
            //							vm[entityCode] = [];
            vm[entityCode].splice(0, vm[entityCode].length)
          }
          let datas = vm[entityCode]
          let records: Array<Record<string, any>> = []
          let extraFields = resultSet.datas
            ? v3vm.getExtraFields(resultSet.datas[0], ds)
            : []
          resultSet.iterate(function (rd: Record<string, any>) {
            let map = rd.toMap()
            for (let _i = 0, _len = extraFields.length; _i < _len; _i++) {
              map[extraFields[_i]] = null
            }
            records.push(map)
          })
          vm[entityCode].push.apply(vm[entityCode], records)
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setInsertHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.entityMapping[ds]
          let entityFields = v3vm.windowEntitys[ds]
          let datas = vm[entityCode]
          let records: Array<Record<string, any>> = []
          v3vm.duringDS2Vue[ds] = true
          resultSet.iterate(function (rd: Record<string, any>) {
            let nowMap = rd.toMap()
            for (let i = 0, l = entityFields.length; i < l; i++) {
              let attr = entityFields[i]
              if (
                entityFields.indexOf(attr) != -1 &&
                !nowMap.hasOwnProperty(attr)
              ) {
                nowMap[attr] = null
              }
            }
            records.push(nowMap)
          })
          datas.push.apply(datas, records)
          let tmpData = []
          if (datas && datas.length > 0) {
            for (let i = 0, l = datas.length; i < l; i++) {
              tmpData.push(datas[i])
            }
          }
          vm[entityCode] = tmpData
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setUpdateHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.entityMapping[ds]
          let datas = vm[entityCode]
          v3vm.duringDS2Vue[ds] = true
          resultSet.iterate(function (rd: Record<string, any>) {
            for (let i = 0, l = datas.length; i < l; i++) {
              let d = datas[i]
              if (d.id == rd.getSysId()) {
                extend(d, rd.toMap())
                //objectUtil.extend(d,rd.toMap());
                break
              }
            }
          })
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setRemoveHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.entityMapping[ds]
          let datas = vm[entityCode]
          v3vm.duringDS2Vue[ds] = true
          let tmpDatas = []
          let deleteIds: Array<string> = []
          resultSet.iterate(function (rd: Record<string, any>) {
            deleteIds.push(rd.getSysId())
          })
          for (let i = 0, l = datas.length; i < l; i++) {
            let d = datas[i]
            if (deleteIds.indexOf(d.id) == -1) {
              tmpDatas.push(d)
            }
          }
          vm[entityCode] = tmpDatas
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setCurrentRecordHandler(function (args: Record<string, any>) {
          let current = args.currentRecord,
            ds = this.datasourceName,
            vm = this.pros.vm,
            v3vm = this.pros.v3vm
          v3vm.duringDS2Vue[ds] = true
          vm._$v3platform().datasource.synCurrentRecordToUi(ds, current)
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setSelectRecordHandler(function (args: Record<string, any>) {
          let records = args.resultSet.toArray(),
            isSelect = args.isSelect,
            ds = this.datasourceName,
            vm = this.pros.vm,
            v3vm = this.pros.v3vm
          v3vm.duringDS2Vue[ds] = true
          vm._$v3platform().datasource.synSelectRecordToUi(
            ds,
            records,
            isSelect
          )
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observerManager.addObserver({
          observer: observer
        })
      }
      for (let oldEntityCode in this.treeMapping) {
        if (!this.treeMapping.hasOwnProperty(oldEntityCode)) continue
        let newEntityCode = this.treeMapping[oldEntityCode]['newEntityCode']
        let observer = new DatasourceObserver(oldEntityCode, this.widgetCode, {
          vm: vm,
          v3vm: this
        })
        observer.setAsync(false)
        observer.setLoadHandler(function (args: ReactDOM<string, any>) {
          let resultSet = args.resultSet
          let isAppend = args.isAppend
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.treeMapping[ds]['newEntityCode']
          v3vm.duringDS2Vue[ds] = true
          if (!isAppend) {
            vm[entityCode] = []
            v3vm.treeMapping[ds]['allRecord'] = {}
          }
          let datas = vm[entityCode]
          //						if(!isAppend){
          //							datas.splice(0,datas.length);
          //						}
          let fieldMapping = v3vm.treeMapping[ds]['fieldMapping']
          let idField = fieldMapping['id']
          let titleField = fieldMapping['title']
          let parentField = fieldMapping['parentField']
          let expandField = fieldMapping['expand']
          let disabledField = fieldMapping['disabled']
          let disableCheckboxField = fieldMapping['disableCheckbox']
          //用于保存所有记录
          if (!v3vm.treeMapping[ds]['allRecord'])
            v3vm.treeMapping[ds]['allRecord'] = {}
          let allRecord = v3vm.treeMapping[ds]['allRecord']
          let notHandleRecord: Array<Record<string, any>> = []
          resultSet.iterate(function (rd: Record<string, any>) {
            let singleRecord: Record<string, any> = {}
            let tmp_id = rd.get(idField)
            allRecord[tmp_id] = singleRecord
            singleRecord['id'] = tmp_id
            singleRecord['title'] = rd.get(titleField)
            singleRecord['PID'] = rd.get(parentField)
            singleRecord['expand'] = expandField ? rd.get(expandField) : true
            singleRecord['disabled'] = expandField
              ? rd.get(disabledField)
              : false
            singleRecord['disableCheckbox'] = expandField
              ? rd.get(disableCheckboxField)
              : false
            singleRecord['children'] = []
            if (!singleRecord['PID']) {
              datas.push(singleRecord)
            } else {
              notHandleRecord.push(singleRecord)
            }
          })
          for (let i = 0, l = notHandleRecord.length; i < l; i++) {
            let record = notHandleRecord[i]
            let pid = record['PID']
            let parentRecord = allRecord[pid]
            if (parentRecord) {
              parentRecord['children'].push(record)
            } else {
              datas.push(record)
            }
          }
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setInsertHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.treeMapping[ds]['newEntityCode']
          let datas = vm[entityCode]

          let fieldMapping = v3vm.treeMapping[ds]['fieldMapping']
          let idField = fieldMapping['id']
          let titleField = fieldMapping['title']
          let parentField = fieldMapping['parentField']
          let expandField = fieldMapping['expand']
          let disabledField = fieldMapping['disabled']
          let disableCheckboxField = fieldMapping['disableCheckbox']
          //用于保存所有记录
          if (!v3vm.treeMapping[ds]['allRecord'])
            v3vm.treeMapping[ds]['allRecord'] = {}
          let allRecord = v3vm.treeMapping[ds]['allRecord']
          let notHandleRecord: Array<Record<string, any>> = []
          v3vm.duringDS2Vue[ds] = true
          resultSet.iterate(function (rd: Record<string, any>) {
            let singleRecord: Record<string, any> = {}
            let tmp_id = rd.get(idField)
            allRecord[tmp_id] = singleRecord
            singleRecord['id'] = tmp_id
            singleRecord['title'] = rd.get(titleField)
            singleRecord['PID'] = rd.get(parentField)
            singleRecord['expand'] = expandField ? rd.get(expandField) : false
            singleRecord['disabled'] = expandField
              ? rd.get(disabledField)
              : false
            singleRecord['disableCheckbox'] = expandField
              ? rd.get(disableCheckboxField)
              : false
            singleRecord['children'] = []
            if (!singleRecord['PID']) {
              datas.push(singleRecord)
            } else {
              notHandleRecord.push(singleRecord)
            }
          })
          for (let i = 0, l = notHandleRecord.length; i < l; i++) {
            let record = notHandleRecord[i]
            let pid = record['PID']
            let parentRecord = allRecord[pid]
            if (parentRecord) {
              parentRecord['children'].push(record)
            } else {
              datas.push(record)
            }
          }
          let tmpData = []
          if (datas && datas.length > 0) {
            for (let i = 0, l = datas.length; i < l; i++) {
              tmpData.push(datas[i])
            }
          }
          vm[entityCode] = tmpData
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setUpdateHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.treeMapping[ds]['newEntityCode']
          let datas = vm[entityCode]

          let fieldMapping = v3vm.treeMapping[ds]['fieldMapping']
          let idField = fieldMapping['id']
          //用于保存所有记录
          if (!v3vm.treeMapping[ds]['allRecord'])
            v3vm.treeMapping[ds]['allRecord'] = {}
          let allRecord = v3vm.treeMapping[ds]['allRecord']
          v3vm.duringDS2Vue[ds] = true
          resultSet.iterate(function (rd: Record<string, any>) {
            let id = rd.get(idField)
            let record = allRecord[id]
            if (record) extend(record, rd.toMap())
          })
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setRemoveHandler(function (args: Record<string, any>) {
          let resultSet = args.resultSet
          let ds = this.datasourceName
          let vm = this.pros.vm,
            v3vm = this.pros.v3vm
          let entityCode = v3vm.entityMapping[ds]['newEntityCode']
          let datas = vm[entityCode]

          let fieldMapping = v3vm.treeMapping[ds]['fieldMapping']
          let idField = fieldMapping['id']
          //用于保存所有记录
          if (!v3vm.treeMapping[ds]['allRecord'])
            v3vm.treeMapping[ds]['allRecord'] = {}
          let allRecord = v3vm.treeMapping[ds]['allRecord']
          v3vm.duringDS2Vue[ds] = true
          let tmpDatas: Array<Record<string, any>> = []
          let deleteIds: Array<string> = []
          for (let i = 0, l = datas.length; i < l; i++) {
            let d = datas[i]
            deleteIds.push(d.id)
          }
          resultSet.iterate(function (rd: Record<string, any>) {
            if (deleteIds.indexOf(rd.getSysId()) == -1) {
              tmpDatas.push(rd)
            }
            //							for(let  i=0,l=datas.length;i<l;i++){
            //								let  d = datas[i];
            //								if(d.id==rd.getSysId()){
            //									delete allRecord[d.id];
            //									datas.splice(i,1);
            //									break;
            //								}
            //							}
          })
          vm[entityCode] = tmpDatas
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setCurrentRecordHandler(function (args: Record<string, any>) {
          let current = args.currentRecord,
            ds = this.datasourceName,
            vm = this.pros.vm,
            v3vm = this.pros.v3vm
          v3vm.duringDS2Vue[ds] = true
          vm._$v3platform().datasource.synCurrentRecordToUi(ds, current)
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observer.setSelectRecordHandler(function (args: Record<string, any>) {
          let records = args.resultSet.toArray(),
            isSelect = args.isSelect,
            ds = this.datasourceName,
            vm = this.pros.vm,
            v3vm = this.pros.v3vm
          v3vm.duringDS2Vue[ds] = true
          vm._$v3platform().datasource.synSelectRecordToUi(
            ds,
            records,
            isSelect
          )
          v3vm.duringDS2Vue[ds] = false
          vm.$nextTick(
            (function (_this) {
              return function () {
                _this._fire({
                  eventName: _this.Events.Rendered,
                  args: []
                })
              }
            })(v3vm)
          )
        })
        observerManager.addObserver({
          observer: observer
        })
      }
    }
    vm.$nextTick(
      (function (_this) {
        return function () {
          _this._fire({
            eventName: _this.Events.Rendered,
            args: []
          })
        }
      })(this)
    )
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

  getExtraFields(data: Record<string, any>, dsName: string) {
    //获取数据缺少的字段列表，解决获取规则只获取部分字段的数据时，在自定义div里面使用无法同步数据的问题
    let extraFields = []
    if (data) {
      let entitys = this.windowEntitys
      if (entitys && entitys[dsName]) {
        let allFields = entitys[dsName]
        for (let i = 0, len = allFields.length; i < len; i++) {
          let field = allFields[i]
          if (allFields.indexOf(field) != -1 && !data.hasOwnProperty(field)) {
            extraFields.push(field)
          }
        }
      }
    }
    return extraFields
  }

  analyEntity(html: string) {
    const _this = this
    //分析实体
    if (!html) return
    let template = html
    let entityMapping: Record<string, any> = {} //普通实体映射新名称
    let treeMapping: Record<string, any> = this.treeMapping
      ? this.treeMapping
      : {} //属性实体映射新名称
    //			let  entitys = this.windowEntitys;//实体字段信息
    let entitys = this.windowEntitys ? this.windowEntitys : []
    let tmpThis = this
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
                  entityCode as string
                )
                childNode.setAttribute(attrName, newEntityCode)
                childNode.setAttribute(':entity-code', "'" + entityCode + "'")
              }
            } else if (dataType == 'Tree') {
              //以树的方式绑定实体
              if (attrName) {
                //绑定实体方式为 :data 或 v-bind:data
                let entityCode = childNode.getAttribute(attrName)
                let newEntityCode = _this.toNewEntityCode(entityCode as string)
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
                entityCode ? (treeMapping[entityCode] = newMappingInfo) : ''
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
                    //										text_field_attr_name = "text-field";
                    break
                }
                if (
                  value_field_attr_name != '' &&
                  childNode.hasAttribute(value_field_attr_name)
                ) {
                  childNode.setAttribute('___ds___', entityCode as string)
                  let _$fields = []
                  _$fields.push(childNode.getAttribute(value_field_attr_name))
                  //									if(text_field_attr_name != "" && childNode.hasAttribute(text_field_attr_name)){
                  //										_$fields.push(childNode.getAttribute(text_field_attr_name));
                  //									}
                  childNode.setAttribute('___field___', _$fields.join(','))
                }
              }
            }
          }
        }
        let attrName = 'v-for'
        if (childNode.hasAttribute(attrName)) {
          let expArray: Array<any> = []
          if (childNode !== null) {
            expArray = childNode.getAttribute(attrName).split(' in ')
          }

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
    this.processedHtml = _tmplate.substring(5, _tmplate.length - 6)
    this.treeMapping = treeMapping
    this.entityMapping = entityMapping
  }

  _extend(aim: Record<string, any>, source: Record<string, any>) {
    for (let attr in source) {
      if (source.hasOwnProperty(attr) && !aim.hasOwnProperty(attr)) {
        aim[attr] = source[attr]
      }
    }
    return aim
  }

  clone(params: Record<string, any>) {
    return new V3Vue(params ? this._extend(params, this) : this)
  }

  _fire(params: Record<string, any>) {
    let eventName = params.eventName,
      args = params.args
    if (this.eventHandlers[eventName]) {
      let handlers = this.eventHandlers[eventName]
      for (let i = 0, l = handlers.length; i < l; i++) {
        let handler = handlers[i]
        handler.apply(this, args)
      }
    }
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

V3Vue.prototype._defaultModuleScript =
  'let  _$hanleEventFunc$_,sandbox,vdk;exports._$putVdkFunc = function(_vdk){vdk=_vdk;};exports._$putSandbox=function(sb){sandbox=sb};let  getSandbox=function(){return sandbox;};exports._$putHandleEventFunc=function(func){_$hanleEventFunc$_=func;};let  handleEvent=function(){if(_$hanleEventFunc$_)_$hanleEventFunc$_.apply(this,arguments)};'

export default V3Vue
