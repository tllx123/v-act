import { FrontEndAlerter as frontEndAlerter } from '@v-act/vjs.framework.extension.platform.interface.alerter'
import { Modal as viewModel } from '@v-act/vjs.framework.extension.platform.services.view.modal'

export function initModule(sandbox) {}

const print = function (cfg, offset) {
  doPrint(cfg, offset, 'print')
}

const preview = function (cfg, offset) {
  doPrint(cfg, offset, 'preview')
}

const selectPrint = function (cfg, offset) {
  doPrint(cfg, offset, 'selectPrint')
}

let showFrmSelectPrinter = function (printer, cfg, offset, printType) {
  let html = createFrmSelectPrinter()
  viewModel.create({
    title: '选择打印机',
    width: 400,
    height: 260,
    rendered: function (containerCode, closeFunc, setTitleFunc) {
      $('#' + containerCode).html(html)

      let srcPrinterName = cfg['printerName']
      let srcPrintNum = cfg['printNum']
      getAllPrinter(printer, srcPrinterName, srcPrintNum)

      $('#btnOK').click(function () {
        let selPrinterName = $('#cmbPrinterName').val()
        let selPrintNumVal = $('#txtPrintNum').val()
        let selPrintNum = getPrintNum(selPrintNumVal)
        if (selPrintNum > 0) {
          // 打印机名称
          cfg['printerName'] = selPrinterName
          // 打印份数
          cfg['printNum'] = selPrintNum
          //执行打印
          executePrint(printer, cfg, offset, 'print')
          //关闭页面
          closeFunc()
        } else {
          alert('请输入大于0的整数。')
        }
      })

      $('#btnCancel').click(function () {
        closeFunc()
      })
    },
    closed: function (containerCode, closeHandle) {
      closeHandle()
    },
    resized: function (containerCode) {},
    formBorderStyle: 'FixedSingle',
    maximizeBox: false,
    windowState: 'Normal'
  })
}

let createFrmSelectPrinter = function () {
  let html =
    '<style>' +
    'body{padding:0;margin:0}' +
    '.m-printModel {font-size:12px;}' +
    '.m-printModel ul{padding:24px;list-style:none;}' +
    '.m-printModel ul li{margin-bottom:16px;}' +
    ".m-printModel ul li:after{content:'';clear:both;display:table}" +
    '.m-printModel ul li label{text-align: right;vertical-align: middle;float: left;font-size: 12px;color: #515a6e;line-height: 32px;padding: 0 8px 0  0;box-sizing: border-box;color: #0a0a0a;width:90px;}' +
    '.m-printModel .m-inputs {box-sizing:border-box;width:240px;height:32px;line-height:1.5;padding:4px 7px;color: #515a6e;background:#fff;border:1px solid #ddd;border-radius:4px;transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;}' +
    '.m-printModel .m-inputs:hover {border-color: #57a3f3;}' +
    '.m-printModel .m-inputs:focus {border-color: #57a3f3;outline: 0;box-shadow: 0 0 0 2px rgba(45,140,240,.2);}' +
    '.m-printModel .formItem {float:left;line-height:32px;font-weight:bold;}' +
    '.m-printModel-toolBar {padding:16px;border-top:1px solid #eee;text-align:right;}' +
    '.m-printModel-toolBar .modalBtn {display: inline-block;margin-left:4px;padding:5px 15px 6px;font-size:12px;text-align: center;border: 1px solid transparent;border-radius:4px;cursor:pointer;user-select:none;transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;text-decoration:none;}' +
    '.m-printModel-toolBar .modalBtn:focus {box-shadow: 0 0 0 2px rgba(45,140,240,.2);}' +
    '.m-printModel-toolBar .modalBtn-primary{color:#fff;background-color: #2d8cf0;border-color: #2d8cf0;}' +
    '.m-printModel-toolBar .modalBtn-primary:hover{background-color: #57a3f3;border-color: #57a3f3;}' +
    '.m-printModel-toolBar .modalBtn-default{color: #515a6e;background:#fff;border-color:#dcdee2;}' +
    '.m-printModel-toolBar .modalBtn-default:hover{color:#2d8cf0;border-color:#2d8cf0;}' +
    '</style>' +
    '<div class="m-printModel">' +
    '<ul>' +
    '<li>' +
    '<label>目标打印机：</label>' +
    '<div class="formItem">' +
    '<select id="cmbPrinterName" class="m-inputs"></select>' +
    '</div>' +
    '</li>' +
    '<li>' +
    '<label>打印份数：</label>' +
    '<div class="formItem">' +
    '<input type="text" id="txtPrintNum" class="formItem m-inputs" value="1">' +
    '</div>' +
    '</li>' +
    '<li>' +
    '<label id="lblMsg"></label>' +
    '</li>' +
    '</ul>' +
    '<div class="m-printModel-toolBar">' +
    '<a href="#" id="btnCancel" class="modalBtn modalBtn-default">取消</a>' +
    '<a href="#" id="btnOK" class="modalBtn modalBtn-primary">确定</a>' +
    '</div>' +
    '</div>'
  return html
}

let getAllPrinter = function (printer, srcPrinterName, srcPrintNum) {
  let isExist = false
  let iPrinterCount = printer.GET_PRINTER_COUNT()
  for (let i = 0; i < iPrinterCount; i++) {
    let option = document.createElement('option')
    let printName = printer.GET_PRINTER_NAME(i)
    if (printName == srcPrinterName) {
      isExist = true
    }
    option.innerHTML = printName
    option.value = printName
    document.getElementById('cmbPrinterName').appendChild(option)
  }

  if (isExist) {
    $('#cmbPrinterName').val(srcPrinterName)
  }

  let val = getPrintNum(srcPrintNum)
  if (val > 0) {
    $('#txtPrintNum').val(srcPrintNum)
  } else {
    $('#txtPrintNum').val(1)
  }
}

let getPrintNum = function (printNumVal) {
  let val = -1
  let r = /^\+?[1-9][0-9]*$/
  let flag = r.test(printNumVal)
  if (flag) {
    let printNum = Number(printNumVal)
    if (printNum > 0) {
      val = printNum
    }
  }
  return val
}

// 准备打印
let doPrint = function (cfg, offset, printType) {
  if (offset == null) {
    offset = {}
    offset.offsetLeft = 0
    offset.offsetTop = 0
  }
  let service = cfg['serviceHost']
  let isService = true
  if (service == '' || service === undefined) {
    isService = false
  }

  let serviceHost = getServiceHost(cfg)
  let result = checkServiceHost(serviceHost)
  if (!result) {
    let params = {}
    params.title = '打印服务地址检查'
    params.msgHeader = ''
    params.msg = '打印服务地址是非法的URL，请检查！'
    frontEndAlerter.error(params)

    return
  }

  let printer = null
  //最大重试次数
  let maxTryTimes = 300
  //当前重试次数
  let curTryTimes = 0
  //timer轮询
  let printerTimer = self.setInterval(function () {
    if (printer != null) {
      window.clearInterval(printerTimer)
      //注册许可证信息
      registerLicenses(printer)
      if (printType == 'selectPrint') {
        //选择打印机
        showFrmSelectPrinter(printer, cfg, offset, printType)
      } else {
        //执行打印
        executePrint(printer, cfg, offset, printType)
      }
    } else {
      if (curTryTimes > maxTryTimes) {
        window.clearInterval(printerTimer)
      }
      curTryTimes++
    }
  }, 100)

  // 组装打印服务地址, 加载CLodopfuncs.js
  let lodopFuncsUrl = serviceHost + 'CLodopfuncs.js'
  head.js(lodopFuncsUrl, function () {
    isLoaded = true
    if (typeof LODOP === 'undefined' || !LODOP || !LODOP.VERSION) {
      if (!isService) {
        lodopFuncsUrl = 'http://localhost:18000/CLodopfuncs.js'
        head.js(lodopFuncsUrl, function () {
          isLoaded = true
          if (typeof LODOP === 'undefined' || !LODOP || !LODOP.VERSION) {
            showPrinterInstallTips(serviceHost)
          } else if (LODOP.VERSION !== '6.2.2.1') {
            showPrinterUpdateTips(serviceHost)
          } else {
            printer = LODOP
          }
        })
      } else {
        showPrinterInstallTips(serviceHost)
      }
    } else if (LODOP.VERSION !== '6.2.2.1') {
      showPrinterUpdateTips(serviceHost)
    } else {
      printer = LODOP
    }
  })
}

// 获取打印服务地址
let getServiceHost = function (cfg) {
  let serviceHost = cfg['serviceHost']
  if (serviceHost == '' || serviceHost === undefined) {
    serviceHost = 'http://localhost:8000/'
  }
  //开头补全http://
  if (serviceHost.indexOf('http://') < 0) {
    serviceHost = 'http://' + serviceHost
  }
  //结尾补全/
  let str = serviceHost.charAt(serviceHost.length - 1)
  if (str != '/') {
    serviceHost = serviceHost + '/'
  }
  cfg['serviceHost'] = serviceHost
  return serviceHost
}

// 校验打印服务地址是否有效
let checkServiceHost = function (url) {
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
  let regExp = new RegExp(strRegex)
  if (regExp.test(url)) {
    result = true
  }

  return result
}

// 注册许可证信息
let registerLicenses = function (printer) {
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

// 提示用户安装打印插件
let showPrinterInstallTips = function (serviceHost) {
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

// 提示用户升级打印插件
let showPrinterUpdateTips = function (serviceHost) {
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

// 执行打印
let executePrint = function (printer, cfg, offset, printType) {
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
  // 获取打印极所有纸张
  let printerPapers = getPrinterPapers(printer, printerName)
  // 打印数据源
  let datasource = cfg['datasource']
  // 打印比例
  let zoomScale = 100
  let map = {}
  for (let i = 0; i < datasource.length; i++) {
    // 获取报表数据
    let objs = datasource[i]
    let obj = JSON.parse(objs)
    // 获取打印设置
    let printSetting = JSON.parse(obj['print'])
    // 打印方向
    let orient = printSetting['orient']
    // 打印纸张名称
    let paperName = getPaperName(printSetting['paperSize'])
    // 打印比例
    let zoomScaleStr = printSetting['zoomScale']
    if (zoomScaleStr == null || zoomScaleStr == '' || zoomScaleStr == 'null')
      zoomScale = 100
    else zoomScale = Number(zoomScaleStr) * 100
    // 根据纸张方向尺寸生成关键字，用于批量打印时归类（横向，纵向）打印
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

  let printReportTimer = null
  //最大重试次数
  let printReportMaxTime = 300
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
        let orient = key.split('_')[0] //打印方向横向纵向
        let paperName = key.split('_')[1] //打印纸张名称
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
          let tMarginPx = Number(printSetting['tMargin']) //上边距
          let lMarginPx = Number(printSetting['lMargin']) //左边距
          let rMarginPx = Number(printSetting['rMargin']) //右边距
          let bMarginPx = Number(printSetting['bMargin']) //下边距
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

//获取打印机序号
let getPrinterIndex = function (printer, printerName) {
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
let getPrinterPapers = function (printer, printerName) {
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
let getPaperName = function (paperSize) {
  let paperNames = {
    'null': 'A4',
    '8': 'A3',
    '11': 'A5',
    '66': 'A2',
    '70': 'A5'
  }
  let paperSize = paperNames[paperSize]
  return paperSize
}

let getHost = function (path) {
  let host = window.location.protocol + '//' + window.location.host + '/' + path
  return host
}

let addImg = function (printer, imgs, tableIndex, tMargin, lMargin) {
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

export { preview, print, selectPrint }
