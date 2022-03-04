import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { RemoteMethodAccessor as remoteServer } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { DatasourceFactory as dsFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { FrontEndAlerter as frontAlert } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ProgressBarUtil as ProgressBarUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.progressbar'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'

let undefined
let sandbox
let undefined
//cookie里i18n标识
let VPLATFORMI18NIDEN = 'langCookie'
let undefined

exports.initModule = function (sb) {
  sandbox = sb
}

/**
 * 调用command
 * @param	{Object}	params	提交的参数
 * @param	{Function}	success	成功的回调
 * @param	{Function}	error	失败的回调
 * */
let InvokeCommand = function (params, success, error) {
  let scope = scopeManager.getWindowScope()
  let sConfig = {
    isAsyn: false,
    componentCode: scope.getComponentCode(),
    windowCode: scope.getWindowCode(),
    ruleSetCode: 'I18nOperation',
    isRuleSetCode: false,
    commitParams: [params],
    error: error,
    afterResponse: success
  }
  remoteServer.invoke(sConfig)
}

/**
 * 获取语言值
 * */
function getLanguage() {
  let arr,
    reg = new RegExp('(^| )' + VPLATFORMI18NIDEN + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

/**
 * 把当前语言设置到localStorage
 * */
function setLanguage(value) {
  //		document.cookie = VPLATFORMI18NIDEN + "=" + value;
  localStorage.setItem(VPLATFORMI18NIDEN, value)
  VMetrix.putAllVjsContext(
    {
      language: value
    },
    1
  )
  window.location.reload()
}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg(),
    inParams = ruleCfgValue['inParams']

  if (inParams && '' != inParams) {
    let inParamObj = jsonUtil.json2obj(inParams),
      languageOperation = inParamObj.languageOperation,
      lang = inParamObj.language,
      languageType = inParamObj.languageType,
      returnMapping = inParamObj.returnMapping

    let scope = scopeManager.getWindowScope()
    let componentCode = scope.getComponentCode()
    let windowScope = scope.getWindowCode()

    switch (languageOperation) {
      case 'getCurLanguage':
        var value = localStorage.getItem(VPLATFORMI18NIDEN)
        _setDataToObject(returnMapping, value, ruleContext)
        //					var arr,reg=new RegExp("(^| )"+VPLATFORMI18NIDEN+"=([^;]*)(;|$)");
        //					if(arr = document.cookie.match(reg)){
        //						value = unescape(arr[2]);
        //					}else{
        //						logUtil.info("当前cookie没有保存语言.");
        //					}
        break
      case 'getLanguages':
        var params = {}
        params['paramName'] = 'InParams'
        params['paramType'] = 'object'
        params['paramValue'] = {
          operation: 'getAll'
        }
        var success = scopeManager.createScopeHandler({
          handler: function (returnJson) {
            if (returnJson && returnJson.data && returnJson.data.types) {
              var types = returnJson.data.types
              _setDataToObject(returnMapping, types, ruleContext)
            }
            ProgressBarUtil.hideProgress(true)
            ruleContext.fireRouteCallback()
          }
        })
        var error = function (returnJson) {
          ProgressBarUtil.hideProgress(true)
          frontAlert.error({
            title: i18n.get(
              '后台处理异常',
              '获取全部语种时，后台报错的弹框标题'
            ),
            msgHeader: i18n.get(
              '获取多语言信息异常',
              '获取全部语种时，后台报错的错误信息标题'
            ),
            msg:
              i18n.get(
                '无法获取语种列表. 错误信息：',
                '获取全部语种时，后台返回的错误信息'
              ) + (returnJson.msg ? returnJson.msg : ''),
            detail: i18n.get('暂无', '获取全部语种时，后台返回的详细错误信息'),
            callback: function () {
              ruleContext.fireRouteCallback()
            }
          })
        }
        ProgressBarUtil.showProgress(
          i18n.get('正在获取语言列表', '获取语言列表时进度条的提示文字'),
          true
        )
        InvokeCommand(params, success, error)
        ruleContext.markRouteExecuteUnAuto()
        break
      case 'setCurLanguage':
        var context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        var value = formulaUtil.execute({
          expression: inParamObj.language,
          context: context
        })
        if (null != value && '' != value) {
          setLanguage(value)
        } else {
          frontAlert.error({
            title: i18n.get('配置异常', '无法设置语言的弹框标题'),
            msgHeader: i18n.get('设置语言异常', '无法设置语言的错误信息标题'),
            msg: i18n.get(
              '无法设置语言. 错误信息：语言编码为空',
              '无法设置语言的错误信息'
            )
          })
        }
        break
    }
  }
}
/*执行表达式*/
let experssFunc = function (experss, routeContext) {
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  if (undefined == experss || null == experss) return null
  let resultValue = engine.execute({
    expression: experss,
    context: context
  })
  return resultValue
}

// 创建游离 DB 对象信息
let _createDBInfo = function (types) {
  let len = 0
  let objs = []
  let len = types.length
  for (let i = 0; i < len; i++) {
    let type = types[i]
    let map = {}
    map.id = i
    map.code = type.code
    map.name = type.name
    map.icon = type.icon
    objs.push(map)
  }
  let result = new Object(),
    metadata = new Object(),
    model = new Object()

  let datas = {
    recordCount: len,
    values: objs
  }
  result.datas = datas

  let fields = [
    {
      code: 'id',
      name: 'id',
      length: 255,
      type: 'char',
      defaultValue: '',
      precision: ''
    },
    {
      code: 'code',
      name: 'code',
      length: 255,
      type: 'char',
      defaultValue: '',
      precision: ''
    },
    {
      code: 'name',
      name: 'name',
      length: 255,
      type: 'char',
      defaultValue: '',
      precision: ''
    },
    {
      code: 'icon',
      name: 'icon',
      length: 255,
      type: 'char',
      defaultValue: '',
      precision: ''
    }
  ]

  model.datasourceName = 'FreeLangListTb'
  model.fields = fields
  metadata.model = [model]
  result.metadata = metadata

  return result
}

let _setDataToObject = function (returnMapping, value, ruleContext) {
  if (returnMapping && returnMapping.length > 0) {
    for (let i = 0; i < returnMapping.length; i++) {
      let mapping = returnMapping[i],
        dest = mapping['dest']

      let //目标类型（entity：实体，control：控件，windowVariant：窗体变量，systemVariant：系统变量）
        destType = mapping['destType'],
        //来源(returnValue:返回值，expression:表达式)
        src = mapping['src'],
        srcType = mapping['srcType'] //来源(当目标类型是实体时，返回实体存在此处)

      // 目标对象为实体
      if (dbService.isEntity(dest, destType, ruleContext)) {
        let freeDbInfo = _createDBInfo(value),
          freeDb = dsFactory.unSerialize(freeDbInfo),
          srcRecords = freeDb.getAllRecords().toArray(),
          destFieldMapping = mapping['destFieldMapping'],
          updateDestEntityMethod = mapping['updateDestEntityMethod'],
          isCleanDestEntityData = mapping['isCleanDestEntityData']

        if (updateDestEntityMethod == null)
          updateDestEntityMethod = 'insertOrUpdateBySameId'
        dbService.insertOrUpdateRecords2Entity(
          dest,
          destType,
          srcRecords,
          destFieldMapping,
          updateDestEntityMethod,
          isCleanDestEntityData,
          ruleContext
        )
      } else {
        let routeContext = ruleContext.getRouteContext()
        switch (destType) {
          case 'control':
            if (dest.indexOf('.') == -1) {
              // 目标不存在.表示为单值控件
              //								widgetDatasource.setSingleValue(target, srcVal);
              //兼容一些不是没有绑定数据库的控件，如：检索控件
              widgetProperty.set(dest, 'Value', value)
            } else {
              // 目标存在.表示为多值控件
              var widgetId = dest.split('.')[0]
              var propertyCode = dest.split('.')[1]
              widgetProperty.set(widgetId, propertyCode, value)
            }
            break
          case 'windowVariant':
            windowParam.setInput({
              code: dest,
              value: value
            })
            break
          case 'systemVariant':
            componentParam.setVariant({
              code: dest,
              value: value
            })
            break
          case 'ruleSetVariant':
            routeContext.setVariable(dest, value)
            break
          case 'ruleSetOutput':
            routeContext.setOutputParam(dest, value)
            break
          case 'windowOutput':
            // 给当前窗体输出变量赋值
            windowParam.setOutput({
              code: dest,
              value: value
            })
            break
          default:
            log.error('无效的目标类型：' + destType)
            break
        }
      }
    }
  }
}

/**
 * 给控件赋值
 */
let _setWidgetValue = function (destWidgetId, value) {
  if (destWidgetId != null && destWidgetId.indexOf('.') != -1) {
    let splits = destWidgetId.split('.')
    let widgetId = splits[0]
    let dbFieldName =
      vmMappingUtil.getRefFieldFromWidgetPropertyCode(destWidgetId)
    let valueObj = {}
    valueObj[dbFieldName] = value
    viewModel.getDataModule().setSingleRecordMultiValue(widgetId, valueObj)
  } else {
    viewModel.getDataModule().setSingleValue(destWidgetId, value)
  }
}

export { main }
