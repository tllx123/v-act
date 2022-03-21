import { WindowInfo as windowInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { FrontEndAlerter as frontEndAlerter } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Platform as i18n_window } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { MobileViewPortAdapter as mobileViewPortAdapter } from '@v-act/vjs.framework.extension.platform.interface.mobile.viewport.adapter'
import { DatasourceObserver } from '@v-act/vjs.framework.extension.platform.interface.observer'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import * as windowInit from '@v-act/vjs.framework.extension.platform.services.init'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import * as observerManager from '@v-act/vjs.framework.extension.platform.services.observer.manager'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as v3VueUtil from './V3VueUtils'

let sandbox
/* 定义事件运行状态常量 */
if (typeof EventStatus == 'undefined') {
  var EventStatus = {
    Running: 'running',
    Complete: 'complete'
  }
}
/**
 * @param {Object}
 *            element Div要挂载的元素
 * @param {String}
 *            componentCode 构件编码
 * @param {String}
 *            windowCode 窗体编码
 * @param {String}
 *            widgetCode 控件编码
 * @param {Array}
 *            entities 实体列表
 * @param {Array}
 *            events 事件列表
 *
 */
class V3ComponentVue {
  others: Record<string, any> = {}
  element
  componentCode
  windowCode
  widgetCode
  entities
  events
  widgets
  eventStatusPool: Record<string, any> = {}
  datas
  cssSymbol
  autoMoutStyle
  isDuringThrendList
  resetHeaderOrFootHeight
  duringThrendListInfo
  windowEntitys
  i18nPro
  moduleDefineFunc: Record<string, any>
  duringDS2Vue
  observerIds: Array<any>
  series
  dsEventRegisterFunc: Array<any>
  vueInstance: any
  hanleEventFunc: any

  _data: Array<any> = []

  constructor(params: Record<string, any>) {
    if (params) {
      this.element = params.element
      this.componentCode = params.componentCode
      this.windowCode = params.windowCode
      this.widgetCode = params.widgetCode
      this.entities = params.entities || []
      this.events = params.events || []
      this.widgets = params.pros.widgets || []
      this.eventStatusPool = {}
      /* 初始化事件状态池 */
      for (let index = 0; index < this.events.length; index++) {
        this.eventStatusPool[this.events[index]] = EventStatus.Complete
      }
      this.datas = params.datas || null
      this.cssSymbol =
        params.pros && params.pros.cssSymbol
          ? params.pros.cssSymbol
          : params.cssSymbol
      this.autoMoutStyle =
        typeof params.autoMoutStyle == 'boolean' ? params.autoMoutStyle : true
      /* 是否在动态列表组内的vue实例，用于是否更新current */
      this.isDuringThrendList =
        params.isDuringThrendList === true ? true : false
      this.resetHeaderOrFootHeight = params.resetHeaderOrFootHeight
      this.duringThrendListInfo = {
        params: params.resetHeaderOrFootHeight,
        duringThrendListEntity:
          params.duringThrendListEntity /* 动态列表组实体，监听时候使用 */
      }
    } else {
      this.entities = []
      this.events = []
    }
    /* 窗体实体信息 */
    this.windowEntitys =
      params.pros && params.pros.windowEntitys ? params.pros.windowEntitys : []
    /* 窗体实体信息 */
    this.i18nPro =
      params.pros && params.pros.i18n
        ? (function () {
            let pro = params.pros.i18n
            let result: Record<string, any> = {}
            for (let key in pro) {
              if (pro.hasOwnProperty(key)) {
                result[key] = pro[key]
              }
            }
            return result
          })()
        : {}
    this.moduleDefineFunc = {}
    this.duringDS2Vue = {} // 从ds同步到ui
    this.observerIds = []
    this.series = params.series //此属性是为了处理网页窗体下不能添加f7相关的dom，因为添加后，网页窗体存在不显示的问题
    // 注册数据源事件的函数列表
    this.dsEventRegisterFunc = []
  }

  /**
   * 构造Vue数据
   */
  _createVueData() {
    /* 此data除了实体，不允许值为数组的其他标识 */
    let widgetPropData = {}
    let data = {
      recordMap: {},
      /* 用于监测每一项的变化 */
      recordMapFn: {},
      /* 保存每条记录watch返回的函数 */
      vui_version: '2.0',
      /* 当前vui版本 */
      _$v3paltformData: {
        setCurrentHandlers: [],
        setSelectHandlers: [],
        multipleSelect: []
      },
      v3platform_$Data: {
        widgetPropData: widgetPropData
      },
      //实体字段类型的数据
      _$EntityFieldTypes: {}
    }
    let windowScope = scopeManager.getWindowScope()
    let componentCode = windowScope.getComponentCode()
    let windowcode = windowScope.getWindowCode()
    let widgetPermission = windowInfo.getWidgetPermission(
      componentCode,
      windowcode
    )
    if (widgetPermission && widgetPermission.edit) {
      widgetPermission = widgetPermission.edit
    }
    let widgets = this.widgets
    if (widgets.length > 0) {
      for (let i = 0, l = widgets.length; i < l; i++) {
        let widget = widgets[i]
        let widgetId = widget.code
        let perProp = {}
        if (widgetPermission[widgetId]) {
          perProp = widgetPermission[widgetId]
        }
        let widgetProp = {}
        for (let propkey in widget.props) {
          let widgetDefaultValue = widget.props[propkey].default
          if (perProp.hasOwnProperty(propkey)) {
            widgetDefaultValue = perProp[propkey]
          }
          widgetProp[propkey.replace(/-/g, '$')] = widgetDefaultValue
        }
        for (let propkey in perProp) {
          if (
            perProp.hasOwnProperty(propkey) &&
            !widgetProp.hasOwnProperty(propkey)
          ) {
            widgetProp[propkey.replace(/-/g, '$')] = perProp[propkey]
          }
        }
        widgetPropData[widgetId] = widgetProp
      }
    }

    /*-------------------保存实体字段类型		start		-------------------*/
    let types = data._$EntityFieldTypes
    if (this.windowEntitys) {
      for (let entityCode in this.windowEntitys) {
        if (!types[entityCode]) {
          let ds = datasourceManager.lookup({
            datasourceName: entityCode
          })
          if (ds) {
            let metadata = ds.getMetadata()
            if (metadata && metadata.fields) {
              let fields = metadata.fields
              let type = {}
              for (let j = 0; j < fields.length; j++) {
                let f = fields[j]
                type[f.code] = f.type
              }
              types[entityCode] = type
            }
          }
        }
      }
    }
    /*-------------------保存实体字段类型		end		-------------------*/
    let entities = this.entities
    if (entities.length > 0) {
      for (let i = 0, l = entities.length; i < l; i++) {
        let entityCode = entities[i]
        if (!types[entityCode]) {
          let ds = datasourceManager.lookup({
            datasourceName: entityCode
          })
          if (ds) {
            let metadata = ds.getMetadata()
            if (metadata && metadata.fields) {
              let fields = metadata.fields
              let type = {}
              for (let j = 0; j < fields.length; j++) {
                let f = fields[j]
                type[f.code] = f.type
              }
              types[entityCode] = type
            }
          }
        }
        // let  ds =
        // datasourceManager.lookup({datasourceName:entityCode});
        // let  rs;
        // if(ds){
        // let  rs = ds.getAllRecords();
        // data[entityCode]= rs.isEmpty() ?
        // []:rs.getOriginalDatas();
        // if(this.datas&&this.datas.hasOwnProperty(entityCode) &&
        // typeof(this.datas[entityCode]) == "object"){
        // if(typeof(this.datas[entityCode].length) == "undefined"){
        // data[entityCode].current = this.datas[entityCode];
        // }else if(typeof(this.datas[entityCode]) == "number"){
        // data[entityCode].current = this.datas[entityCode][0];
        // }
        // }else{
        // let  currentRecord = ds.getCurrentRecord();
        // if(currentRecord){
        // data[entityCode].current = currentRecord.toMap();
        // }
        // data[entityCode].current = {};
        // }
        // }else{
        // data[entityCode] = [];
        // data[entityCode].current = {};
        // }
        let entityRecord = this._getEntityRecord(entityCode)
        data[entityCode] = entityRecord.datas
        data[entityCode]._metadata_ = {
          dsName: entityCode
        }
        data[entityCode].current = entityRecord.current
        data.recordMap[entityCode] = {}
        data.recordMapFn[entityCode] = {}
      }
    }
    return data
  }

  /**
   * 将指定事件状态修改为正在运行
   *
   * @param eventName
   *            事件名称
   */
  _markEventRunning(eventName: string) {
    if (typeof this.eventStatusPool[eventName] != 'undefined') {
      this.eventStatusPool[eventName] = EventStatus.Running
    }
  }

  /**
   * 将指定事件状态修改为已完成
   */
  _markEventComplete(eventName: string) {
    if (typeof this.eventStatusPool[eventName] != 'undefined') {
      this.eventStatusPool[eventName] = EventStatus.Complete
    }
  }

  /**
   * 判断指定事件是否可以执行，只要事件不处于正在运行状态则为可以执行
   */
  _couldRun(eventName: string) {
    if (
      typeof this.eventStatusPool[eventName] != 'undefined' &&
      this.eventStatusPool[eventName] != EventStatus.Running
    ) {
      return true
    }
    return false
  }

  /**
   * 获取实体数据
   *
   * @param {String}
   *            entityCode 实体编码
   */
  _getEntityRecord(entityCode: string) {
    const datas: Array<Record<string, any>> = [],
      current: Record<string, any> = {},
      mapData: Record<string, any> = {}
    let dataArray = {
      datas: datas, // 实体数据，已复制，非引用
      current: current, // 当前行数据，引用datas
      mapData: mapData // key：id，value：record，record是引用datas
    }
    let ds = datasourceManager.lookup({
      datasourceName: entityCode
    })
    if (ds) {
      let rs = ds.getAllRecords().toArray()
      if (rs.length > 0) {
        for (let i = 0, len = rs.length; i < len; i++) {
          let map = rs[i].toMap()
          dataArray.datas.push(map)
          dataArray.mapData[map.id] = map
        }
        /* 补全实体记录的额外信息 */
        this._handleRecordExtraInfo({
          records: dataArray.datas,
          dsName: entityCode
        })
        //@ts-ignore
        dataArray.current = dataArray.datas.current
      }
    }
    /* 有传入数据 */
    if (
      this.datas &&
      this.datas.hasOwnProperty(entityCode) &&
      this.datas[entityCode]
    ) {
      let rId = this.datas[entityCode].id
      /* 数据引用datas */
      dataArray.current = dataArray.mapData[rId]
    }
    if (!dataArray.current._metadata_) {
      dataArray.current._metadata_ = {}
    }
    dataArray.current._metadata_.dsName = entityCode
    return dataArray
  }

  _generateOtherField(records: Array<Record<string, any>>, dsName: string) {
    if (records.length > 0) {
      for (let i = 0, len = records.length; i < len; i++) {
        let record = records[i]
        let entitys = this.windowEntitys
        if (entitys && entitys[dsName]) {
          let fields = entitys[dsName]
          for (let j = 0, l = fields.length; j < l; j++) {
            let field = fields[j]
            if (
              !record.hasOwnProperty(field) &&
              field != 'id' &&
              field != '_metadata_'
            ) {
              record[field] = null
            }
          }
        }
      }
    }
  }

  _getCallFunc() {
    return this.moduleDefineFunc
  }

  _existFunc(name: string) {
    let funcs: Record<string, any> = this._getCallFunc()
    if (funcs && typeof funcs[name] == 'function') {
      return true
    }
    return false
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
    return new V3ComponentVue(params ? this._extend(params, this) : this)
  }

  /**
   * 构造Vue方法
   */
  _createVueMethod() {
    let scopeId = scopeManager.getCurrentScopeId()
    let windowScope = scopeManager.getWindowScope()
    let thisIntance = this
    let handleEvent =
      this.hanleEventFunc ||
      (function (sId, code) {
        return function (eventName: string) {
          /* 判断事件是否处于运行状态 */
          let args = Array.prototype.slice.call(arguments, 1)
          let isParallelism = false // 是否并行触发事件
          if (args && args.length > 0) {
            let list = args.pop()
            if (list && list.length > 0) {
              list = Array.prototype.slice.call(list, 0)
              let last = list.pop()
              if (
                typeof last == 'object' &&
                last != null &&
                last.v3platformArg
              ) {
                isParallelism = last.isParallelism
              }
              list.push(last)
            }
            args.push(list)
          }
          if (isParallelism) {
            scopeManager.openScope(sId)
            let handler = eventManager.fireEvent(
              code,
              eventName,
              arguments[2],
              arguments[3]
            )
            scopeManager.closeScope()
            handler.apply(this, args)
          } else if (thisIntance._couldRun(eventName)) {
            thisIntance._markEventRunning(eventName)
            try {
              let markComplete = function () {
                thisIntance._markEventComplete(eventName)
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
                markComplete,
                markComplete
              )
              scopeManager.closeScope()
              handler.apply(this, args)
            } catch (err) {
              thisIntance._markEventComplete(eventName)
            } // catch
          }
          /*
           * scopeManager.openScope(sId); let  handler =
           * eventManager.fireEvent(code, eventName, arguments[2],
           * arguments[3]); scopeManager.closeScope(); let  args =
           * Array.prototype.slice.call(arguments, 1)
           * handler.apply(this, args);
           */
        }
      })(scopeId, this.eventTargetCode || this.widgetCode)
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
      return function (func: string) {
        if (v3Vue._existFunc(func)) {
          let _func = v3Vue._getCallFunc()[func]
          return _func
        } else {
          throw Error('未找到方法[' + func + ']，请检查！')
        }
      }
    })(this)
    let _$synCurrentRecordToDs = (function (sId, dsManager) {
      return function (
        entityCode: string,
        current: Record<string, any>,
        oldCurrent: Record<string, any>
      ) {
        if (current && current._metadata_ && current._metadata_.dsName) {
          let _code = current._metadata_.dsName
          scopeManager.openScope(sId)
          let ds = dsManager.lookup({
            datasourceName: _code
          })
          if (ds) {
            ds.setCurrentRecord({
              record: ds.getRecordById(current.id)
            })
          }
          scopeManager.closeScope()
        }
      }
    })(scopeId, datasourceManager)
    let _$getCurrentRecord = function (entityCode: string) {
      let currentRecord = null
      if (entityCode) {
        let ds = this._$getDatasource(entityCode)
        if (ds) {
          currentRecord = ds.getCurrentRecord()
          if (currentRecord) {
            currentRecord = currentRecord.toMap()
          }
        }
      }
      return currentRecord
    }
    let _$getSelectedRecords = function (entityCode: string) {
      let selectRecords: Array<Record<string, any>> = []
      if (entityCode) {
        let ds = this._$getDatasource(entityCode)
        if (ds) {
          let tmpSelectRecords = ds.getSelectedRecords()
          tmpSelectRecords.iterate(function (record: Record<string, any>) {
            selectRecords.push(record.toMap())
          })
        }
      }
      return selectRecords
    }
    let _$isSelectedRecord = function (
      entityCode: string,
      record: Record<string, any>
    ) {
      let isSelect = false
      if (entityCode && record) {
        let ds = this._$getDatasource(entityCode)
        if (ds) {
          isSelect = ds.isSelectedRecord({
            record: ds.getRecordById(record.id)
          })
        }
      }
      return isSelect
    }
    let _$isCurrentRecord = function (
      entityCode: string,
      record: Record<string, any>
    ) {
      let isCurrent = false
      if (entityCode && record) {
        let ds = this._$getDatasource(entityCode)
        if (ds) {
          isCurrent = ds.isCurrentRecord({
            record: ds.getRecordById(record.id)
          })
        }
      }
      return isCurrent
    }
    let _$synCurrentIdToDs = (function (sId, dsManager) {
      return function (entityCode: string, id: string) {
        /* 新版的实体在记录里面，不能单传id */
        throw new Error('not find function: _$synCurrentIdToDs')
        // scopeManager.openScope(sId);
        // let  ds = dsManager.lookup({datasourceName:entityCode});
        // if(ds){
        // ds.setCurrentRecord({
        // record : ds.getRecordById(id)
        // });
        // }
        // scopeManager.closeScope();
      }
    })(scopeId, datasourceManager)
    let _$synSelectRecordToDs = scopeManager.createScopeHandler({
      scopeId: scopeId as string,
      handler: (function (dsManager) {
        return function (entityCode, data, isSel) {
          let dsName = entityCode
          let records = []
          if (data && typeof data == 'object') {
            let singleRecord = data.length > 0 ? data[0] : data
            if (
              !dsName &&
              singleRecord._metadata_ &&
              singleRecord._metadata_.dsName
            ) {
              dsName = singleRecord._metadata_.dsName
            }
            if (dsName) {
              let ds = dsManager.lookup({
                datasourceName: dsName
              })
              if (ds) {
                if (data.length > 0) {
                  for (let i = 0, len = data.length; i < len; i++) {
                    records.push(ds.getRecordById(data[i].id))
                  }
                } else {
                  records.push(ds.getRecordById(data.id))
                }
                ds.selectRecords({
                  isSelect: isSel,
                  records: records
                })
              }
            }
          }
        }
      })(datasourceManager)
    })
    let _$setDsMultiSelect = (function (sId, dsManager) {
      return function (entityCode: string) {
        if (entityCode !== '' && typeof entityCode == 'string') {
          scopeManager.openScope(sId)
          let ds = dsManager.lookup({
            datasourceName: entityCode
          })
          if (ds) {
            ds.markMultipleSelect()
            ds.setDefaultSelect({
              defaultSel: false
            })
          }
          scopeManager.closeScope()
        }
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
    /**
     * 获取数据源对象
     *
     * @param {String}
     *            entityCode 实体编码
     */
    let _$getDatasource = (function (sId, dsManager) {
      return scopeManager.createScopeHandler({
        scopeId: sId as string,
        handler: function (entityCode) {
          if (!entityCode) {
            return null
          }
          let ds = dsManager.lookup({
            datasourceName: entityCode
          })
          return ds
        }
      })
    })(scopeId, datasourceManager)
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
    let _nowV3Vue = this
    /**
     * 注册数据源事件
     *
     * @param {Function}
     *            func 数据源事件注册函数
     */
    let _$registerDsEvent = (function (_this) {
      return function (param: any) {
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
                    let customEntity = tmpVue[dsName]
                    if (customEntity && customEntity._metadata_) {
                      dsName = customEntity._metadata_.dsName
                    }
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
    })(_nowV3Vue)
    /**
     * 注册onDataLoad事件
     */
    let _$registerDataLoadedEvent = function () {
      windowInit.registerHandler({
        eventName: windowInit.Events.OnDataInitLoad,
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
    return {
      handleEvent: handleEvent,
      refFn: _refFn,
      _getComponentCode: (function (componentCode) {
        return function () {
          return componentCode
        }
      })(windowScope.getComponentCode()),
      _$getEntityFieldType: _$getEntityFieldType,
      _$getDatasource: _$getDatasource,
      _$getCurrentRecord: _$getCurrentRecord,
      _$getSelectedRecords: _$getSelectedRecords,
      _$isSelectedRecord: _$isSelectedRecord,
      _$isCurrentRecord: _$isCurrentRecord,
      _$registerDsEvent: _$registerDsEvent,
      _$registerDataLoadedEvent: _$registerDataLoadedEvent,
      _$registerVuiTagEvent: _$registerVuiTagEvent,
      _$fireVuiTagEvent: _$fireVuiTagEvent,
      _$synCurrentRecordToDs: _$synCurrentRecordToDs,
      _$synCurrentIdToDs: _$synCurrentIdToDs,
      _$synSelectRecordToDs: _$synSelectRecordToDs,
      _$setDsMultiSelect: _$setDsMultiSelect,
      _$getScopeId: _$getScopeId,
      _$getMultipleSelectList: _$getMultipleSelectList,
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
            setDsMultiSelect: function (entityCode: string) {
              let func = _this._$setDsMultiSelect
              if (func) {
                func.apply(_this, [entityCode])
              }
            },
            getCurrentRecord: function (entityCode: string) {
              let func = _this._$getCurrentRecord
              if (func) {
                return func.apply(_this, [entityCode])
              }
            },
            getSelectedRecords: function (entityCode: string) {
              let func = _this._$getSelectedRecords
              if (func) {
                return func.apply(_this, [entityCode])
              }
            },
            isSelectedRecord: function (
              entityCode: string,
              data: Record<string, any>
            ) {
              let func = _this._$isSelectedRecord
              if (func) {
                return func.apply(_this, [entityCode, data])
              }
            },
            isCurrentRecord: function (
              entityCode: string,
              data: Record<string, any>
            ) {
              let func = _this._$isCurrentRecord
              if (func) {
                return func.apply(_this, [entityCode, data])
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
              datas: Array<Record<string, any>>,
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

  getExtraFields(data: Record<string, any>, dsName: string) {
    // 获取数据缺少的字段列表，解决获取规则只获取部分字段的数据时，在自定义div里面使用无法同步数据的问题
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

  /**
   * 构造Vue观察者
   */
  _createVueWatcher() {
    let windowScope = scopeManager.getWindowScope(),
      watchers: Record<string, any> = {}
    let getWatcher = function (entityCode: string, v3Vue) {
      return {
        // deep:true,
        sync: true,
        handler: (function (code, sId, sManager, dsManager, _vue) {
          return function (val: any, oVal: any) {
            if (_vue && !_vue.duringDS2Vue[code]) {
              // 当前同步数据到实体动作不是由实体数据同步到Vue引发
              scopeManager.openScope(sId)
              let ds = dsManager.lookup({
                datasourceName: code
              })
              if (!ds) return // 如果数据源不存在，则不进行数据同步
              /* 实体全部记录 */
              let allRecords = ds.getAllRecords().toArray()
              let allIds = []
              for (let i = 0, len = allRecords.length; i < len; i++) {
                allIds.push(allRecords[i].getSysId())
              }
              let insertRecord = []
              let removeRecord = []
              if (typeof val.length != 'number') {
                val = [val]
              }
              let newIds = []
              for (let i = 0, l = val.length; i < l; i++) {
                let record = val[i]
                if (allIds.indexOf(record.id) == -1) {
                  let rd = ds.createRecord()
                  if (record._metadata_) {
                    record._metadata_.dsName = code
                  } else {
                    record._metadata_ = {
                      dsName: code,
                      isCurrent: false,
                      isSelected: false
                    }
                  }
                  rd.setDatas(record)
                  insertRecord.push(rd)
                }
                newIds.push(record.id)
              }
              for (let i = 0, len = allIds.length; i < len; i++) {
                if (newIds.indexOf(allIds[i]) == -1) {
                  removeRecord.push(allIds[i])
                }
              }
              if (insertRecord.length > 0)
                ds.insertRecords({
                  records: insertRecord
                })
              if (removeRecord.length > 0)
                ds.removeRecordByIds({
                  ids: removeRecord
                })
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
    let entities = this.entities
    for (let i = 0, l = entities.length; i < l; i++) {
      let entityCode = entities[i]
      watchers[entityCode] = getWatcher(entityCode, this)
    }
    return watchers
  }

  /**
   * 获取标签名称
   */
  _getVuiTagName() {
    let name =
      'v3-business-window-' +
      this.componentCode +
      '-' +
      this.windowCode +
      '-' +
      this.widgetCode
    return name
  }

  /**
   * 实体记录增加watch方法
   *
   * @param {Object}
   *            params { 'records':[],//实体记录 'dsName':'实体编码',
   *            'vue':Vue//vue实例, 'doubleId' :
   *            false//默认false，用于区分动态列表组绑定的记录 }
   */
  _addRecordWatch(params: Record<string, any>) {
    let records = params.records,
      vue = params.vue,
      doubleId = params.doubleId === true ? true : false,
      dsName = params.dsName
    if (records && records.length > 0) {
      /* 生成记录其他字段的数据 */
      this._generateOtherField(records, dsName)
      for (let i = 0, len = records.length; i < len; i++) {
        let record = records[i]
        let nowId = record.id
        if (doubleId) {
          nowId = nowId + '_' + nowId
        }
        /* 如果记录已经检测过的话，就跳过 */
        if (vue.recordMap[dsName][nowId]) continue
        vue.recordMap[dsName][nowId] = record
        /* 监测实体的每一行记录变化 */
        let scopeId = scopeManager.getCurrentScopeId()

        //无法监听带特殊字符的表达式
        //let  fn = vue.$watch("recordMap." + dsName + "." + nowId + "", (function (dsManager, sId, nId, _vue) {
        let fn = vue.$watch(
          (function (rd) {
            return function () {
              return rd
            }
          })(record),
          (function (dsManager, sId, nId, _vue) {
            return function (newVal: any, oldVal: any) {
              // 当前行改变
              if (newVal && newVal._metadata_ && newVal._metadata_.dsName) {
                let _metadata_ = newVal._metadata_
                let dsName = _metadata_.dsName
                /* 如果是由数据源同步ui引发的可不用处理 */
                if (_vue.duringDS2Vue[dsName]) {
                  return
                }
                scopeManager.openScope(scopeId)
                let datasource = dsManager.lookup({
                  datasourceName: dsName
                })
                if (datasource) {
                  let record = datasource.getRecordById(newVal.id)
                  if (record) {
                    record.setDatas(newVal)
                    if (record.isChanged()) {
                      datasource.updateRecords({
                        records: [record]
                      })
                    }
                    if (true === _metadata_.isCurrent) {
                      datasource.setCurrentRecord({
                        record: record
                      })
                    }
                  }
                }
                scopeManager.closeScope()
              }
            }
          })(datasourceManager, scopeId, nowId, this),
          {
            deep: true,
            sync: true
          }
        )
        /* 保存每一条记录watch返回的函数，用于记录删除后，销毁watch */
        vue.recordMapFn[dsName][nowId] = fn
      }
    }
  }

  _extendDiff(aim: Record<string, any>, source: Record<string, any>) {
    for (let f in source) {
      if (source.hasOwnProperty(f) && source[f] !== aim[f]) {
        aim[f] = source[f]
      }
    }
  }

  /**
   * 清除记录的watch状态，在记录被删除时执行
   *
   * @param {Object}
   *            params { 'records' :
   *            [],//实体记录，传入记录长度为0，则清空全部，如果有长度，就按照传入数据清除，不传则不处理 'dsName' :
   *            '实体编码' }
   */
  _clearRecordWatch(params: Record<string, any>) {
    let records = params.records,
      vue = params.vue,
      dsName = params.dsName
    if (records) {
      if (records.length == 0) {
        for (let id in vue.recordMap[dsName]) {
          try {
            delete vue.recordMap[dsName][id]
            let fn = vue.recordMapFn[dsName][id]
            if (typeof fn == 'function') {
              fn()
            }
            delete vue.recordMapFn[dsName][id]
          } catch (e) {}
        }
      } else if (records.length > 0) {
        for (let i = 0, len = records.length; i < len; i++) {
          let record = records[i]
          let id
          if (typeof record == 'string') {
            id = record
          } else if (typeof record == 'object') {
            id = record.getSysId()
          }
          try {
            delete vue.recordMap[dsName][id]
            let fn = vue.recordMapFn[dsName][id]
            if (typeof fn == 'function') {
              fn()
            }
            delete vue.recordMapFn[dsName][id]
          } catch (e) {}
        }
      }
    }
  }

  _copyResultSetData(datasourceRecord: Array<Record<string, any>>) {
    let records: Array<Record<string, any>> = []
    if (datasourceRecord && datasourceRecord.length > 0) {
      for (let i = 0, len = datasourceRecord.length; i < len; i++) {
        let record = datasourceRecord[i]
      }
    }
    return records
  }

  /* 判断是否修改当前行 */
  isChangeCurrent(ds: Record<string, any>) {
    /* 不在动态列表组内 或者 在动态列表组内但实体非动态列表组绑定的实体 */
    if (
      !this.isDuringThrendList ||
      (this.duringThrendListInfo &&
        this.duringThrendListInfo.duringThrendListEntity != ds)
    ) {
      return true
    }
    return false
  }

  /**
   * 数据源同步
   */
  _synchroDatabase(vm) {
    let entities = this.entities
    let extend = this._extendDiff
    for (let i = 0, l = entities.length; i < l; i++) {
      let entityCode = entities[i]
      let observer = new DatasourceObserver(entityCode, this.widgetCode, {
        vm: vm,
        v3vm: this
      })
      observer.setAsync(false)
      observer.setLoadHandler(function (args: Record<string, any>) {
        let resultSet = args.resultSet
        let isAppend = args.isAppend
        let ds = this.datasourceName,
          vm = this.pros.vm,
          v3vm = this.pros.v3vm
        /* 标识当前操作是数据源到vue */
        v3vm.duringDS2Vue[ds] = true
        /* 保存当前记录 */
        let current = vm[ds].current
        /* 保存动态列表组每一列的记录的id */
        let druingDataId = null
        /* 复制实体记录，避免产生引用的问题 */
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
        let params = {
          records: records,
          dsName: ds,
          vue: vm
        }
        /* 数据增加额外的标识信息: _metedata_ */
        v3vm._handleRecordExtraInfo(params)
        /* 更新current */
        if (v3vm.isChangeCurrent(ds)) {
          //@ts-ignore
          current = records.current
        }
        /* 删除全部记录watch状态 */
        v3vm._clearRecordWatch({
          records: [],
          dsName: ds,
          vue: vm
        })

        /* 保存动态列表组每一列的记录的id */
        druingDataId = null
        if (!isAppend) {
          vm[ds] = []
        }
        let datas = vm[ds]
        vm[ds].push.apply(vm[ds], records)
        /* 保存当前行 */
        vm[ds].current = current
        vm[ds]._metadata_ = {
          dsName: ds
        }
        /* 添加watch */
        v3vm._addRecordWatch(params)
        setTimeout(function () {
          if (typeof v3vm.resetHeaderOrFootHeight == 'function') {
            v3vm.resetHeaderOrFootHeight()
          }
        }, 50)
        v3vm.duringDS2Vue[ds] = false
      })
      observer.setInsertHandler(function (args: Record<string, any>) {
        let resultSet = args.resultSet
        let ds = this.datasourceName
        let vm = this.pros.vm,
          v3vm = this.pros.v3vm
        let entityFields =
          v3vm.windowEntitys && v3vm.windowEntitys[ds]
            ? v3vm.windowEntitys[ds]
            : []
        let current = vm[ds].current
        let datas = vm[ds]
        /* 保存当前数据的全部id，因为watch已经有插入数据的逻辑 */
        let existIds = (function () {
          let eIds = []
          if (datas && datas.length > 0) {
            for (let i = 0, len = datas.length; i < len; i++) {
              let rId = datas[i].id
              if (eIds.indexOf(rId) == -1) {
                eIds.push(rId)
              }
            }
          }
          return eIds
        })()
        let records: Array<Record<string, any>> = []
        v3vm.duringDS2Vue[ds] = true
        resultSet.iterate(function (rd: Record<string, any>) {
          if (existIds.indexOf(rd.getSysId()) == -1) {
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
          }
        })
        /* 实体记录增加额外的标识信息 */
        let params = {
          records: datas,
          dsName: ds,
          vue: vm
        }
        /* 自定义标签中push，走进实体的watch再过来的 */
        v3vm._handleRecordExtraInfo(params)
        if (records.length > 0) {
          params.records = records
          v3vm._handleRecordExtraInfo(params)
          datas.push.apply(datas, records)
          //@ts-ignore
          if (records.current && typeof records.current != '{}') {
            /* 新增记录有当前行 */
            //@ts-ignore
            datas.current = records.current
          }
        }
        //不能复制，不然二次开发直接用数据源push时不能正常插入数据~
        //					let  tmpData = [];
        //					if (datas && datas.length > 0) {
        //						for (let  i = 0, l = datas.length; i < l; i++) {
        //							let  data = datas[i];
        //							tmpData.push(data);
        //						}
        //					}
        if (v3vm.isChangeCurrent(ds)) {
          current = datas.current
        }
        //					vm[ds] = tmpData;
        /* 保存当前行 */
        vm[ds].current = current
        if (v3vm.isDuringThrendList && vm[ds] && vm[ds].current) {
          v3vm._addRecordWatch({
            records: [vm[ds].current],
            dsName: ds,
            vue: vm
          })
        }
        params.records = vm[ds]
        /* 添加watch */
        v3vm._addRecordWatch(params)
        v3vm.duringDS2Vue[ds] = false
      })
      observer.setUpdateHandler(function (args: Record<string, any>) {
        let resultSet = args.resultSet
        let ds = this.datasourceName
        let vm = this.pros.vm,
          v3vm = this.pros.v3vm
        let datas = vm[ds]
        v3vm.duringDS2Vue[ds] = true
        resultSet.iterate(function (rd: Record<string, any>) {
          for (let i = 0, l = datas.length; i < l; i++) {
            let d = datas[i]
            if (d.id == rd.getSysId()) {
              extend(d, rd.toMap())
              if (d._metadata_) {
                /* 标志是数据源更新，取到的标志时，需要清空标志信息 */
                d._metadata_.updateMode = 'ds_update'
              }
              // objectUtil.extend(d,rd.toMap());
              break
            }
          }
        })
        v3vm.duringDS2Vue[ds] = false
      })
      observer.setRemoveHandler(function (args: Record<string, any>) {
        let resultSet = args.resultSet
        let ds = this.datasourceName
        let vm = this.pros.vm,
          v3vm = this.pros.v3vm
        let datas = vm[ds]
        v3vm.duringDS2Vue[ds] = true

        let current = vm[ds].current
        let tmpDatas = datas
        let deleteIds: Array<string> = []
        resultSet.iterate(function (rd: Record<string, any>) {
          deleteIds.push(rd.getSysId())
        })
        /* 删除全部记录watch状态 */
        v3vm._clearRecordWatch({
          records: deleteIds,
          dsName: ds,
          vue: vm
        })
        if (datas.length > 0) {
          for (let i = datas.length - 1; i >= 0; i--) {
            let d = datas[i]
            if (deleteIds.indexOf(d.id) != -1) {
              datas.splice(i, 1)
            }
          }
        }
        //					for (let  i = 0, l = datas.length; i < l; i++) {
        //						let  d = datas[i];
        //						if (deleteIds.indexOf(d.id) == -1) {
        //							tmpDatas.push(d);
        //						}
        //					}
        /* 实体记录增加额外的标识信息 */
        v3vm._handleRecordExtraInfo({
          records: datas,
          dsName: ds,
          vue: vm
        })
        vm[ds] = datas
        /* 非动态列表组内，保存当前行 */
        /* 更新current */
        if (v3vm.isChangeCurrent(ds)) {
          current = datas.current
        }
        vm[ds].current = current
        v3vm.duringDS2Vue[ds] = false
      })
      observer.setCurrentRecordHandler(function (args: Record<string, any>) {
        let ds = this.datasourceName
        let vm = this.pros.vm,
          v3vm = this.pros.v3vm
        let datas = vm[ds]
        let currentRecord = args.currentRecord
        let preRecord = args.preCurrentRecord
        v3vm.duringDS2Vue[ds] = true
        let current = vm[ds].current
        vm._$v3platform().datasource.synCurrentRecordToUi(ds, currentRecord)
        let process = 0
        for (let i = 0, l = datas.length; i < l; i++) {
          let d = datas[i]
          if (preRecord && d.id == preRecord.__recordData__.id) {
            d._metadata_.isCurrent = false
            process++
          }
          if (d.id == currentRecord.__recordData__.id) {
            d._metadata_.isCurrent = true
            /* 更新current */
            if (v3vm.isChangeCurrent(ds)) {
              vm[ds].current = d
            }
            process++
          }
          // 处理完旧的记录和新的记录后跳出循环,以提高处理速度
          if (2 === process) {
            break
          }
        }
        v3vm.duringDS2Vue[ds] = false
      })
      observer.setSelectRecordHandler(function (args: Record<string, any>) {
        let ds = this.datasourceName
        let vm = this.pros.vm,
          v3vm = this.pros.v3vm
        let datas = vm[ds]
        let resultSet = args.resultSet
        let isSelect = args.isSelect
        v3vm.duringDS2Vue[ds] = true
        vm._$v3platform().datasource.synSelectRecordToUi(
          ds,
          resultSet.toArray(),
          isSelect
        )
        resultSet.iterate(function (rd: Record<string, any>) {
          for (let i = 0, l = datas.length; i < l; i++) {
            let d = datas[i]
            if (d.id == rd.__recordData__.id) {
              d._metadata_.isSelected = isSelect
              break
            }
          }
        })
        v3vm.duringDS2Vue[ds] = false
      })
      let oId = observerManager.addObserver({
        observer: observer
      })
      this.observerIds.push(oId)
    }
  }

  getHtml() {
    return ''
  }

  /**
   * 处理实体记录中添加额外的标识信息以及watch
   *
   * @param {Object}
   *            records 实体记录
   * @param {String}
   *            dsName 实体编码
   */
  _handleRecordExtraInfo(params: Record<string, any>) {
    let records = params.records,
      dsName = params.dsName
    let currentRecord = {}
    if (!records) records = []
    if (records.length > 0) {
      /* 获取界面实体对象 */
      let ds_obj = datasourceManager.lookup({
        datasourceName: dsName
      })
      /* 界面实体选中记录的id列表 */
      let selectRecordIds = (function () {
        let selectRecords = ds_obj.getSelectedRecords().toArray()
        let ids = []
        if (selectRecords && selectRecords.length > 0) {
          for (let i = 0, l = selectRecords.length; i < l; i++) {
            let id = selectRecords[i].getSysId()
            if (ids.indexOf(id) == -1) {
              ids.push(id)
            }
          }
        }
        return ids
      })()
      let currentRecord = ds_obj.getCurrentRecord()
      /* 界面实体当前记录id */
      let currentRecordId = null
      if (currentRecord) {
        currentRecordId = currentRecord.getSysId()
        currentRecord = currentRecord.toMap()
      }
      /* 处理选中记录和当前行记录 */
      for (let i = 0, l = records.length; i < l; i++) {
        let record = records[i]
        let nowId = record.id
        let params = {}
        record._metadata_ = {
          dsName: dsName,
          isSelected: selectRecordIds.indexOf(nowId) != -1 ? true : false,
          isCurrent: currentRecordId === nowId ? true : false
        }
        if (currentRecordId === nowId) {
          currentRecord = record
        }
      }
    }
    /* 设置当前记录 */
    records.current = currentRecord
    return records
  }

  /**
   * 校验标签是否注册
   *
   * @param {String}
   *            name 标签名称
   */
  _checkVuiTag(name: string) {
    if (!Vue.options.components[name]) {
      frontEndAlerter.error({
        title: 'vui错误',
        msgHeader: 'vui标签未注册',
        msg: '未注册的vui标签编码：' + name,
        detail: '暂无详情'
      })
      return false
    }
    return true
  }

  /**
   * 校验实体是否存在
   */
  _checkVuiEntity(vuiTagName: string) {
    let entities = this.entities
    /* vui组件对象 */
    let vuiComponent = Vue.options.components[vuiTagName]
    /* vui组价属性 */
    let vuiPros = vuiComponent.options.props
    /* 不存在的实体编码 */
    let missEntityCodes = []
    if (vuiPros) {
      let missPropertys = [
        'v3platform_$Data',
        'm_viewport_top_fit',
        'm_viewport_left_fit',
        'm_viewport_bottom_fit',
        'm_viewport_right_fit'
      ]
      for (let name in vuiPros) {
        if (vuiPros.hasOwnProperty(name) && missPropertys.indexOf(name) == -1) {
          if (entities.indexOf(name) == -1) {
            missEntityCodes.push(name)
          }
        }
      }
    }
    /* 如果组件中使用的实体不属于界面实体，则抛错 */
    if (missEntityCodes.length > 0) {
      frontEndAlerter.error({
        title: 'vui错误',
        msgHeader: 'vui实体不存在',
        msg: '不存在的vui实体编码：' + missEntityCodes.join(','),
        detail: '暂无详情'
      })
      return false
    }
    return true
  }

  getTemplate(name: string) {
    let html = ['<', name]
    for (let i = 0, l = this.entities.length; i < l; i++) {
      let entityCode = this.entities[i]
      html.push(' :')
      html.push(entityCode)
      html.push('="')
      html.push(entityCode)
      html.push('"')
    }
    // 添加属性值绑定，兼容老的构件
    let appendAtrrData = false
    try {
      if (Vue.options.components[name].options.props) {
        appendAtrrData =
          !!Vue.options.components[name].options.props['v3platform_$Data']
      }
    } catch (e) {}
    if (appendAtrrData) {
      html.push(' :v3platform_$Data="v3platform_$Data"')
      //视窗数据
      let viewPortData = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
      let windowScope = scopeManager.getWindowScope()
      if (windowScope && windowScope.isSimpleDivWindow()) {
        viewPortData = mobileViewPortAdapter.getViewPortSize()
      }
      let addAttr = function (html: Array<any>, name: string, val: any) {
        let prefix = ':'
        try {
          let num = Number(val)
          prefix = isNaN(Number(val)) ? '' : ':'
        } catch (e) {
          prefix = ''
        }
        html.push(' ' + prefix + name + '="' + val + '"')
      }
      addAttr(html, 'm_viewport_top_fit', viewPortData.top)
      addAttr(html, 'm_viewport_left_fit', viewPortData.left)
      addAttr(html, 'm_viewport_bottom_fit', viewPortData.bottom)
      addAttr(html, 'm_viewport_right_fit', viewPortData.right)
    }
    for (let i = 0, l = this.events.length; i < l; i++) {
      let event = this.events[i]
      html.push(' @')
      html.push(event)
      html.push('="handleEvent(\'')
      html.push(event)
      html.push('\',arguments)"')
    }
    html.push('></')
    html.push(name)
    html.push('>')
    return html.join('')
  }

  /* 改变current的引用对象 */
  changeCurrentQuote(_data: Record<string, any>) {
    let data = _data
    if (data) {
      for (let code in data) {
        if (data.hasOwnProperty(code)) {
          let entityData = data[code]
          if (
            entityData.length != 0 &&
            entityData.current &&
            entityData.current.id
          ) {
            let id = entityData.current.id
            for (let i = 0, len = entityData.length; i < len; i++) {
              let _d = entityData[i]
              if (id === _d.id) {
                entityData.current = entityData[i]
                break
              }
            }
          }
        }
      }
    }
    return data
  }

  /* 销毁观察者，目前移动端的动态列表组使用 */
  destroyObserver() {
    if (this.observerIds.length > 0)
      observerManager.destroy({
        ids: this.observerIds
      })
  }

  /**
   * 渲染V3ComponentVue
   */
  render() {
    /* 获取标签名称 */
    let name = this._getVuiTagName()
    /* 校验标签是否注册 */
    if (!this._checkVuiTag(name)) {
      return false
    }
    /* 校验标签实体 */
    if (!this._checkVuiEntity(name)) {
      return false
    }
    /* 挂载页面 */
    let el =
      typeof this.element == 'string' ? $('#' + this.element) : $(this.element)
    if (this.autoMoutStyle) {
      el.attr(v3VueUtil.getCssAttrName(), this.cssSymbol)
    }
    let element = null
    //处理网页窗体内容不显示
    if (this.series == 'bootstrap_mobile') {
      let tDiv = $(document.createElement('div'))
        .addClass('framework7-root ios auto-height-style')
        .append(document.createElement('div'))[0]
      element = el.append(tDiv).children().children()[0]
    } else {
      element = el.append($(document.createElement('div'))[0]).children()[0]
    }
    //			let  tDiv = $(document.createElement("div")).addClass("framework7-root ios auto-height-style").append(document.createElement("div"))[0];
    //			let  element = el.append(tDiv).children().children()[0];
    let _this = this
    let _data: Record<string, any> = this._createVueData()
    let params = {
      el: element,
      framework7: {
        modal: {
          moveToRoot: false
        }
      },
      template: this.getTemplate(name),
      data: _data,
      methods: this._createVueMethod(),
      watch: this._createVueWatcher(),
      mounted: function () {
        /* 动态列表组内，注册开始数据的监听事件 */
        if (_this.isDuringThrendList) {
          for (let key in _data) {
            if (
              _data.hasOwnProperty(key) &&
              typeof _data[key] == 'object' &&
              _data[key].length > 0
            ) {
              _this._addRecordWatch({
                records: _data[key],
                vue: this,
                dsName: key
              })
            }
          }
        }
      }
    }
    /* r如果是动态列表组内，修改current指向的对象 */
    if (this.isDuringThrendList) {
      params.data = this.changeCurrentQuote(params.data)
    }
    // 获取语言包信息,创建vui18n实例
    let locale = 'zhCN'
    let langPack: Record<string, any> = {}
    langPack[locale] = {
      message: i18n_window.getWidgetInfo({
        componentCode: this.componentCode,
        windowCode: this.windowCode,
        widgetCode: this.widgetCode,
        defaultVal: this.i18nPro
      })
    }
    new Vui18n.default({
      locale: locale,
      messages: langPack
    })
    /* 创建Vue */
    let vm = new Vue(params)
    this.vueInstance = vm
    /* 同步数据源 */
    this._synchroDatabase(vm)
    let windowScope = scopeManager.getWindowScope()
    if (windowScope) {
      windowScope.on(
        scopeManager.EVENTS.DESTROY,
        (function (inst) {
          return function () {
            if (inst) {
              try {
                inst.$destroy()
              } catch (e) {}
            }
          }
        })(vm)
      )
    }
  }
}

export default V3ComponentVue
