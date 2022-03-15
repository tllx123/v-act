import { WindowMappingManager as windowMappingManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.mapping'
import {
  ExpressionContext,
  ExpressionEngine as formulaEngine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { CurrentRecordObserver } from '@v-act/vjs.framework.extension.platform.interface.observer'
import { Operation } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DropDownSourceUtil as dropDownSourceUtil } from '@v-act/vjs.framework.extension.platform.services.domain.dropdown'
import { WindowInit as windowInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { DatasourceManager as dsManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceObserverManager as observerManager } from '@v-act/vjs.framework.extension.platform.services.observer.manager'
import { RemoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'
import { DatasourceUtil as dataSourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import {
  QueryCondUtil as queryConditionUtil,
  WhereRestrict as whereRestrict
} from '@v-act/vjs.framework.extension.platform.services.where.restrict'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'

/**
 * @namespace DropdownSourceObserver
 * @catalog
 * @class DropdownSourceObserver
 * @desc 数据来源<br/>
 *
 * vjs名称：vjs.framework.extension.ui.common.plugin.services.widget<br/>
 * vjs服务名称：vjs.framework.extension.ui.common.plugin.services.widget.DropdownSourceObserver<br/>
 */
class DropdownSourceObserver{
  scopeId
  widgetId
  dropDownSource
  textField
  valueField
  handler 
  count
  descInfoSeparator
  saveColumn:any
  showColumn:any
  defaultValue = []
 

  constructor(params:any){
  this.scopeId = params.scopeId
  this.widgetId = params.widgetId
  this.dropDownSource = params.dataSource
  this.textField = params.textField
  this.valueField = params.valueField
  this.handler = params.handler
  this.count = 0
  //@ts-ignore
  this.descInfoSeparator = window.v3PlatformSCSkin.dictBoxSeparator
  if (this.scopeId) {
    scopeManager.openScope(this.scopeId)
    this.getDropdownSourceData()
    scopeManager.closeScope()
  } else {
    this.getDropdownSourceData()
  }
  }

  genwhereRestrict (dataSourceSetting:any) {
    var config = dataSourceSetting['DataConfig']
    var Condition = config['Condition']
    var wr = whereRestrict.init()
    if (Condition) {
      if (Condition.NewDataSet && Condition.NewDataSet.dsWhere) {
        if (
          typeof Condition.NewDataSet.dsWhere['length'] != 'undefined' &&
          Condition.NewDataSet.dsWhere.length > 0
        ) {
          Condition = Condition.NewDataSet.dsWhere
        } else {
          Condition =
            Condition.NewDataSet.dsWhere.length === 0
              ? []
              : [Condition.NewDataSet.dsWhere]
        }
      }
    }
    var QueryParam = config['QueryParam']
    if (QueryParam) {
      if (QueryParam.NewDataSet) {
        if (
          typeof QueryParam.NewDataSet.dtquery['length'] != 'undefined' &&
          QueryParam.NewDataSet.dtquery.length > 0
        ) {
          QueryParam = QueryParam.NewDataSet.dtquery
          if (arrayUtil.isArray(QueryParam)) {
            QueryParam = {
              paramDefines: QueryParam,
              routeContext: null
            }
          }
          var params = queryConditionUtil.genCustomParams(QueryParam)
          wr.addExtraParameters(params)
        }
      }
    }
    var SourceType = config['SourceType']
    if (undefined != Condition && null != Condition && Condition.length > 0) {
      wr.andExtraCondition(
        Condition,
        SourceType == 'Table' ? 'table' : 'custom'
      )
    }

    //Table方式时，增加排序条件
    if (SourceType == 'Table') {
      var SourceName = config['SourceName']

      // 2015-07-15 兼容处理[构件名].[表名]的情况，只取[表名]
      if (SourceName.indexOf('.') != -1) {
        var sourceNameItems = SourceName.split('.')
        SourceName = sourceNameItems[sourceNameItems.length - 1]
      }
      var sortType = config['SortType']
      var sortField = config['SortField']
      var sortColumn = SourceName + '.' + sortField

      if (sortField && sortType == 'Asc') {
        wr.addOrderBy(sortColumn)
      } else if (sortField && sortType == 'Desc') {
        wr.addOrderByDesc(sortColumn)
      }
    }

    return wr
  }
 
  genTableQueryConfig(dataSourceSetting:any, whereRestrict:any) {
    var config = dataSourceSetting['DataConfig']
    var SourceID = config['SourceID']
    var SourceName = config['SourceName']
    var SourceType = config['SourceType']
    var SaveColumn = config['SaveColumn']
    var ShowColumn = config['ShowColumn']
    var queryFileds = []
    queryFileds.push(SaveColumn)
    queryFileds.push(ShowColumn)
    if (SourceType == 'Table') {
      var requestCfg = {
        queryType: 'TABLE',
        queryDS: SourceName,
        whereRestrict: whereRestrict,
        recordStart: -1,
        pageSize: -1,
        queryFiledArray: queryFileds
      }
      return requestCfg
    } else if (SourceType == 'Query') {
      let requestCfg:{[code:string]:any} = {
        queryType: 'QUERY',
        queryDS: SourceName,
        whereRestrict: whereRestrict,
        recordStart: -1,
        pageSize: -1
      }
      return requestCfg
    }
  }
  genTableQueryData (
    result:any,
    dataSourceSetting:any,
    valueField:any,
    textField:any,
    widgetId:any,
    descField:any,
    isRealTable:any
  ) {
    var datas = []
    var config = dataSourceSetting['DataConfig']
    var defaultSaveColumn = config['DefaultSaveColumn']
    var DefaultShowColumn = config['DefaultShowColumn']
    var MapTable = config['MapTable']
    var saveColumn = config['SaveColumn']
    var showColumn = config['ShowColumn']
    var SourceName = config['SourceName']
    var SourceType = config['SourceType']
    if (isRealTable) {
      if (result && result.data && result.data.resultDatas) {
        // 开发平台配置的字段信息，可能与实际的表字段存在大小写区别，所以这里使用实际的表字段做对比，适配大小写问题
        result = result.data.resultDatas
      } else {
        log.warn('控件的来源表/查询 没有查到任何数据，请进行验证')
        return false
      }
    }
    datas = this.getTableQueryData(
      result,
      valueField,
      textField,
      saveColumn,
      showColumn,
      config,
      descField
    )
    return datas
  }
  getTableQueryData (
    result:any,
    valueField:any,
    textField:any,
    saveColumn:any,
    showColumn:any,
    config:any,
    descField:any
  ) {
    var datas = []
    var firstRecord = result[0].datas.values[0]
    for (var field in firstRecord) {
      if (saveColumn.toLowerCase() === field.toLowerCase()) {
        saveColumn = field
      }

      if (showColumn.toLowerCase() === field.toLowerCase()) {
        showColumn = field
      }
    }

    var sqlQueryConstData = config['SqlQueryConstData']
    if (sqlQueryConstData != null) {
      var constData = sqlQueryConstData['ConstData']
      if (constData != null && constData.length != undefined) {
        //自定义常量
        for (var i = 0; i < constData.length; i++) {
          var resultData = constData[i]
          var data = {}

          data[valueField] = resultData['id'] != null ? resultData['id'] : ''
          data['id'] = resultData['id'] != null ? resultData['id'] : ''
          if (resultData['text'] != null) {
            data[textField] = resultData['text']
            data['text'] = resultData['text']
          } else {
            data[textField] = ''
            data['text'] = ''
          }

          if (resultData['selected'] == 'True') {
            data['default'] = true
            data['selected'] = true
          } else {
            data['default'] = false
            data['selected'] = false
          }

          // UI不赋默认值，有db赋值
          datas.push(data)
        }
      }
    }

    // 循环记录，构建其初始化数据格式
    for (var i = 0; i < result[0].datas.values.length; i++) {
      var resultData = result[0].datas.values[i]
      let data:{[code:string]:any} = {}

      data[valueField] = resultData[saveColumn]
      if (resultData[showColumn] != null) {
        if (descField) {
          data.descInfo = ''
          for (var j = 0; j < descField.length; j++) {
            if (resultData[descField[j]]) {
              if (data.descInfo && data.descInfo != '') {
                data.descInfo += this.descInfoSeparator
              }
              data.descInfo += resultData[descField[j]]
            }
          }
          data[textField] = resultData[showColumn] + ',' + data.descInfo
        } else {
          data[textField] = resultData[showColumn]
        }
      } else {
        data[textField] = ''
      }
      // UI不赋默认值，有db赋值

      datas.push(data)
    }
    return datas
  }
  genTableQuery (
    dataSourceSetting:any,
    whereRestrict:any,
    valueField:any,
    textField:any,
    widgetId:any,
    descField:any
  ) {
    var requestCfg = this.genTableQueryConfig(dataSourceSetting, whereRestrict)
    var results = dropDownSourceUtil.getDataSourceFindDatas([requestCfg])
    return this.genTableQueryData(
      results[0],
      dataSourceSetting,
      valueField,
      textField,
      widgetId,
      descField,
      true
    )
  }
  _doReturnResult (widgetId:any, dropDownSource:any, resultMap:any, descField:any) {
    //处理请求结果
    if (dropDownSource != undefined) {
      var dataSourceSetting = dropDownSource['DataSourceSetting']
      var dataSourceType = dataSourceSetting['DataSourceType']
      this.saveColumn = dataSourceSetting.DataConfig.SaveColumn
      this.showColumn = dataSourceSetting.DataConfig.ShowColumn
      var valueField = this.saveColumn
      var textField = this.showColumn

      //当没有配置表的保存值时候默认valueField
      if (!valueField || valueField == '') {
        valueField = 'valueField'
        this.saveColumn = 'valueField'
      }
      //当没有配置表的显示值时候默认textField
      if (!textField || textField == '') {
        textField = 'textField'
        this.showColumn = 'textField'
      }
      var datas
      if (dataSourceType == 'CustomConst') {
        datas = dropDownSourceUtil.genCustomConst(
          dataSourceSetting,
          valueField,
          textField
        )
      } else if (dataSourceType == 'SQL') {
        datas = dropDownSourceUtil.genSQLData(
          resultMap,
          dataSourceSetting,
          valueField,
          textField
        )
      } else if (dataSourceType == 'TableQuery') {
        //					datas = dropDownSourceUtil.genTableQueryData(resultMap, dataSourceSetting, valueField, textField, widgetId);
        datas = this.genTableQueryData(
          resultMap,
          dataSourceSetting,
          valueField,
          textField,
          widgetId,
          descField,
          null
        )
      } else if (dataSourceType == 'Entity') {
        datas = dropDownSourceUtil.genEntityData(
          dataSourceSetting,
          valueField,
          textField
        )
      } else if (dataSourceType == 'Api') {
        //api
        this.getApiData(
          dataSourceSetting,
          dropDownSource,
          dataSourceType,
          widgetId,
          valueField,
          textField,
          descField
        )
        return
      }

      dropDownSource['uiData'] = datas
      dropDownSource['IsLoadData'] = true
      //增加查询条件缓存---去掉用户自定义常量，查询条件的缓存
      if (dataSourceType != 'CustomConst') {
        dropDownSource['IsWhereRestrict'] =
          dropDownSourceUtil.genwhereRestrict(dataSourceSetting)
      }

      widgetProperty.set(widgetId, 'DropDownSource', dropDownSource)
    }
  }
  getApiData (
    dataSourceSetting:any,
    dropDownSource:any,
    dataSourceType:any,
    widgetId:any,
    valueField:any,
    textField:any,
    descField:any
  ) {
    var apiOutputVar = dataSourceSetting.DataConfig.ApiOutputVar
    var invokeApiParams = dataSourceSetting.DataConfig.InvokeApiParams
    var apiCode = invokeApiParams.ApiCode
    var InputParams = invokeApiParams.InputParams
    var params = {}
    var _this = this
    for (var key in InputParams) {
      var value = InputParams[key]
      var context = new ExpressionContext()
      if (value == '' || !value) {
        continue
      }
      if (value.indexOf('[') == 0) {
        var entityName = value
          .split('.')[0]
          .slice(1, value.split('.')[0].length - 1)
        var fieldName = value
          .split('.')[1]
          .slice(1, value.split('.')[1].length - 1)
        if (entityName) {
          if (_this.count == 0) {
            var observer = new CurrentRecordObserver(entityName, '', {}, [
              fieldName
            ])
            observer.setWidgetValueHandler(function (record:any) {
              _this.getDropdownSourceData()
              _this.count++
            })
            observer.clearWidgetValueHandler(function (record:any) {
              _this.getDropdownSourceData()
              _this.count++
            })
            observerManager.addObserver({
              observer: observer
            })
          }
        }
      }
      let message = formulaEngine.execute({
        expression: value,
        context: context
      })
      params[key] = message
    }
    if (apiCode.split('.').length != 2) {
      var windowScope = scopeManager.getWindowScope()
      var componentCode = windowScope.getComponentCode()
    } else {
      var componentCode = apiCode.split('.')[0]
      var apiCode = apiCode.split('.')[1]
    }
    var _this = this
    RemoteMethodAccessor.invokeV3Webapi({
      componentCode: componentCode,
      apiCode: apiCode,
      param: params,
      afterResponse: function (data:any) {
        var uiDatas = data[apiOutputVar]
        if (descField) {
          for (var i = 0; i < uiDatas.length; i++) {
            uiDatas[i].descInfo = ''
            for (var j = 0; j < descField.length; j++) {
              if (uiDatas[i][descField[j]]) {
                if (uiDatas[i].descInfo && uiDatas[i].descInfo != '') {
                  uiDatas[i].descInfo += _this.descInfoSeparator
                }
                uiDatas[i].descInfo += uiDatas[i][descField[j]]
              }
            }
            uiDatas[i][textField] =
              uiDatas[i][textField] + ',' + uiDatas[i].descInfo
          }
        }

        dropDownSource['uiData'] = uiDatas
        dropDownSource['IsLoadData'] = true
        //增加查询条件缓存---去掉用户自定义常量，查询条件的缓存
        if (dataSourceType != 'CustomConst') {
          dropDownSource['IsWhereRestrict'] =
            dropDownSourceUtil.genwhereRestrict(dataSourceSetting)
        }
        _this.getDataAndDoHandler()
      },
      error: function (e:{status:number,message:string,msg:string}) {
        //					alert('调用api失败，失败原因：' + e.message);
        //					throw new Error("调用api失败，失败原因：" + (e.message ? e.message : e.msg));
        var last = '失败原因：'
        var exceptionType = undefined
        if (e.status === 500) {
          exceptionType = ExceptionFactory.TYPES.Config
        }
        var errMsg = e.message || e.msg || '请检查api是否存在'
        throw ExceptionFactory.create({
          exceptionDatas: [
            {
              name: 'api所在构件',
              code: 'apiComponentCode',
              value: componentCode
            },
            { name: 'api编码', code: 'apiCode', value: apiCode }
          ],
          exceptionType: exceptionType,
          message: '调用api【' + apiCode + '】失败，' + errMsg
        })
        //					ExceptionHandler.handle(exception)
      }
    })
  }
  getDropdownSourceData() {
    if (!this.dropDownSource || !this.dropDownSource.DataSourceSetting) {
      this.handler({}) //如果不设置valueMap，会导致候选项变成整列的数据
      return
    }
    this.getSource(this.widgetId, this.dropDownSource)
    if (this.dropDownSource.DataSourceSetting.DataSourceType != 'Api') {
      this.getDataAndDoHandler()
    }
  }
  getDataAndDoHandler () {
    var data = this.getData()
    var itemDatas = this.getItemData(data)
    var results = this.dataToValueMap(itemDatas)
    this.handler(
      results.valueMap,
      results.defaultValue,
      {
        keys: results.keys
      },
      results.descInfo
    )
  }
  getSource(widgetId:string, dropDownSource:any) {
    var _this = this
    if (dropDownSource != undefined && dropDownSource != '') {
      if (typeof dropDownSource !== 'object') {
        dropDownSource = jsonUtil.json2obj(dropDownSource)
      }
      var widgetId = widgetId
      var dataSourceSetting = dropDownSource['DataSourceSetting']
      if (dataSourceSetting) {
        var dataSourceType = dataSourceSetting['DataSourceType']
        var requestCfg:any = ''
        if (dataSourceType == 'SQL') {
          requestCfg = dropDownSourceUtil.genSQLConfig(dataSourceSetting)
          requestCfg.widgetId = widgetId
        } else if (dataSourceType == 'TableQuery') {
          var whereRestrict =
            dropDownSourceUtil.genwhereRestrict(dataSourceSetting)
          requestCfg = dropDownSourceUtil.genTableQueryConfig(
            dataSourceSetting,
            whereRestrict
          )
          if (requestCfg) {
            requestCfg.widgetId = widgetId
          }
        }
        var subTitle = dataSourceSetting.DataConfig.SubTitle
        var isTree = dataSourceSetting.DataConfig.IsTree
        var descInfo
        if (subTitle && isTree) {
          descInfo = dataSourceSetting.DataConfig.SubTitle.Titles
        } else if (subTitle && !isTree) {
          descInfo = dataSourceSetting.DataConfig.SubTitle.GridTitle
        }
        if (requestCfg != '') {
          var operation = new Operation()
          var selectData:any = dropDownSourceUtil.doRequestCfg(requestCfg)

          if (descInfo) {
            if (selectData.field) {
              selectData.field = selectData.field.concat(descInfo)
            }
            selectData.descField = descInfo
          }
          var windowScope = scopeManager.getWindowScope()
          var isPropertyMapping = windowMappingManager.existPropertyMapping({
            componentCode: windowScope.getComponentCode(),
            windowCode: windowScope.getWindowCode(),
            widgetCode: widgetId,
            propertyCode: 'DropDownSource'
          })
          //如果有映射
          if (isPropertyMapping) {
            var extendId = windowScope.getExtendId()
            if (extendId) {
              //存在映射父窗体
              windowScope = scopeManager.getScope(extendId)
            }
          }
          operation.setComponentCode(windowScope.getComponentCode())
          operation.setWindowCode(windowScope.getWindowCode())
          operation.setOperation('Find')
          operation.addParam('selectDatas', [selectData])
          operation.setAfterResponse(
            (function (widgetId, dropDownSource, selectData) {
              return function (result:any) {
                if (result.success == true) {
                  var dsLoadConditionMap =
                    dropDownSourceUtil.doDataSourceLoadConditionMap([
                      selectData
                    ])
                  var resultDatas =
                    dropDownSourceUtil.doResultDatasWithLoadCondition(
                      result.data.resultDatas,
                      dsLoadConditionMap
                    )
                  _this._doReturnResult(
                    widgetId,
                    dropDownSource,
                    resultDatas,
                    selectData.descField
                  )
                }
              }
            })(widgetId, dropDownSource, selectData)
          )
          windowInit.registerWindowOperation({
            operation: operation
          })
        } else {
          this._doReturnResult(
            this.widgetId,
            this.dropDownSource,
            null,
            descInfo
          )
        }
      }
    }
  }
  getData () {
    _this=this;
    var data = this.dropDownSource
    var datas
    if (typeof data !== 'object') {
      data = jsonUtil.json2obj(data)
    }
    if (data != undefined) {
      var dataSourceSetting = data['DataSourceSetting']
      var dataSourceType = dataSourceSetting['DataSourceType']

      dataSourceType = dataSourceType.toString()
      // 表、查询模式要考虑是否需要重新获取数据
      if (dataSourceType == 'TableQuery') {
        this.showColumn = this.textField
        this.saveColumn = this.valueField
        var IsWhereRestrict = data['IsWhereRestrict']
        var subTitle = dataSourceSetting.DataConfig.SubTitle
        var isTree = dataSourceSetting.DataConfig.IsTree
        var descField:string
        if (subTitle && isTree) {
          descField = dataSourceSetting.DataConfig.SubTitle.Titles
        } else if (subTitle && !isTree) {
          descField = dataSourceSetting.DataConfig.SubTitle.GridTitle
        }
        var whereRestrict = this.genwhereRestrict(dataSourceSetting)
        // 根据每次请求的条件判断是否需要重新获取数据
        if (
          !(
            jsonUtil.obj2json(IsWhereRestrict) ==
            jsonUtil.obj2json(whereRestrict)
          )
        ) {
          var windowScope = scopeManager.getWindowScope()
          var isPropertyMapping = windowMappingManager.existPropertyMapping({
            componentCode: windowScope.getComponentCode(),
            windowCode: windowScope.getWindowCode(),
            widgetCode: this.widgetId,
            propertyCode: 'DropDownSource'
          })
          //如果有映射, 就用映射的窗体
          var scopeId = isPropertyMapping ? windowScope.getExtendId() : null
          datas = scopeManager.createScopeHandler({
            scopeId: isPropertyMapping ? windowScope.getExtendId() : null,
            handler: function () {
              return _this.genTableQuery(
                dataSourceSetting,
                whereRestrict,
                _this.valueField,
                _this.textField,
                _this.widgetId,
                descField
              )
            },
            callObject: this
          })()
          //						datas = this.genTableQuery(dataSourceSetting, whereRestrict,this.valueField, this.textField, this.widgetId,descField);
          data['uiData'] = datas
        } else {
          // 条件一致直接获取缓存
          datas = data['uiData']
        }
        // 更新缓存数据
        data['IsWhereRestrict'] = whereRestrict
        widgetProperty.set(this.widgetId, 'DropDownSource', data)
      } else if (dataSourceType == 'Entity') {
        var dataConfig = dataSourceSetting.DataConfig
        var resultData = []
        //获取常量记录
        var entityConstData = dataConfig.EntityConstData
        if (entityConstData && entityConstData.ConstData) {
          var constDatas = entityConstData.ConstData
          for (var i = 0; i < constDatas.length; i++) {
            var temp = {}
            var cData = constDatas[i]
            var idColumn = cData.id
            var textColumn = cData.text
            temp[this.showColumn] = textColumn
            temp[this.saveColumn] = idColumn
            temp['id'] = idColumn
            temp['text'] = textColumn
            if (cData.selected && cData.selected.toLowerCase() === 'true') {
              temp['default'] = true
            } else {
              temp['default'] = false
            }
            resultData.push(temp)
          }
        }
        //获取实体记录
        var entityName = dataConfig.SourceName
        var showColumn = dataConfig.ShowColumn
        var saveColumn = dataConfig.SaveColumn
        if (showColumn == null && saveColumn == null) {
          this.showColumn = this.textField
          this.saveColumn = this.valueField
        }
        if (entityName) {
          var _this = this
          var entity = dsManager.lookup({
            datasourceName: entityName
          })
          var rs = entity.getAllRecords()
          rs.iterate(function (rd:any) {
            var temp = {}
            var idColumn = rd.get(saveColumn)
            var textColumn = rd.get(showColumn)
            temp[_this.showColumn] = textColumn
            temp[_this.saveColumn] = idColumn
            temp['id'] = idColumn
            temp['text'] = textColumn
            resultData.push(temp)
          })
        }
        datas = resultData
        this.listenDataSourceUpdate(this.widgetId, datas)
      } else {
        //其它模式直接从缓存获取数据
        datas = data['uiData']
      }
    }
    return datas
  }
  resultSetToValueMap (datas:any) {
    var valueMap = {},
      defaultValue = null,
      showColumn = this.showColumn,
      saveColumn = this.saveColumn,
      keys:any = []
    datas.forEach(function (record:[]) {
      var key = record[saveColumn]
      keys.push(key)
      valueMap[key] = record[showColumn]
      if (record['default'] === true) {
        defaultValue = record[saveColumn]
      }
    })
    return {
      valueMap: valueMap,
      keys: keys,
      defaultValue: defaultValue
    }
  }
  dataToValueMap (data:{}[]) {
    var keys:any = []
    var valueMap = {}
    this.defaultValue = []
    var descInfo:{[code:string]:any} = {}
    if (data) {
      for (i = 0; i < data.length; i++) {
        var itemObj:any = data[i]
        var itemText = itemObj[this.textField]
        var itemVal = itemObj[this.valueField]
        var itemDesc = itemObj.descInfo
        keys.push(itemVal)
        descInfo[itemVal] = itemDesc
        valueMap[itemVal] = itemText
        if (itemObj['default']) {
          this.defaultValue.add(itemVal)
        }
      }
    }
    return {
      valueMap: valueMap,
      defaultValue: this.defaultValue[0] ? this.defaultValue[0] : null,
      keys: keys.length > 0 ? keys : null,
      descInfo: descInfo
    }
  }
  listenDataSourceUpdate (widgetId:string, datas:any) {
    var _this = this
    var data = datas
    var dropDownSource = this.dropDownSource
    if (typeof dropDownSource !== 'object') {
      dropDownSource = jsonUtil.json2obj(dropDownSource)
    }
    if (
      dropDownSource &&
      dropDownSource.DataSourceSetting &&
      dropDownSource.DataSourceSetting.DataSourceType == 'Entity'
    ) {
      var dataSourceSetting = dropDownSource.DataSourceSetting
      var dataConfig = dataSourceSetting.DataConfig
      var entityName = dataConfig.SourceName
      if (entityName) {
        //DB加载
        dataSourceUtil.addDatasourceLoadEventHandler(
          entityName,
          function (params:any) {
            _this.updateHandler(params, data)
          }
        )
        //DB新增
        dataSourceUtil.addDatasourceInsertEventHandler(
          entityName,
          function (params:any) {
            _this.updateHandler(params, data)
          }
        )
        //DB删除
        dataSourceUtil.addDatasourceDeleteEventHandler(
          entityName,
          function (params:any) {
            _this.updateHandler(params, data)
          }
        )
      }
    }
  }
  updateHandler (params:any, data:any) {
    let _this=this;
    var resultSet = params.datasource.getAllRecords()
    var records = []
    resultSet.iterate(function (record:any) {
      records.push(record.toMap())
    })
    for (var i = 0; i < data.length; i++) {
      var hasData = records.find(function (item) {
        return (item[_this.saveColumn] = data[i][_this.saveColumn])
      })
      if (!hasData) {
        records.push(data[i])
      }
    }
    var result = this.resultSetToValueMap(records)
    var valueMap = result.valueMap
    var defaultValue = result.defaultValue
    var itemData = this.getItemData(records)
    var widget = widgetContext.get(this.widgetId, 'widgetObj')
    if (widget) {
      widget.itemDatas = itemData
      if (widget.items && widget.items[0]) {
        widget.items[0].itemDatas = itemData
      }
    }
    this.handler(valueMap, defaultValue, {
      keys: result.keys
    })
  }
  getItemData (data:{}[]) {
    var itemData = []
    for (var i = 0; i < data.length; i++) {
      var temp = {}
      var valueMap = data[i]
      var idColumn = valueMap['id']
      var valueColumn:string = valueMap[this.saveColumn]
      var textColumn = valueMap[this.showColumn]
      if (typeof valueColumn == 'string' && valueColumn.indexOf(',') != -1) {
        valueColumn = valueColumn.split(',')[0]
      }
      temp['default'] = valueMap['default']
      temp[this.textField] = textColumn
      temp[this.valueField] = valueColumn
      temp['id'] = idColumn
      temp['text'] = textColumn
      itemData.push(temp)
    }
    return itemData
  

  
}
}
export default DropdownSourceObserver
