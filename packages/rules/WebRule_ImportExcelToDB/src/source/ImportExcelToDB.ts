import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourcePusher as pusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined
let undefined
let viewModel
// 增加公式解析引用 zhangliang
let ExceptionFactory
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let genUUID = function () {
  let S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

exports.initModule = function (sBox) {}
function GetTreeStruct(treeStruct, tableName) {
  for (let i = 0; i < treeStruct.length; i++) {
    let _var = treeStruct[i]
    if (tableName == _var['tableName']) {
      return _var
    }
  }
  return null
}
function MapTransform(inParamObj, ruleContext) {
  let result = {}
  result['fileSource'] = inParamObj['fileSource']
  result['treeStruct'] = inParamObj['treeStruct']
  let _rel = []
  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())

  for (let i = 0; i < inParamObj['items'].length; i++) {
    let _re = {}
    let _inParamObj = inParamObj['items'][i]
    _re['fileType'] = 'Excel'
    _re['dataName'] = _inParamObj['targetTable']
    let retValue = engine.execute({
      expression: _inParamObj['sheetNum'],
      context: context
    })
    _re['sheetNum'] = Number(retValue)
    _re['startRow'] = _inParamObj['dataStartRow']
    _re['importNodeId'] = _inParamObj['importNodeId']
    let _ma = []
    for (let j = 0; j < _inParamObj['mapping'].length; j++) {
      let _map = {}
      let _mapping = _inParamObj['mapping'][j]
      _map['chineseName'] = _mapping['fieldName']
      _map['fieldName'] = _mapping['fieldCode']
      if (_mapping['sourceType'] == 'excelColName') {
        _map['source'] = 'Excel'
      } else if ('excelColNum' == _mapping['sourceType']) {
        _map['source'] = 'ExcelColCode'
      } else {
        _map['source'] = _mapping['sourceType']
      }
      _map['value'] = _mapping['sourceValue']
      _ma[j] = _map
    }
    _re['dgcolumn'] = _ma
    _rel[i] = _re
  }
  result['items'] = _rel
  return result
}
let main = function (ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  debugger
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)
  inParamObj = MapTransform(inParamObj, ruleContext)
  let fileSource = inParamObj.fileSource // 上传控件id
  let useAttachment = true
  if (fileSource == null || fileSource == '') {
    useAttachment = false
    //			alert("规则配置中的上传控件id不能为空");
    //			return false;
  }
  let comp = widgetAction.executeWidgetAction(fileSource, 'getComponent')
  if (!comp) {
    useAttachment = false
    //			alert('找不到执行导入的文件控件');
    //			return false;
  }
  let selectIdList = {}
  let varMapList = {}
  let tmpm = []
  for (let a = 0; a < inParamObj['items'].length; a++) {
    let _inParamObj = inParamObj['items'][a]
    let dataSourceName = _inParamObj.dataName
    let sheetn = _inParamObj.sheetNum
    let _ide = dataSourceName + '_' + sheetn
    if (!tmpm.contains(_ide)) {
      tmpm[a] = _ide
    } else {
      HandleException('同一个sheetno不能导入相同的表中')
      return false
    }
    let treeStruct =
      inParamObj['treeStruct'] == null
        ? null
        : GetTreeStruct(inParamObj['treeStruct'], dataSourceName) // 获取树结构配置
    //inParamObj["items"][a]["treeStruct"] = treeStruct==null?"":treeStruct;
    inParamObj['items'][a]['treeStruct'] = treeStruct //==null?"":treeStruct;
    let dataType = treeStruct != null ? 'tree' : 'Table' // 为Table或Tree
    inParamObj['items'][a]['dataType'] = dataType //==null?"":treeStruct;
    let importNodeId = treeStruct != null ? _inParamObj['importNodeId'] : '' // 导入目标树节点id
    dataType = dataType.toLowerCase()
    //			// 得到导入的目标节点id值
    let selectId = ''
    if (dataType == 'tree') {
      if (treeStruct == null || treeStruct.length == 0) {
        alert('规则配置中没有树结构信息')
        return false
      }
      if (treeStruct.type != '1' && treeStruct.type != '2') {
        alert('规则配置中树类型只能为层级码树或左右树')
        return false
      }
      if (importNodeId != null && importNodeId != '') {
        //					selectId = formulaUtil.evalExpression(importNodeId);
        let context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        selectId = engine.execute({
          expression: importNodeId,
          context: context
        })
        selectIdList[dataSourceName] = selectId
      }
    }
    //			// 得到字段值包括表达式 Express、实体字段 Entity、系统变量 System、组件变量 Component
    let varMap = {}
    for (let i = 0; i < _inParamObj.dgcolumn.length; i++) {
      let source = _inParamObj.dgcolumn[i].source
      let fieldCode = _inParamObj.dgcolumn[i].fieldName
      let value = _inParamObj.dgcolumn[i].value
      let sheetno = _inParamObj.sheetNum
      if (source === 'Entity') {
        dataSourceName = value.substring(0, value.indexOf('.'))
        //					var currentRow = viewModel.getDataModule().getCurrentRowByDS(dataSourceName);
        let datasource = manager.lookup({ datasourceName: dataSourceName })
        let currentRow = datasource.getCurrentRecord()

        //					var db = dbManager.getDB(dataSourceName);
        let datasource = manager.lookup({
          datasourceName: changeDsArr[changeIndex]
        })
        let db = datasourceclearRemoveDatas()

        if (currentRow != null) {
          varMap[fieldCode] = currentRow.get(value)
        } else {
          varMap[fieldCode] = null
        }
      } else if (source === 'System') {
        // 如果是系统变量
        //					varMap[fieldName] = viewContext.getSystemVariableValue(value);
        varMap[fieldCode] = componentParam.getVariant({ code: value })
      } else if (source === 'Component') {
        // 如果是组件变量
        //					varMap[fieldName] = viewContext.getVariableValue(value);
        varMap[fieldCode] = windowParam.getInput({ code: value })
      } else if (source === 'Express' || source === 'expression') {
        // 如果是表达式
        // 2015-05-29 liangchaohui：3.x后改成expression
        //					varMap[fieldName] = formulaUtil.evalExpression(value);
        let context = new ExpressionContext()
        context.setRouteContext(ruleContext.getRouteContext())
        varMap[fieldCode] = engine.execute({
          expression: value,
          context: context
        })
      }
      varMapList[_ide] = varMap
    }
  }

  let actionType = 'importTable'
  let routeRuntime = ruleContext.getRouteContext()
  let transactionId = routeRuntime.getTransactionId()
  // actionType="importEntity";
  let option = {
    ruleInstId: ruleConfig.instanceCode,
    selectId: selectIdList,
    action: actionType,
    varMap: varMapList,
    ruleConfig: jsonUtil.obj2json(inParamObj),
    instance: transactionId /**不知道干什么的,可能多余的 jiqj */,
    transactionId:
      transactionId /**后台需要这个进行事物管理, 事物id变量错误，导致没有与前一个事务串联 jiqj*/
  }
  //获取规则路由上下文
  /*
    var routeContext = ruleContext.getRouteConteext();
    //获取规则链路上下文的事物id
    var transactionId = routeContext.getTransactionId();
    */
  //console.log("获取规则链路上下文的事物jiqj id:" + transactionId);

  let scopeId = scopeManager.getCurrentScopeId()
  let callback = function (arg1, arg2) {
    scopeManager.openScope(scopeId)
    try {
      logUtil.log('结束发送时间：' + new Date().toLocaleTimeString())
      if (arg2) {
        if (arg2.success) {
          ruleContext.setRuleStatus(true)
          ruleContext.fireRuleCallback()
          ruleContext.fireRouteCallback()
        } else {
          let type = arg2.exceptionType
          let msg = arg2.msg
          //						var exception = ExceptionFactory.create(type, msg);
          let exception = factory.create({ type: type, message: msg })
          //TYPES枚举值：Expected，UnExpected，Business，Dialog，Unlogin，Expression
          ruleContext.handleException(exception)
        }
      } else {
        logUtil.error('上传控件回调参数不正确，请处理！')
      }
    } finally {
      scopeManager.closeScope()
    }
  }
  let start = new Date()
  logUtil.log('开始发送时间：' + start.toLocaleTimeString())
  ruleContext.markRouteExecuteUnAuto()

  //创建input表单
  // 创建好以后出发点击事件
  // 文件选择事件中出发后续逻辑
  // 逻辑完成后触发删除之前创建的input表单
  if (useAttachment) {
    widgetAction.executeWidgetAction(fileSource, 'importData', option, callback)
  } else {
    option.componentCode = scopeManager.getScope().getComponentCode()
    option.windowCode = scopeManager.getWindowScope().getWindowCode()
    if ($('#importExcelToDBFileButton').length > 0) {
      $('#importExcelToDBFileButton').next().remove()
      $('#importExcelToDBFileButton').remove()
    }

    let fileInput =
      "<div id='importExcelToDBFileButton' style='display:none'>隐藏按钮</div>"
    $('body').append(fileInput)

    let error_msg
    let plupload_upload_obj = new plupload.Uploader({
      //实例化一个plupload上传对象
      runtimes: 'html5,flash,html4',
      browse_button: 'importExcelToDBFileButton',
      url: 'module-operation!executeOperation?operation=FileUpload&ajaxRequest=true',
      multipart_params: {},
      multi_selection: false,
      //	            filters: {
      //	                mime_types: [{
      //	                    title: "files",
      //	                    extensions: control_sc_obj.file_types != undefined ? control_sc_obj.file_types.replaceAll("*.", "").replaceAll(";", ",") : "*"
      //	                }],
      //	                max_file_size: control_sc_obj.file_size_limit + 'kb'
      //	            },
      init: {
        FilesAdded: function (uploader, files) {
          //添加文件触发
          plupload_upload_obj.start()
        },
        FileUploaded: function (uploader, file, responseObject) {
          //每个文件上传完成触发
          error_msg = isc.JSON.decode(responseObject.response)
          console.log('导入数据事件：FileUploaded')
        },
        UploadComplete: function (uploader, files) {
          //全部文件上传完成触发
          callback(files, error_msg)
        },
        Init: function () {
          $('#importExcelToDBFileButton')
            .next()
            .children()
            .change(function () {
              console.log('JQuery监听到事件')
            })
          $('#importExcelToDBFileButton').next().children().click()
          setTimeout(function () {
            console.log('ssssssssssssssssssssss')
          }, 1000)
        }
      }
    })
    plupload_upload_obj.init()
    let token = {
      data: {
        dataId: genUUID(),
        action: 'importTable',
        cfg: option,
        componentCode: option.componentCode,
        windowCode: option.windowCode,
        transaction_id: option.transactionId
      }
    }
    let appendUrl = plupload_upload_obj.settings.url
    appendUrl += '&' + 'componentCode=' + option.componentCode
    appendUrl += '&' + 'windowCode=' + option.windowCode
    plupload_upload_obj.settings.url = appendUrl
    plupload_upload_obj.settings.multipart_params.token = encodeURI(
      isc.JSON.encode(token)
    )

    ruleContext.setRuleCallback(true)
  }
  return true
}
//异常处理方法
function HandleException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: tmpvar
  })
  exception.handle()
}
export { main }
