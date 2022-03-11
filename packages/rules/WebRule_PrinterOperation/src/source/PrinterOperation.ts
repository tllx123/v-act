import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as ExpressEngine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.interface.route'
import { DatasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { RemoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { EasyTemplateUtil as tmplUtil } from '@v-act/vjs.framework.extension.util.easytemplate'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'
import {$} from '@v-act/vjs.framework.extension.vendor.jquery'

let sandBox,
  printer:any,
  isLoaded = false

export function initModule(sBox:any) {
  sandBox = sBox
  window.showModalDialog = function (strPURL:string) {
    window.open(
      strPURL,
      'printWindow',
      'scrollbars=yes,toolbar=no,left=150,top=100,resizable=yes'
    )
  }
}

const main = function (ruleContext: RuleContext) {
  ruleContext.markRouteExecuteUnAuto()
  let scopeId = ScopeManager.getCurrentScopeId()
  let ruleCfgValue = ruleContext.getRuleCfg()
  let ruleConfig:any
  ruleConfig = _getConfig(ruleCfgValue['inParams'], ruleContext)
  let inParamsObj = JSON.parse(ruleCfgValue['inParams'])
  let cfg = inParamsObj['curTemplate']['datas']['values'][0]

  //打印来源类型(reportPrintType)： 转换数据（PrintDataConvert）、打印模板（PrintTemplate）
  let reportPrintType = cfg['reportPrintType']
  if ('PrintDataConvert' == reportPrintType) {
    //操作类型(printType)： 打印（print）、预览（preview）、填报（writeReport）、自定义（custom）、偏移测试（test）
    let printType = ruleConfig['printType']
    if ('writeReport' == printType) {
      printType = 'preview'
    }
    let offset = inParamsObj['curOffset']['datas']['values'][0]
    let printType1 = inParamsObj['curPrintType']['datas']['values'][0]['code']
    _getRemotePrinter2(ruleConfig, ruleContext, cfg, offset, printType1)
  } else {
    //打印模板
    _getRemotePrinter(ruleConfig, ruleContext)
  }
}

//获取打印机序号
let getPrinterIndex = function (printer:any, printerName:string) {
  if (printerName != '') {
    let count = printer.GET_PRINTER_COUNT()
    for (let i = 0; i < count; i++) {
      let name = printer.GET_PRINTER_NAME(i)
      if (name == printerName) {
        return i
      }
    }
  }
  return -1
}

// 获取打印机所支持的所有纸张
let getPrinterPapers = function (printer:any, printerName:string) {
  let pageSizeList
  if (printerName != '') {
    printer.SET_PRINTER_INDEXA(printerName) //设置打印机
    pageSizeList = printer.GET_PAGESIZES_LIST(printerName, '\n') //获取当前打印机纸张信息
  } else {
    pageSizeList = printer.GET_PAGESIZES_LIST(-1, '\n') //获取默认打印机纸张信息
  }
  let printerPapers = pageSizeList.split('\n')
  return printerPapers
}

// 获取纸张名称
let getPaperName = function (paperSize:number) {
  let paperNames:{[code:string]:any} = {
    'null': 'A4',
    '8': 'A3',
    '11': 'A5',
    '66': 'A2',
    '70': 'A5'
  }
  let paperSize1 = paperNames[paperSize]
  return paperSize1
}

let printDataConvert = function (printer:any, cfg:any, offset:any) {
  // 服务器类型
  let serverHostType = cfg['serverHostType']
  // 打印机名称
  let printerName = cfg['printerName']
  // 左偏移量
  let offsetLeft = offset['offsetLeft']
  // 上偏移量
  let offsetTop = offset['offsetTop']
  // 打印份数
  let printNum = Number(cfg['printNum'])
  // 获取打印机序号
  let printerIndex = getPrinterIndex(printer, printerName)
  // 获取打印机所有纸张
  let printerPapers = getPrinterPapers(printer, printerName)

  let printType = cfg['printType']
  let resultContentField = cfg['resultContentField']
  let datasource = cfg['datasource']
  let array = datasource.getAllRecords().toArray()
  // 打印比例
  let zoomScale = 100
  let map:{[code:string]:any} = {}
  for (let i = 0; i < array.length; i++) {
    let objs = array[i].getOriginalData()[resultContentField]
    let obj = JSON.parse(objs)
    let printSetting = JSON.parse(obj['print'])
    let orient = printSetting['orient']
    let paperName = getPaperName(printSetting['paperSize'])
    // 打印比例
    let zoomScaleStr = printSetting['zoomScale']
    if (zoomScaleStr == null || zoomScaleStr == '' || zoomScaleStr == 'null')
      zoomScale = 100
    else zoomScale = Number(zoomScaleStr) * 100
    let mapKey = orient + '_' + paperName
    if (map[mapKey] == null) {
      let htmls = []
      htmls.push(obj)
      map[mapKey] = htmls
    } else {
      let htmls = map[mapKey]
      htmls.push(obj)
    }
  }

  if (Object.keys(map).length > 1 && printType == 'preview') {
    alert('打印纸张，方向不统一，无法预览')
    return
  }

  let printReportTimer:any = null
  //最大重试次数
  let printReportMaxTime = 50
  //当前重试次数
  let printReportCurTime = 0

  let doPrintReport = function () {
    if (printer.webskt && printer.webskt.readyState == 1) {
      clearTimeout(printReportTimer)
      let isNewPage = false
      for (let key in map) {
        //打印初始化
        printer.PRINT_INITA(offsetTop, offsetLeft, 800, 600, '打印_' + key)
        printer.SET_PRINTER_INDEX(printerIndex)
        let orient = key.split('_')[0] //打印纸横向纵向
        let paperName = key.split('_')[1] //纸张类型 A4
        if (printerPapers.contains(paperName)) {
          printer.SET_PRINT_PAGESIZE(orient, 0, 0, paperName)
        } else {
          for (let i = 0; i < printerPapers.length; i++) {
            let printerPaper = printerPapers[i]
            if (printerPaper.indexOf(paperName) > -1) {
              printer.SET_PRINT_PAGESIZE(orient, 0, 0, printerPaper)
              break
            }
          }
        }

        printer.SET_PRINT_MODE('RESELECT_PRINTER', 1) //设置是否可以重新选择打印机。
        printer.SET_PRINT_MODE('RESELECT_PAGESIZE', 1) //设置是否可以重新选择纸张。
        printer.SET_PRINT_MODE('RESELECT_ORIENT', 1) //设置是否可以重新选择打印方向。

        //获取纸张长度（mm）
        let paperLength =
          printer.GET_PRINTER_NAME(printerIndex + ':PaperLength') / 10
        if (orient == '2') {
          printer.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', true)
          paperLength =
            printer.GET_PRINTER_NAME(printerIndex + ':PaperWidth') / 10
        }

        let l2Margin = 0 //上个模板的右边距
        let objs = map[key]
        for (let j = 0; j < objs.length; j++) {
          let obj = objs[j]
          //页眉
          let pageHeader = obj['pageHeader']
          let pageHeaderHeight = 0
          let pageHeaderHeightPx = obj['pageHeaderHeight']
          if (pageHeaderHeightPx != null) {
            pageHeaderHeight = Number(pageHeaderHeightPx) * 0.254
          }
          //页脚
          let pageFooter = obj['pageFooter']
          let pageFooterHeight = 0
          let pageFooterHeightPx = obj['pageFooterHeight']
          if (pageFooterHeightPx != null) {
            pageFooterHeight = Number(pageFooterHeightPx) * 0.254
          }
          //正文
          let html = obj['html']
          let printSetting = JSON.parse(obj['print'])
          let tMarginPx = Number(printSetting['tMargin']) * 0.254 //上边距
          let lMarginPx = Number(printSetting['lMargin']) * 0.254 //左边距
          let rMarginPx = Number(printSetting['rMargin']) * 0.254 //右边距
          let bMarginPx = Number(printSetting['bMargin']) * 0.254 //下边距
          let tMargin = tMarginPx * 0.254
          let lMargin = lMarginPx * 0.254
          let rMargin = rMarginPx * 0.254
          let bMargin = bMarginPx * 0.254
          //打印页眉
          if (pageHeaderHeight > 0) {
            printer.ADD_PRINT_HTM(
              tMargin + 'mm',
              lMargin + 'mm',
              'RightMargin:' + rMargin + 'mm',
              pageHeaderHeight + 'mm',
              pageHeader
            )
            printer.SET_PRINT_STYLEA(0, 'ItemType', 1)
          }
          //打印页脚
          if (pageFooterHeight > 0) {
            let topLength = paperLength - pageFooterHeight - bMargin
            printer.ADD_PRINT_HTM(
              topLength + 'mm',
              lMargin + 'mm',
              'RightMargin:' + rMargin + 'mm',
              pageFooterHeight + 'mm',
              pageFooter
            )
            printer.SET_PRINT_STYLEA(0, 'ItemType', 1)
          }

          //是否连打
          let continuousPrint = obj['continuousPrint']
          //是否动态报表
          let isList = obj['isList']
          //图片
          let imgs = obj['imgs']
          imgs = JSON.parse(imgs)
          //分割成多个table（一个table代表一个Sheet）
          let tables = html.split(
            '<div style="page-break-after:always">&nbsp;</div>'
          )
          //获取上边距
          let topValue = tMargin + pageHeaderHeight
          //获取下边距
          let bottomValue = bMargin + pageFooterHeight
          for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            let ht = tables[tableIndex]
            if (ht != '') {
              //每页打印行数（再分页数）
              let childTables = ht.split(
                '<p style="page-break-after:always">&nbsp;</p>'
              )
              if (childTables.length <= 1) {
                if (continuousPrint) {
                  let bLMargin = lMargin - l2Margin //计算出本次模板距离纸张的左边距
                  addImg(printer, imgs, tableIndex, topValue, lMargin)
                  printer.ADD_PRINT_TABLE(
                    topValue + 'mm',
                    bLMargin + 'mm',
                    'RightMargin:' + rMargin + 'mm',
                    'BottomMargin:' + bottomValue + 'mm',
                    '<!DOCTYPE html>' + ht
                  )
                  printer.SET_PRINT_STYLEA(0, 'LinkedItem', -1) //模板连打
                  if (!isList) {
                    printer.SET_PRINT_STYLEA(0, 'LinkNewPage', 'True')
                  }
                  l2Margin = l2Margin + bLMargin
                } else {
                  if (false == isNewPage) {
                    printer.NEWPAGEA()
                    isNewPage = true
                  }
                  addImg(printer, imgs, tableIndex, topValue, lMargin)
                  printer.ADD_PRINT_TABLE(
                    topValue + 'mm',
                    lMargin + 'mm',
                    'RightMargin:' + rMargin + 'mm',
                    'BottomMargin:' + bottomValue + 'mm',
                    '<!DOCTYPE html>' + ht
                  )
                  isNewPage = false
                }
              } else {
                if (false == isNewPage) {
                  printer.NEWPAGEA()
                  isNewPage = true
                }
                addImg(printer, imgs, tableIndex, topValue, lMargin)
                //每页打印行数
                for (let n = 0; n < childTables.length; n++) {
                  let childHt = childTables[n]
                  if (childHt != '') {
                    if (false == isNewPage) {
                      printer.NEWPAGEA()
                      isNewPage = true
                    }
                    printer.ADD_PRINT_TABLE(
                      topValue + 'mm',
                      lMargin + 'mm',
                      'RightMargin:' + rMargin + 'mm',
                      'BottomMargin:' + bottomValue + 'mm',
                      '<!DOCTYPE html>' + childHt
                    )
                    isNewPage = false
                  }
                }
              }
            }
          }
        }

        if (zoomScale != 100) {
          let printPagePercent = zoomScale + '%'
          printer.SET_PRINT_MODE('PRINT_PAGE_PERCENT', printPagePercent)
        }

        if (printType == 'print') {
          if (printNum > 1) {
            printer.SET_PRINT_COPIES(printNum)
          }
          printer.PRINT()
        } else {
          if ('local' != serverHostType) {
            printer.PREVIEW('_dialog') //远程弹窗预览
          } else {
            printer.PREVIEW()
          }
        }
      }
    } else {
      if (printReportCurTime > printReportMaxTime) {
        clearTimeout(printReportTimer)
      } else {
        printReportTimer = setTimeout(doPrintReport, 100)
        printReportCurTime++
      }
    }
  }

  doPrintReport()
}

let getHost = function (path:string) {
  let _host =
    window.location.protocol + '//' + window.location.host + '/' + path
  return _host
}

let addImg = function (printer:any, imgs:any, tableIndex:any, tMargin:any, lMargin:any) {
  if (imgs == null) {
    return
  }
  for (let j = 0; j < imgs.length; j++) {
    let img = imgs[j]
    let index = img['index']
    if (index != tableIndex) {
      continue
    }

    let reportImagePrintType = img['reportImagePrintType']
    let topPx = img['top']
    let leftPx = img['left']
    let widthPx = img['width']
    let heightPx = img['height']
    let path = img['path']

    let top = topPx * 0.254 + tMargin + 'mm'
    let left = leftPx * 0.254 + lMargin + 'mm'
    let width = widthPx * 0.254 + 4 + 'mm'
    let height = heightPx * 0.254 + 4 + 'mm'
    let imgUrl =
      "<img border='0' src='" +
      getHost(path) +
      "' style='z-index:-1; position:absolute;width:" +
      widthPx +
      'px;height:' +
      heightPx +
      "px'>"
    printer.ADD_PRINT_IMAGE(top, left, width, height, imgUrl)

    if (reportImagePrintType == 'FirstPage') {
      // 不用加，分组报表时，第一页都要打印
      //printer.SET_PRINT_STYLEA(0, "PageIndex", "First");
    } else if (reportImagePrintType == 'EachPage') {
      printer.SET_PRINT_STYLEA(0, 'PageIndex', 'Odd,Even')
      printer.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
    } else if (reportImagePrintType == 'LastPage') {
      printer.SET_PRINT_STYLEA(0, 'PageIndex', 'Last')
      printer.SET_PRINT_STYLEA(0, 'TransColor', '#FFFFFF')
    }
  }
}

let _checkAndExecutePrint = function (scopeId:string, waitTime:number, ruleContext:RuleContext) {
  setTimeout(function () {
    waitTime += 100
    if (isLoaded === false && waitTime <= 3000) {
      _checkAndExecutePrint(scopeId, waitTime, ruleContext)
    } else {
      //@ts-ignore
      if (typeof LODOP === 'undefined' || !LODOP || !LODOP.VERSION) {
        ScopeManager.openScope(scopeId)
        dialogUtil.errorDialog('打印插件未安装!\n', null, false)
        _showPrinterInstallTips()
        ruleContext.fireRouteCallback()
        ScopeManager.closeScope()
      } else {
        if (_isWebSocketReady() == false && waitTime <= 5000) {
          _checkAndExecutePrint(scopeId, waitTime, ruleContext)
        } else {
          ScopeManager.openScope(scopeId)
          _executePrint(ruleContext)
          ScopeManager.closeScope()
        }
      }
    }
  }, 100)
}

let _isWebSocketReady = function () {
  if (
    //@ts-ignore
    typeof LODOP !== 'undefined' &&
    //@ts-ignore
    LODOP.webskt &&
    //@ts-ignore
    LODOP.webskt.readyState == 1
  ) {
    return true
  } else {
    return false
  }
}

let _executePrint = function (ruleContext:RuleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  // 原始格式转换，原始格式请参考jsonschema.PrinterOperation.json
  let ruleConfig:any = _getConfig(ruleCfgValue['inParams'], ruleContext)
  if (ruleConfig.printType == 'test') {
    _test(ruleConfig, ruleContext)
  } else {
    // 获取模板，获取模板数据、调用打印接口该函数的回调函数中
    _getTemplate(ruleConfig.templatePath, ruleConfig, ruleContext)
  }
}

/**
 * 转换规则配置的数据格式，详细格式请参考jsonschema.PrinterOperation.json
 */
let _getConfig = function (inParams:any, ruleContext:RuleContext) {
  if (undefined == inParams || null == inParams) return null
  let params = null
  if (typeof inParams == 'string') params = jsonUtil.json2obj(inParams)
  else params = inParams

  let data:{[code:string]:any} = {customType:'',printType:'',templatePath:'',mappingList:{},entityMappingList:{},sourceEntityList:{},serviceHost:'',printerName:'',offset:''}

  //get printType
  data.printType = params.printType
  if (data.printType == 'custom') {
    //如果printType的值为custome，需要解析表达示

    data.customType = ''
    let curTemDatas = params.curTemplate.datas
    if (curTemDatas != null) {
      let curTemDatasValues = curTemDatas.values[0]
      if (curTemDatasValues != null) {
        data.customType = curTemDatasValues.customType
      }
    }

    let customtype = data.customType
    if (customtype != undefined && customtype != '') {
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      data.customType = ExpressEngine.execute({
        expression: customtype,
        context: context
      })
    }

    data.printType = data.customType
  }

  data.templatePath = params.templatePath
  data.mappingList = {}
  data.entityMappingList = {}
  data.sourceEntityList = []

  //get serviceHost
  data.serviceHost = ''
  //@ts-ignore
  let curTemDatas = params.curTemplate.datas
  if (curTemDatas != null) {
    let curTemDatasValues = curTemDatas.values[0]
    if (curTemDatasValues != null) {
      if (curTemDatasValues.serviceHost != null) {
        data.serviceHost = curTemDatasValues.serviceHost
      }
    }
  }

  let servicehost = data.serviceHost
  if (servicehost != undefined && servicehost != '') {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    data.serviceHost = ExpressEngine.execute({
      expression: servicehost,
      context: context
    })
  }

  //get printerName
  data.printerName = ''
  //@ts-ignore
  let curTemDatas = params.curTemplate.datas
  if (curTemDatas != null) {
    let curTemDatasValues = curTemDatas.values[0]
    if (curTemDatasValues != null) {
      if (curTemDatasValues.printerName != null) {
        data.printerName = curTemDatasValues.printerName
      }
    }
  }

  let printername = data.printerName
  if (printername != undefined && printername != '') {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    data.printerName = ExpressEngine.execute({
      expression: _getPrinterName(printername),
      context: context
    })
  }

  let offsetRecord = params.curOffset.datas.values[0]
  let offsetTop = '-6'
  let offsetLeft = '-4'
  if (undefined != offsetRecord) {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    offsetTop = ExpressEngine.execute({
      expression: offsetRecord.offsetTop,
      context: context
    })
    offsetLeft = ExpressEngine.execute({
      expression: offsetRecord.offsetLeft,
      context: context
    })
  }
  data.offset = {
    offsetTop: _mm2px(offsetTop),
    offsetLeft: _mm2px(offsetLeft)
  }

  let mappings = params.mappingList.datas.values
  $(mappings).each(function () {
    //@ts-ignore
    let map = this

    if (undefined == data.mappingList[map.templateEntity])
      data.mappingList[map.templateEntity] = {}

    // 转换前：tableName.fieldName
    // 转换后：fieldName
    let templateEntityField = map.templateEntityField
    if (templateEntityField.indexOf('.') >= 0)
      templateEntityField = map.templateEntityField.split('.')[1]

    data.mappingList[map.templateEntity][templateEntityField] = {
      sourceEntity: map.sourceEntity,
      sourceEntityField: map.sourceEntityField
    }

    if ($.inArray(map.sourceEntity, data.sourceEntityList) < 0)
      data.sourceEntityList.push(map.sourceEntity)

    data.entityMappingList[map.templateEntity] = map.sourceEntity
  })
  return data
}

//解析打印机名称
let _getPrinterName = function (printerName:string) {
  let reg = new RegExp('^".+?"$')
  if (reg.test(printerName)) {
    return printerName.replaceAll('\\', '\\\\') //需要时再替换回：data.printerName.replaceAll("\\\\",'\\');
  }

  return printerName
}

let _getDPI = function () {
  let dpi
  //@ts-ignore
  if (window.screen.deviceXDPI != undefined) {
    //@ts-ignore
    dpi = window.screen.deviceXDPI
  } else {
    let tmpNode:any = document.createElement('DIV')
    tmpNode.style.cssText =
      'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
    document.body.appendChild(tmpNode)
    dpi = parseInt(tmpNode.offsetWidth)
    tmpNode.parentNode.removeChild(tmpNode)
  }
  return dpi
}

let _mm2px = function (mm:any) {
  // 1mm = 0.039inch
  let mm_inch = 0.04
  let inch = mm * mm_inch
  // var dpi = _getDPI();
  let dpi = 96
  let px = Math.round(dpi * inch)
  return px
}

/**
 * 将普通的文本转换成表达式，如果本身是表达式，则不转换<br>
 * 转换前：abc<br>
 * 转换后："abc"
 */
let _getExpression = function (exp:any) {
  exp = exp.toString()
  if (exp.indexOf('"') == 0 && exp.lastIndexOf('"') == exp.length - 1)
    return exp
  else return '"' + exp + '"'
}

/**
 * 获取打印模板
 */
let _getTemplate = function (path:string, ruleConfig:any, ruleContext:RuleContext) {
  let inputParams = {
    path: path
  }
  let scopeId = ScopeManager.getCurrentScopeId()
  let callback = function (responseObj:any) {
    let printView = jsonUtil.json2obj(responseObj.template)
    if (printView == null) {
      dialogUtil.propmtDialog('未获取打印模板！\n', null, false, 3)
      return
    }

    // 如果表达式中有使用函数，则先加载函数依赖
    if (printView && printView.funcs && printView.funcs.length > 0) {
      let sandbox:any
      sandbox = sandbox.create({
        extensions: printView.funcs
      })
      sandbox.active().done(function (sbox:any) {
        ScopeManager.openScope(scopeId)
        try {
          _print(printView, ruleConfig, ruleContext)
        } finally {
          ScopeManager.closeScope()
        }
      })
    } else {
      _print(printView, ruleConfig, ruleContext)
    }
  }

  let componentCode = ScopeManager.getScope().getComponentCode()

  RemoteMethodAccessor.invoke({
    isAsyn: false,
    ruleSetCode: 'CommonRule_PrinterOperation',
    componentCode: componentCode,
    commitParams: [
      {
        paramName: 'InParams',
        paramType: 'char',
        paramValue: jsonUtil.obj2json(inputParams)
      }
    ],
    afterResponse: callback
  })
}

/**
 * 获取模板需要的数据
 */
let _getData = function (entityMappingList:{[code:string]:any}, mappingList:{[code:string]:any}) {
  let data:{[code:string]:any} = {}

  for (let templateEntity in entityMappingList) {
    let datasource = DatasourceManager.lookup({
      datasourceName: entityMappingList[templateEntity]
    })
    data[templateEntity] = {
      allRecords: [],
      selectedRecords: []
    }
    if (datasource) {
      let selectedRecordsDS = datasource.getSelectedRecords().toArray() //注意返回值对象有改变
      let allRecordsDS = datasource.getAllRecords().toArray()
      for (let j = 0; j < selectedRecordsDS.length; j++) {
        data[templateEntity].selectedRecords.push(
          _getMappingData(
            templateEntity,
            selectedRecordsDS[j].getOriginalData(),
            mappingList
          )
        )
      }
      for (let j = 0; j < allRecordsDS.length; j++) {
        data[templateEntity].allRecords.push(
          _getMappingData(
            templateEntity,
            allRecordsDS[j].getOriginalData(),
            mappingList
          )
        )
      }
    } else {
      let msg =
        '模板实体【' +
        templateEntity +
        '】配置的来源实体【' +
        entityMappingList[templateEntity] +
        '】不正确，请检查配置'
      logUtil.warn(msg)
    }
  }

  return data
}

let _getMappingData = function (entity:any, sourceData:{[code:string]:any}, mappingList:{[code:string]:any}) {
  let data:{[code:string]:any} = {}
  let entityMap = mappingList[entity]

  for (let field in entityMap) {
    let sourceFieldName = entityMap[field].sourceEntityField
    if (sourceData[sourceFieldName] && sourceData[sourceFieldName].split)
      data[field] = sourceData[sourceFieldName]
        .split('\r')
        .join('')
        .split('\n')
        .join('\\n')
    else data[field] = sourceData[sourceFieldName]
  }
  return data
}

/**
 * 根据打印模板生成打印预览或
 */
let _print = function (pv:any, ruleConfig:any, ruleContext:RuleContext) {
  let template = pv.template
  let mappingList = ruleConfig.mappingList
  let entityMappingList = ruleConfig.entityMappingList
  let sourceEntityList = ruleConfig.sourceEntityList
  let data = _getData(entityMappingList, mappingList)
  function convertChar(entityValue:any) {
    if (
      entityValue == undefined ||
      entityValue == 'undefined' ||
      entityValue == '' ||
      entityValue.length == 0
    )
      return ''
    let result = ''
    //          console.log("处理前："+entityValue);
    //20160906 liangzc：在最外层加一个标签，防止用户直接传入一段非html的文本导致处理逻辑错误。
    let targetValue = '<html>' + entityValue + '</html>'
    let tmpArray = targetValue.split('>')
    for (let i = 0; i < tmpArray.length; i++) {
      let simpleItem = tmpArray[i]
      if (simpleItem != '') {
        if (simpleItem.indexOf('<') == -1) {
          result = result + simpleItem.replaceAll("'", '&#39;') + '>'
        } else if (simpleItem.indexOf('<') == 0) {
          result = result + simpleItem.replaceAll("'", '"') + '>'
        } else {
          let simpleArray = simpleItem.split('<')
          for (let j = 0; j < simpleArray.length; j++) {
            let simpleI = simpleArray[j]
            if (j == simpleArray.length - 1) {
              result = result + simpleI.replaceAll("'", '"') + '>'
            } else {
              //result = result + simpleI.replaceAll("'","&#39;").replaceAll("\\","&#92") + "<";
              //2016-12-05 liangzc：打印模板的富文本控件，不将\转换成\\。
              result =
                result +
                simpleI
                  .replaceAll("'", '&#39;')
                  .replaceAll(' ', '&nbsp;')
                  .replaceAll('\\\\', '&#92')
                  .replaceAll('\\n', '<br />')
                  .replaceAll('\\', '&#92') +
                '<'
            }
          }
        }
      }
    }
    result = result.substring(6, result.length - 7)
    //          console.log("处理后："+result);
    return result
  }
  //@ts-ignore
  window._printviewConvertChar = convertChar
  template = tmplUtil.easyTemplate(template, data).toString()
  //图片需要请求后台，检查是否属于透明图片
  printer.tmp_ScopeManager = ScopeManager
  printer.tmp_RemoteMethodAccessor = RemoteMethodAccessor

  // 生成打印视图
  let templateObjs = eval(template)
  let widgetList = {}
  $(templateObjs).each(function () {
    //@ts-ignore
    this(printer, ruleConfig.offset, widgetList)
  })

  // 设置预览、打印等语句不返回结果(从而避免chrome对弹窗超时误报崩溃):
  if (printer.VERSION >= '6.1.9.8') printer.SET_SHOW_MODE('NP_NO_RESULT', true)

  // 预览或直接打印
  _printOrPreviewBegin(ruleConfig, ruleContext)
}

/*判断当前浏览器是否为IE*/
let isIE = function () {
  return 'ActiveXObject' in window
}

/*判断当前IE浏览器是否支持 web scoket */
let isIESupportWebScoket = function () {
  let result = true

  if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
    result = false
  } else if (navigator.userAgent.indexOf('MSIE 7.0') > 0) {
    result = false
  } else if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
    result = false
  } else if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
    result = false
  }

  return result
}

//预览或直接打印
let _printOrPreviewBegin = function (ruleConfig:any, ruleContext:RuleContext) {
  let printType = ruleConfig.printType
  let serviceHost = ruleConfig.serviceHost

  let intOrient = printer.tmp_intOrient
  if (intOrient == 0) {
    printer.SET_PRINT_PAGESIZE(
      printer.tmp_intOrient,
      printer.tmp_pwidth,
      printer.tmp_pheight,
      printer.tmp_paperType
    )
  } else {
    printer.SET_PRINT_PAGESIZE(
      printer.tmp_intOrient,
      printer.tmp_pheight,
      printer.tmp_pwidth,
      printer.tmp_paperType
    )
  }
  //@ts-ignore
  if (LODOP.webskt && LODOP.webskt.readyState == 1) {
    if (printType == 'print') {
      _printBegin(ruleConfig, ruleContext)
    } else if (printType == 'preview' || printType == 'test') {
      if (serviceHost != '' && typeof serviceHost != 'undefined') {
        printer.PREVIEW('_dialog')
      } else {
        printer.PREVIEW()
      }
    } else {
      dialogUtil.propmtDialog('参数打印类型错误！\n', null, false, 3)
      return
    }

    ruleContext.fireRouteCallback()
  } else if (isIE() && !isIESupportWebScoket()) {
    // 兼容处理IE8 IE9 不支持web scoket, printer 自动调用post提交数据
    if (printType == 'print') {
      _printBegin(ruleConfig, ruleContext)
    } else if (printType == 'preview' || printType == 'test') {
      if (serviceHost != '' && typeof serviceHost != 'undefined') {
        printer.PREVIEW('_dialog')
      } else {
        printer.PREVIEW()
      }
    } else {
      dialogUtil.propmtDialog('参数打印类型错误！\n', null, false, 3)
      return
    }

    ruleContext.fireRouteCallback()
  } else {
    let checkStateTimer:any = null
    let maxCheckTime = 50
    let seq = 0
    let checkState = function () {
      //@ts-ignore
      if (LODOP.webskt && LODOP.webskt.readyState == 1) {
        clearTimeout(checkStateTimer)

        if (printType == 'print') {
          _printBegin(ruleConfig, ruleContext)
        } else if (printType == 'preview' || printType == 'test') {
          if (serviceHost != '' && typeof serviceHost != 'undefined') {
            printer.PREVIEW('_dialog')
          } else {
            printer.PREVIEW()
          }
        } else {
          dialogUtil.propmtDialog('参数打印类型错误！\n', null, false, 3)
          return
        }
        ruleContext.fireRouteCallback()
      } else {
        seq++
        if (seq > maxCheckTime) return
        else checkStateTimer = setTimeout(checkState, 100)
      }
    }
    checkState()
  }
}

//直接打印
let _printBegin = function (ruleConfig:any, ruleContext:RuleContext) {
  let printType = ruleConfig.printType
  let serviceHost = ruleConfig.serviceHost

  if (serviceHost != '') {
    let printerName = ruleConfig.printerName
    if (printerName != undefined && printerName != '') {
      printerName = printerName.replaceAll('\\\\', '\\')
      printer.SET_PRINTER_INDEX(printerName)
    }
  }

  printer.PRINT()
}

/**
 * 生成偏移测试打印预览<br>
 * 在画布中画出一个20mm*20mm的矩形，x,y坐标都是0
 */
let _test = function (ruleConfig:any, ruleContext:RuleContext) {
  printer.PRINT_INIT('')
  printer.SET_SHOW_MODE('NP_NO_RESULT', true)
  printer.ADD_PRINT_RECT('0mm', '0mm', '50.01mm', '50.01mm', 0, 1)
  printer.ADD_PRINT_RECT('30mm', '70.01mm', '122mm', '88mm', 0, 1)
  printer.ADD_PRINT_LINE(111, 266, 89, 283, 0, 1)
  printer.ADD_PRINT_TEXT(65, 282, 123, 25, '此处为纸张的左上角')
  printer.ADD_PRINT_RECT('36.01mm', '74mm', '50.01mm', '50.01mm', 0, 1)
  printer.ADD_PRINT_TEXT(137, 326, 87, 21, '50mm*50mm矩形')
  printer.ADD_PRINT_TEXT(2, 43, 87, 21, '50mm*50mm矩形')
  printer.ADD_PRINT_TEXT(
    123,
    504,
    217,
    21,
    '请测量矩形顶部与纸张顶部之间的距离'
  )
  printer.ADD_PRINT_SHAPE(0, 113, 461, 1, 23, 2, 1, '#FF0000')
  printer.ADD_PRINT_LINE(122, 465, 133, 506, 0, 1)
  printer.ADD_PRINT_SHAPE(0, 314, 267, 13, 1, 2, 1, '#FF0000')
  printer.ADD_PRINT_LINE(317, 273, 362, 284, 0, 1)
  printer.ADD_PRINT_TEXT(
    357,
    284,
    217,
    21,
    '请测量矩形左侧与纸张左侧之间的距离'
  )
  // 设置预览、打印等语句不返回结果(从而避免chrome对弹窗超时误报崩溃):
  if (printer.VERSION >= '6.1.9.8') printer.SET_SHOW_MODE('NP_NO_RESULT', true)

  _printOrPreviewBegin(ruleConfig, ruleContext)
  //printer.PREVIEW();

  ruleContext.fireRouteCallback()
}

/**
 * 生成打印视图
 */
let _genPrintView2 = function (template:any, data:Date) {
  printer.PRINT_INITA(10, 10, 762, 533, '')
  printer.SET_PRINT_STYLE('FontColor', '#0000FF')
  printer.ADD_PRINT_SHAPE(2, 116, 43, 655, 373, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(1, 144, 44, 653, 1, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(1, 172, 44, 653, 1, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 116, 143, 1, 56, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 116, 488, 1, 56, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 116, 574, 1, 372, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 172, 166, 1, 282, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 172, 415, 1, 282, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(1, 454, 44, 653, 1, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 454, 130, 1, 34, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 454, 483, 1, 34, 0, 1, '#800000')
  printer.ADD_PRINT_SHAPE(0, 64, 62, 120, 1, 0, 1, '#0000FF')
  printer.ADD_PRINT_SHAPE(3, 29, 62, 32, 32, 0, 4, '#0000FF')
  printer.ADD_PRINT_SHAPE(3, 21, 300, 147, 75, 0, 3, '#FF0000')
  printer.ADD_PRINT_SHAPE(3, 26, 307, 132, 65, 0, 1, '#FF0000')
  printer.ADD_PRINT_TEXT(
    33,
    192,
    408,
    30,
    tmplUtil.easyTemplate('${info_order.client_unit}', data).toString()
  )
  printer.SET_PRINT_STYLEA(0, 'FontSize', 15)
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(68, 326, 100, 25, '发 票 联')
  printer.SET_PRINT_STYLEA(0, 'FontSize', 11)
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(29, 98, 84, 35, '中国移动通信CHINA MOBILE')
  printer.ADD_PRINT_SHAPE(2, 37, 69, 18, 15, 0, 1, '#0000FF')
  printer.ADD_PRINT_SHAPE(2, 40, 73, 10, 9, 0, 1, '#0000FF')
  printer.ADD_PRINT_TEXT(70, 64, 117, 20, '移 动 信 息 专 家')
  printer.SET_PRINT_STYLEA(0, 'FontSize', 8)
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(124, 58, 68, 20, '客户名称')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(152, 58, 68, 20, '手机号码')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(124, 497, 68, 20, '受理类别')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(152, 497, 68, 20, '合 同 号')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(465, 54, 68, 20, '大写金额')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(465, 495, 104, 20, '小写金额    ￥: ')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(98, 56, 47, 20, '编号：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(98, 259, 48, 20, '日期：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(97, 500, 71, 20, '发票号码：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(496, 321, 83, 20, '营业员工号：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(496, 480, 93, 20, '收款单位名称：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(226, 703, 27, 121, '第二联发票联')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(203, 21, 17, 195, '京地税准印八九号五百万份')
  printer.SET_PRINT_STYLEA(0, 'FontSize', 8)
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 2)
  printer.ADD_PRINT_TEXT(
    126,
    150,
    100,
    20,
    tmplUtil.easyTemplate('${info_order.client_name}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    151,
    150,
    100,
    20,
    tmplUtil.easyTemplate('${info_order.client_tel}', data).toString()
  )
  printer.ADD_PRINT_TEXT(125, 584, 99, 20, '发票打印(第1次)')
  printer.ADD_PRINT_TEXT(
    465,
    140,
    198,
    20,
    tmplUtil.easyTemplate('${info_order.fee_chinese}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    465,
    599,
    70,
    20,
    tmplUtil.easyTemplate('${info_order.fee}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    496,
    408,
    59,
    20,
    tmplUtil.easyTemplate('${info_order.create_user}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    98,
    101,
    150,
    20,
    tmplUtil.easyTemplate('${info_order.bill_id}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    97,
    307,
    150,
    20,
    tmplUtil.easyTemplate('${info_order.create_time}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    152,
    584,
    103,
    20,
    tmplUtil.easyTemplate('${info_order.contact_code}', data).toString()
  )
  printer.ADD_PRINT_TEXT(
    95,
    571,
    112,
    20,
    tmplUtil.easyTemplate('${info_order.bill_num}', data).toString()
  )
  printer.SET_PRINT_STYLEA(0, 'FontName', 'System')
  printer.ADD_PRINT_TEXT(76, 500, 71, 20, '发票代码：')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#800000')
  printer.SET_PRINT_STYLEA(0, 'Alignment', 3)
  printer.ADD_PRINT_TEXT(
    74,
    571,
    112,
    20,
    tmplUtil.easyTemplate('${info_order.bill_code}', data).toString()
  )
  printer.SET_PRINT_STYLEA(0, 'FontName', 'System')
  printer.SET_PRINT_STYLEA(0, 'FontColor', '#FF0000')
  printer.ADD_PRINT_TEXT(496, 572, 112, 20, '-王府井中心店营')
  printer.ADD_PRINT_TEXT(
    191,
    217,
    100,
    20,
    tmplUtil.easyTemplate('${info_order.fee}', data).toString()
  )
  printer.ADD_PRINT_TEXT(191, 58, 100, 20, '国内漫游通话')
}

let createCLodopJSscript = function (strSrc:any) {
  let ScriptSS:any = document.getElementsByTagName('script')
  for (let i in ScriptSS) {
    if (ScriptSS[i].src && ScriptSS[i].src.indexOf('CLodopfuncs.js') >= 0) {
      if (ScriptSS[i].parentNode)
        ScriptSS[i].parentNode.removeChild(ScriptSS[i])
    }
  }
  let oscript = document.createElement('script')
  if (strSrc.indexOf('=') >= 0) {
    strSrc = strSrc.match(/=[\',\"][^\',^\"].*(?=[\',\"])/i)
    strSrc = strSrc[0].slice(2)
  }
  oscript.src = strSrc
  let head =
    document.head ||
    document.getElementsByTagName('head')[0] ||
    document.documentElement
  head.insertBefore(oscript, head.firstChild)
  return oscript
}

//打印地址有效性验证
let _checkRemoteUrl = function (url:string) {
  let result = false
  let strRegex =
    '^((https|http|ftp|rtsp|mms)?://)' +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{2,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
  let re = new RegExp(strRegex)
  if (re.test(url)) {
    result = true
  }

  return result
}

//非http开头自动补全
let _checkHttpRemoteUrl = function (urlStr:string) {
  if (urlStr.length > 0) {
    if (urlStr.indexOf('http://') != 0) {
      urlStr = 'http://' + urlStr
    }
  }

  return urlStr
}

//非/结尾自动补全
let _checkSpritRemoteUrl = function (urlStr:string) {
  if (urlStr.length > 0) {
    let str = urlStr.charAt(urlStr.length - 1)
    if (str != '/') {
      urlStr = urlStr + '/'
    }
  }
  return urlStr
}

let getDatasource = function (ruleContext:RuleContext, resultEntity:any, resultEntityType:string) {
  let datasource
  if (resultEntityType == 'entity') {
    datasource = DatasourceManager.lookup({ datasourceName: resultEntity })
  } else if (resultEntityType == 'ruleSetOutput') {
    datasource = ruleContext.getRouteContext().getOutPutParam(resultEntity)
  } else if (resultEntityType == 'ruleSetInput') {
    datasource = ruleContext.getRouteContext().getInputParam(resultEntity)
  } else if (resultEntityType == 'ruleSetVariant') {
    datasource = ruleContext.getRouteContext().getVariable(resultEntity)
  }
  return datasource
}

//获取远程打印服务
let _getRemotePrinter2 = function (
  ruleConfig:any,
  ruleContext:RuleContext,
  cfg:any,
  offset:any,
  printType:string
) {
  let serviceHost = cfg['serviceHost']
  let serverHostType = cfg['serverHostType']
  let printerName = cfg['printerName']
  let resultEntity = cfg['resultEntity']
  let resultEntityType = cfg['resultEntityType']
  let printNum = cfg['printNum']

  let context = new ExpressionContext()
  context.setRouteContext(ruleContext.getRouteContext())
  if (printType == 'custom') {
    let customType = cfg['customType']
    if (customType != '') {
      printType = ExpressEngine.execute({
        expression: customType,
        context: context
      })
    } else {
      printType = 'preview'
    }
  }
  cfg['printType'] = printType

  if (printerName != '') {
    printerName = ExpressEngine.execute({
      expression: printerName,
      context: context
    })
  }
  cfg['printerName'] = printerName

  if (printType == 'print') {
    if (typeof printNum != 'undefined' && printNum != null && printNum != '') {
      printNum = ExpressEngine.execute({
        expression: printNum,
        context: context
      })
      cfg['printNum'] = printNum
    }
  } else {
    cfg['printNum'] = 1
  }

  if ('local' != serverHostType) {
    serviceHost = ExpressEngine.execute({
      expression: serviceHost,
      context: context
    })
  }

  cfg['datasource'] = getDatasource(ruleContext, resultEntity, resultEntityType)

  let loadFunjs = 'CLodopfuncs.js'
  let CLodopfuncsUrl = ''

  if (serviceHost == '' || serviceHost === undefined) {
    serviceHost = 'http://localhost:8000/'
  }

  serviceHost = _checkHttpRemoteUrl(serviceHost) //非http开头自动补全
  serviceHost = _checkSpritRemoteUrl(serviceHost) //非/结尾自动补全

  //地址有效性验证
  let result = _checkRemoteUrl(serviceHost)
  if (!result) {
    dialogUtil.errorDialog('打印服务地址是非法的URL，请检查！\n', null, false)
    return
  }

  CLodopfuncsUrl = serviceHost + loadFunjs //组装打印服务地址

  printer = null
  let scopeId = ScopeManager.getCurrentScopeId()
  let co = 0
  let inte = self.setInterval(function () {
    if (printer != null) {
      window.clearInterval(inte)
      _lodopRegister(printer)
      printDataConvert(printer, cfg, offset)
    } else {
      if (co > 500) {
        window.clearInterval(inte)
      }
      co++
    }
  }, 50)
  //@ts-ignore
  head.js(CLodopfuncsUrl, function () {
    ScopeManager.openScope(scopeId)
    try {
      isLoaded = true
      //@ts-ignore
      if (typeof LODOP === 'undefined' || !LODOP || !LODOP.VERSION) {
        _showRemoteAndLocalPrinterInstallTips(serviceHost)
        //@ts-ignore
      } else if (LODOP.VERSION !== '6.2.2.1') {
        // 检查版本， 提示用户升级打印插件
        _showPrinterUpdateTips(serviceHost)
      } else {
        //@ts-ignore
        printer = LODOP
      }
    } finally {
      ScopeManager.closeScope()
    }
  })
  ruleContext.fireRouteCallback()
}

//打印模板
let _getRemotePrinter = function (ruleConfig:any, ruleContext:RuleContext) {
  printer = null

  let loadFunjs = 'CLodopfuncs.js'
  let host = ''
  let CLodopfuncsUrl = ''

  if (ruleConfig.serviceHost == '' || ruleConfig.serviceHost === undefined) {
    host = 'http://localhost:8000/'
  } else {
    host = ruleConfig.serviceHost
  }

  host = _checkHttpRemoteUrl(host) //非http开头自动补全
  host = _checkSpritRemoteUrl(host) //非/结尾自动补全

  //地址有效性验证
  let result = _checkRemoteUrl(host)
  if (!result) {
    dialogUtil.errorDialog('打印服务地址是非法的URL，请检查！\n', null, false)
    return
  }

  CLodopfuncsUrl = host + loadFunjs //组装打印服务地址

  let scopeId = ScopeManager.getCurrentScopeId()
  //@ts-ignore
  head.js(CLodopfuncsUrl, function () {
    ScopeManager.openScope(scopeId)
    try {
      isLoaded = true
      //@ts-ignore
      if (typeof LODOP === 'undefined' || !LODOP || !LODOP.VERSION) {
        _showRemoteAndLocalPrinterInstallTips(host)
      //@ts-ignore
      } else if (LODOP.VERSION !== '6.2.2.1') {
        // 检查版本， 提示用户升级打印插件
        _showPrinterUpdateTips(host)
      } else {
      //@ts-ignore
        printer = LODOP
        _lodopRegister(printer)
        _executePrint(ruleContext)
      }
    } finally {
      ScopeManager.closeScope()
    }
  })
}

let _lodopRegister = function (printer:any) {
  printer.SET_LICENSES(
    '同望科技股份有限公司',
    '227D7CB7AB0D5C4BECD8D05CDF543847',
    '同望科技股份有限公司',
    'C5E74B2EF91B7F622D4FB3966183E7CA'
  )
  printer.SET_LICENSES(
    'THIRD LICENSE',
    '',
    'TOONE TECHNOLOGY Co.,LTD.',
    '0988934F7AD14981887653ECC0FB78D2'
  )
}
let _showPrinterInstallTips = function () {
  let $tips = $(
    '<div style="position: fixed; background-color: #FFFF66; width: 100%; z-index: 99999999; height: 22px; top: 0px; font-family: 微软雅黑; font-size: 14px; vertical-align: middle;"></div>'
  )
  let $tipsCloser = $(
    '<div style=" position: absolute; right: 0PX; font-family: 微软雅黑; font-size: 14px; vertical-align: middle; top: 2px; font-weight: bold; color: red; cursor: pointer; width: 30px; text-align: center; ">X</div>'
  )
  $tipsCloser.click(function () {
    $tips.hide()
  })
  $tips.append($tipsCloser)
  if (navigator.userAgent.indexOf('x64'))
    $tips.append(
      '<font>打印控件未安装!点击这里<a href="itop/common/CLodop_Setup_for_Win32NT.exe" target="_self">（使用管理员权限）执行安装</a>安装后请刷新页面或重新进入。</font>'
    )
  else
    $tips.append(
      '<font>打印控件未安装!点击这里<a href="itop/common/CLodop_Setup_for_Win32NT.exe" target="_self">（使用管理员权限）执行安装</a>安装后请刷新页面或重新进入。</font>'
    )
  $('body').append($tips)
}

let _showRemoteAndLocalPrinterInstallTips = function (serviceHost:string) {
  if (!serviceHost) serviceHost = ''

  let $tips = $(
    '<div style="position: fixed; background-color: #FFFF66; width: 100%; z-index: 99999999; height: 22px; top: 0px; font-family: 微软雅黑; font-size: 14px; vertical-align: middle;"></div>'
  )
  let $tipsCloser = $(
    '<div style=" position: absolute; right: 0PX; font-family: 微软雅黑; font-size: 14px; vertical-align: middle; top: 2px; font-weight: bold; color: red; cursor: pointer; width: 30px; text-align: center; ">X</div>'
  )
  $tipsCloser.click(function () {
    $tips.hide()
  })
  $tips.append($tipsCloser)
  if (navigator.userAgent.indexOf('x64'))
    $tips.append(
      '<font>' +
        serviceHost +
        " 打印服务未安装！点击这里<a href='itop/common/CLodop_Setup_for_Win32NT.exe' target='_self'>（使用管理员权限）执行安装</a> 安装后请刷新页面或重新进入。</font>"
    )
  else
    $tips.append(
      '<font>' +
        serviceHost +
        " 打印服务未安装！点击这里<a href='itop/common/CLodop_Setup_for_Win32NT.exe' target='_self'>（使用管理员权限）执行安装</a> 安装后请刷新页面或重新进入。</font>"
    )
  $('body').append($tips)
}

let _showPrinterUpdateTips = function (serviceHost:string) {
  if (!serviceHost) serviceHost = ''

  let $tips = $(
    '<div style="position: fixed; background-color: #FFFF66; width: 100%; z-index: 99999999; height: 22px; top: 0px; font-family: 微软雅黑; font-size: 14px; vertical-align: middle;"></div>'
  )
  let $tipsCloser = $(
    '<div style=" position: absolute; right: 0PX; font-family: 微软雅黑; font-size: 14px; vertical-align: middle; top: 2px; font-weight: bold; color: red; cursor: pointer; width: 30px; text-align: center; ">X</div>'
  )
  $tipsCloser.click(function () {
    $tips.hide()
  })
  $tips.append($tipsCloser)
  $tips.append(
    '<font>' +
      serviceHost +
      '打印控件需要升级!点击这里<a href="itop/common/CLodop_Setup_for_Win32NT.exe" target="_self">（使用管理员权限）执行升级</a>，升级后请刷新页面或重新进入。</font>'
  )
  $('body').append($tips)
}

/**
 * 获取打印控件，该函数由Lodop提供
 */
let _getPrinter = function (oOBJECT:any, oEMBED:any) {
  let CreatedOKLodop7766 = null
  let strHtmInstall =
    "<font color='#FF00FF'>打印控件未安装!点击这里<a href='itop/common/install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
  let strHtmUpdate =
    "<font color='#FF00FF'>打印控件需要升级!点击这里<a href='itop/common/install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
  let strHtm64_Install =
    "<font color='#FF00FF'>打印控件未安装!点击这里<a href='itop/common/install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>"
  let strHtm64_Update =
    "<font color='#FF00FF'>打印控件需要升级!点击这里<a href='itop/common/install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
  let strHtmFireFox =
    "<font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>"
  let strHtmChrome =
    "<font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>"
  let LODOP
  let is64IE
  try {
    // =====判断浏览器类型:===============
    let isIE =
      navigator.userAgent.indexOf('MSIE') >= 0 ||
      navigator.userAgent.indexOf('Trident') >= 0
    is64IE = isIE && navigator.userAgent.indexOf('x64') >= 0
    // =====如果页面有Lodop就直接使用，没有则新建:==========
    if (oOBJECT != undefined || oEMBED != undefined) {
      if (isIE) LODOP = oOBJECT
      else LODOP = oEMBED
    } else {
      if (CreatedOKLodop7766 == null) {
        LODOP = document.createElement('object')
        //@ts-ignore
        LODOP.setAttribute('width', 0)
        //@ts-ignore
        LODOP.setAttribute('height', 0)
        LODOP.setAttribute(
          'style',
          'position:absolute;left:0px;top:-100px;width:0px;height:0px;'
        )
        if (isIE)
          LODOP.setAttribute(
            'classid',
            'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'
          )
        else LODOP.setAttribute('type', 'application/x-print-lodop')
        document.documentElement.appendChild(LODOP)
        CreatedOKLodop7766 = LODOP
      } else LODOP = CreatedOKLodop7766
    }
    // =====判断Lodop插件是否安装过，没有安装或版本过低就提示下载安装:==========
    if (LODOP == null || typeof LODOP.VERSION == 'undefined') {
      let $tips = $(
        '<div style="position: fixed; background-color: #FFFF66; width: 100%; z-index: 99999999; height: 22px; top: 0px; font-family: 微软雅黑; font-size: 14px; vertical-align: middle;"></div>'
      )
      let $tipsCloser = $(
        '<div style=" position: absolute; right: 0PX; font-family: 微软雅黑;    font-size: 14px; vertical-align: middle; top: 2px; font-weight: bold; color: red; cursor: pointer; width: 30px; text-align: center; ">X</div>'
      )
      $tipsCloser.click(function () {
        $tips.hide()
      })
      $tips.append($tipsCloser)
      if (is64IE) {
        $tips.append(
          '<font>打印控件未安装!点击这里<a href="itop/common/install_lodop64.exe" target="_self">执行安装</a>,安装后请刷新页面或重新进入。</font>'
        )
      } else if (isIE) {
        $tips.append(
          '<font>打印控件未安装!点击这里<a href="itop/common/install_lodop32.exe" target="_self">执行安装</a>,安装后请刷新页面或重新进入。</font>'
        )
      } else {
        $tips.append(
          '<font>打印控件未安装!点击这里<a href="itop/common/install_lodop32.exe" target="_self">执行安装</a>,安装后请刷新页面或重新进入。</font>'
        )
      }
      $('body').append($tips)
      return LODOP
    } else if (LODOP.VERSION < '6.2.2.1') {
      let $tips = $(
        '<div style="position: fixed; background-color: #FFFF66; width: 100%; z-index: 99999999; height: 22px; top: 0px; font-family: 微软雅黑; font-size: 14px; vertical-align: middle;"></div>'
      )
      let $tipsCloser = $(
        '<div style=" position: absolute; right: 0PX; font-family: 微软雅黑;    font-size: 14px; vertical-align: middle; top: 2px; font-weight: bold; color: red; cursor: pointer; width: 30px; text-align: center; ">X</div>'
      )
      $tipsCloser.click(function () {
        $tips.hide()
      })
      $tips.append($tipsCloser)
      if (is64IE)
        $tips.append(
          '<font>打印控件需要升级!点击这里<a href="itop/common/install_lodop64.exe" target="_self">执行升级</a>,升级后请重新进入。</font>'
        )
      else if (isIE)
        $tips.append(
          '<font>打印控件需要升级!点击这里<a href="itop/common/install_lodop32.exe" target="_self">执行升级</a>,升级后请重新进入。</font>'
        )
      else
        $tips.append(
          '<font>打印控件需要升级!点击这里<a href="itop/common/install_lodop32.exe" target="_self">执行升级</a>,升级后请重新进入。</font>'
        )
      $('body').append($tips)
      return LODOP
    }
    // =====如下空白位置适合调用统一功能(如注册码、语言选择等):====

    // ============================================================
    return LODOP
  } catch (err) {
    if (is64IE)
      document.documentElement.innerHTML =
        'Error:' + strHtm64_Install + document.documentElement.innerHTML
    else
      document.documentElement.innerHTML =
        'Error:' + strHtmInstall + document.documentElement.innerHTML
    return LODOP
  }
}

export { main }
