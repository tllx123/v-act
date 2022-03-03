import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as expressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { DatasourcePuller as datasourcePuller } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { SerialNumberUtil as serialNumberUtil } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let sepcialStrArr = ['/', '%', '_', '[', ']'] //特殊字符
  let ruleCfg = ruleContext.getRuleCfg()
  let paramsValue = ruleCfg['inParams']
  let params = jsonUtil.json2obj(paramsValue)

  let dataSource = params['dataSource']
  let dsColumn = params['dsColumn']
  let length = params['length'] //流水号位数
  let context = new expressionContext()
  context.setRouteContext(ruleContext.getRouteContext()) //支持表达式
  if (length != undefined && length != '' && length != null) {
    length = engine.execute({
      expression: length,
      context: context
    })
  }
  let coverLetter = params['coverLetter']
  let range = params['range']
  let isReuseSerialNumber = params['isReuseSerialNumber']
  let content = params['content']
  //表和实体的映射关系
  let relationTable = params['relationTable']
  let relationTableColumn = params['relationTableColumn']
  let routeContext = ruleContext.getRouteContext()

  if (undefined != content && null != content) {
    let sortItem = [] //待组装数组
    let codeSortNum = -1 //流水号对应编号的下标
    let codeSortNums = [] //流水号对应编号的下标
    let frontTotalCount = 0 //流水号前面的所有项数量
    let frontCount = 0 // 流水号前面非关键字项数量
    let backCount = 0 // 流水号后面非关键字项数量
    let prefixStr = '' // 流水号前面字串
    let suffixStr = '' // 流水号后面字串
    let prefix = '' //流水号关键字串
    let isLeftSubFlag = true // 是否左边截取
    let leftLength = 0 // 从左边截取的字串长度
    let rightLength = 0 // 从右边解决的字串长度
    // 根据order进行排序
    content.sort(function (x, y) {
      return x['order'] - y['order']
    })
    let totalLength = content.length
    for (let i = 0; i < totalLength; i++) {
      let item = content[i]
      let type = item['type']
      let value = item['value']
      let order = item['order'] * 1
      let isReGenerate = item['isReGenerate']
      switch (type) {
        case '0': //自定义
          break
        case 'expression': //表达式
          var context = new expressionContext()
          context.setRouteContext(routeContext)
          value = engine.execute({
            expression: value,
            context: context
          })
          break
        case '2': //组件变量
          value = windowParam.getInput({
            code: value
          })
          break
        case '3': //系统变量
          value = componentParam.getVariant({
            code: value
          })
          break
        case 'dateAndTime': //当前日期时间
          var context = new expressionContext()
          context.setRouteContext(routeContext)
          value = engine.execute({
            expression: 'GetDateString("' + value + '")',
            context: context
          })
          break
        case '5': //实体字段
          var tempTabName = value.substring(0, value.indexOf('.'))
          var tempColName = value.substring(
            value.indexOf('.') + 1,
            value.length
          )
          var datasource = manager.lookup({
            datasourceName: tempTabName
          })
          var record = datasource.getCurrentRecord()
          if (record) value = record.get(tempColName)
          else value = ''
          break
        case 'serialNumber': //流水号
          codeSortNum = i
          codeSortNums.push(i)
          break
        default:
          break
      }
      // 以备后面组装
      sortItem.push(value)
      value = value + ''
      if (type != 'serialNumber') {
        // begin:兼容规则改造前数据 原有逻辑是把流水号前的内容值作为前缀
        if (undefined == isReGenerate && codeSortNum == -1) {
          isReGenerate = true
          item['isReGenerate'] = true
        }
        // end:兼容规则改造前数据

        // 非流水号项处理
        if (codeSortNum == -1) {
          // 流水号前面项
          frontTotalCount++
          if (
            isReGenerate == true ||
            isReGenerate + ''.toLowerCase() == 'true'
          ) {
            if (value != null) {
              prefix = prefix + value // 获取key
              leftLength = leftLength + value.length //获取长度
              // 特殊字符处理
              for (
                let speIndex = 0;
                speIndex < sepcialStrArr.length;
                speIndex++
              ) {
                if (value.indexOf(sepcialStrArr[speIndex]) > -1) {
                  if (sepcialStrArr[speIndex] == '/') {
                    value = value.replace(/\//gi, '//')
                  } else if (sepcialStrArr[speIndex] == '[') {
                    value = value.replace(/\[/gi, '/[')
                  } else {
                    value = value.replace(
                      eval('/' + sepcialStrArr[speIndex] + '/gi'),
                      '/' + sepcialStrArr[speIndex]
                    )
                  }
                }
              }
            }
          } else {
            if (type == '0') {
              prefix = prefix + value
              leftLength = leftLength + value.length //获取长度
            } else {
              isLeftSubFlag = false
              frontCount++
              value = '%' // 拼接查询串
            }
          }
          if (value != null && value != 'null') prefixStr = prefixStr + value
        } else if (codeSortNum > -1) {
          // 流水号后面项
          if (
            isReGenerate == true ||
            isReGenerate + ''.toLowerCase() == 'true'
          ) {
            if (value != null) {
              prefix = prefix + value // 获取key
              rightLength = rightLength + value.length //获取长度
              // 特殊字符处理
              for (
                let speIndex = 0;
                speIndex < sepcialStrArr.length;
                speIndex++
              ) {
                if (value.indexOf(sepcialStrArr[speIndex]) > -1) {
                  if (sepcialStrArr[speIndex] == '/')
                    value = value.replace(/\//gi, '//')
                  else if (sepcialStrArr[speIndex] == '[')
                    value = value.replace(/\[/gi, '/[')
                  else
                    value = value.replace(
                      eval('/' + sepcialStrArr[speIndex] + '/gi'),
                      '/' + sepcialStrArr[speIndex]
                    )
                }
              }
            }
          } else {
            backCount++
            value = '%'
          }
          if (value != null && value != 'null') suffixStr = suffixStr + value
        }
      }
    }

    let backTotalCount = totalLength - 1 - frontTotalCount //流水号后面的所有项数量=总项数-流水号项目数1-前面项数
    // 如果流水号项存在，前面项数不为空，后面项数不为空，前面存在非关键字项并且后面存在非关键字项, 那么无法截取数据库中的流水号，故此种情况不允许。
    if (
      codeSortNum > -1 &&
      frontTotalCount > 0 &&
      backTotalCount > 0 &&
      frontCount > 0 &&
      backCount > 0
    )
      throw new Error('不支持此配置：不能同时在流水号项两端配置非标识项')

    // 如果是从左边截取截取长度取正数，右边截取长度取负数
    let subLength
    if (isLeftSubFlag == true) subLength = 1 * leftLength
    else subLength = -1 * rightLength

    // 组装like的字串
    let likeValStr = prefixStr
    for (let leIndex = 0; leIndex < length; leIndex++)
      likeValStr = likeValStr + '_'
    likeValStr = likeValStr + suffixStr

    let ids = []
    switch (range) {
      case '0': //选中行
        // 临时方案：没有选中行数据，取当前行数据
        // 解决协同平台设计管理 单据编号新增实体记录后不能获取选中数据问题
        var selectedValues = datasourcePuller.getSelectedAndCurrentRecords({
          datasourceName: dataSource
        })
        //var selectedValues = viewModel.getDataModule().getSelectedOrCurrentRowByDS(dataSource);
        if (selectedValues && selectedValues.length > 0) {
          for (var i = 0; i < selectedValues.length; i++) {
            ids.push(selectedValues[i].getSysId())
          }
        }
        break
      case '1': //所有行
        var datasource = manager.lookup({
          datasourceName: dataSource
        })
        var selectedValues = datasource.getAllRecords()
        if (selectedValues && selectedValues.toArray().length > 0) {
          selectedValues = selectedValues.toArray()
          for (var i = 0; i < selectedValues.length; i++) {
            ids.push(selectedValues[i].getSysId())
          }
        }
        break
      case '2': //字段为空的记录
        var datasource = manager.lookup({
          datasourceName: dataSource
        })
        var selectedValues = datasource.getAllRecords()
        if (selectedValues && selectedValues.toArray().length > 0) {
          selectedValues = selectedValues.toArray()
          for (var i = 0; i < selectedValues.length; i++) {
            // 判断当前字段为空，保存记录ID
            if (!selectedValues[i].get(dsColumn)) {
              ids.push(selectedValues[i].getSysId())
            }
          }
        }
        break
      default:
        break
    }

    let values = []
    let ds = manager.lookup({
      datasourceName: dataSource
    })
    let dtds = []
    //标记规则为异步
    ruleContext.markRouteExecuteUnAuto()
    for (let i = 0; i < ids.length; i++) {
      let dtd = $.Deferred()
      dtds.push(dtd)
      let result = ''
      if (codeSortNums.length > 0) {
        for (let j = 0; j < codeSortNums.length; j++) {
          let curCodeSortNum = codeSortNums[j]
          if (j == 0) {
            if (curCodeSortNum > -1) {
              let context = new expressionContext()
              context.setRouteContext(routeContext)
              let scope = scopeManager.getWindowScope(),
                windowCode = scope.getWindowCode()
              //不缓存流水号时，传入映射的表和表字段
              if (isReuseSerialNumber) {
                let sourceName = dataSource
                let sourceColumn = dsColumn
                if (
                  relationTable != undefined &&
                  relationTable != null &&
                  relationTable != ''
                ) {
                  sourceName = relationTable
                }
                if (
                  relationTableColumn != undefined &&
                  relationTableColumn != null &&
                  relationTableColumn != ''
                ) {
                  sourceColumn = relationTableColumn
                }
                /*var codeValue = engine.execute({
                                    "expression": "GetSerialNumber(\"" + sourceName + "\",\"" + sourceColumn + "\",\"" + prefix + "\"," + length + ",\"" + coverLetter + "\",\"" + likeValStr + "\",\"" + subLength + "\",\"" + isLeftSubFlag + "\",\"" + isReuseSerialNumber + "\")",
                                    "context": context
                                });*/
                //sortItem[curCodeSortNum] = codeValue;
                let params = {
                  moduleId: windowCode,
                  TableName: sourceName,
                  TableColumn: sourceColumn,
                  prefix: prefix,
                  Length: length,
                  CoverLetter: coverLetter,
                  likeValStr: likeValStr,
                  subLength: subLength,
                  isLeftSubFlag: isLeftSubFlag,
                  isReuseSerialNumber: isReuseSerialNumber,
                  isAsync: true,
                  success: (function (dd) {
                    return function (result) {
                      sortItem[curCodeSortNum] = result
                      ruleContext.setRuleStatus(true)
                      dd.resolve()
                    }
                  })(dtd)
                }
                serialNumberUtil.getSerialNumber(params)
              } else {
                /*var codeValue = engine.execute({
                                    "expression": "GetSerialNumber(\"" + dataSource + "\",\"" + dsColumn + "\",\"" + prefix + "\"," + length + ",\"" + coverLetter + "\",\"" + likeValStr + "\",\"" + subLength + "\",\"" + isLeftSubFlag + "\",\"" + isReuseSerialNumber + "\")",
                                    "context": context
                                });*/
                //sortItem[curCodeSortNum] = codeValue;
                let params = {
                  moduleId: windowCode,
                  TableName: dataSource,
                  TableColumn: dsColumn,
                  prefix: prefix,
                  Length: length,
                  CoverLetter: coverLetter,
                  likeValStr: likeValStr,
                  subLength: subLength,
                  isLeftSubFlag: isLeftSubFlag,
                  isReuseSerialNumber: isReuseSerialNumber,
                  isAsync: true,
                  success: (function (dd) {
                    return function (result) {
                      sortItem[curCodeSortNum] = result
                      ruleContext.setRuleStatus(true)
                      dd.resolve()
                    }
                  })(dtd)
                }
                serialNumberUtil.getSerialNumber(params)
              }
            }
          } else {
            // 如果有多个流水号，那么从二个流水号开始，都取第一个流水号的值
            sortItem[curCodeSortNum] = sortItem[codeSortNums[0]]
          }
        }
      } else {
        ruleContext.setRuleStatus(true)
        dtd.resolve()
      }
      $.when(dtd).done(
        (function (index) {
          return function () {
            //处理最后结果
            var result = ''
            for (var j = 0; j < sortItem.length; j++) {
              var sortValue = sortItem[j]
              if (sortValue != null) {
                result += sortValue
              }
            }
            // 直接从db获取需要更新的记录
            var value = ds.getRecordById(ids[index])
            value.set(dsColumn, result)
            values.push(value)
          }
        })(i)
      )
    }
    $.when.apply($.when, dtds).done(function () {
      //更新界面数据
      ds.updateRecords({
        records: values
      })
      //释放规则链
      ruleContext.fireRuleCallback()
      ruleContext.fireRouteCallback()
    })
    $.when.apply($.when, dtds).fail(function () {
      //释放规则链
      ruleContext.fireRuleCallback()
      ruleContext.fireRouteCallback()
    })
  }
}

export { main }
